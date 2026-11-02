---
title: "MySQL OFFSET은 왜 뒤로 갈수록 느려질까?"
date: 2026-09-17
categories:
  - database
  - mysql
tags:
  - mysql
  - pagination
  - offset
  - b-tree
  - explain-analyze
toc: true
toc_sticky: true
---

## 결론

예를들어 `LIMIT 3000 OFFSET 210000`은 21만 번째 행으로 곧바로 이동하라는 명령이 아니다.  
MySQL은 쿼리의 조건과 정렬 순서에 맞는 행을 앞에서부터 찾고, 그중 21만 건을 버린 뒤 다음 3,000건을 반환한다.

> **OFFSET이 뒤로 갈수록 느려지는 이유는 결과로 돌려주지 않을 앞 행까지 읽어야 하기 때문이다.**

인덱스가 있어도 이 비용이 무조건 사라지지는 않는다. 인덱스는 `id = 210000`처럼 키 값이 주어지면 해당 인덱스 레코드를 빠르게 찾을 수 있다. 하지만 `OFFSET 210000`의 숫자는 키가 아니라 건너뛸 결과 개수다. 어떤 행이 210,001번째 결과인지는 앞의 21만 건에 조건과 정렬을 적용해 세어 봐야 알 수 있다.

이 글에서는 `LIMIT/OFFSET`이 어떤 일을 하는지, B-Tree 인덱스가 있는데도 큰 OFFSET이 느려지는 이유는 무엇인지, `EXPLAIN ANALYZE`로 무엇을 확인해야 하는지 정리한다.

## 문제를 발견한 코드

대량 데이터를 일정한 크기로 나누어 읽는 코드가 있었다. 업무 이름과 테이블 구조를 걷어내면 조회 방식은 다음과 같다.

```java
public List<Map<String, Object>> findDocuments(
    long tenantId,
    int pageSize,
    int offset
) {
    String sql = """
        SELECT id, title, created_at
        FROM documents
        WHERE tenant_id = :tenantId
        LIMIT :pageSize
        OFFSET :offset
        """;

    Map<String, Object> params = Map.of(
        "tenantId", tenantId,
        "pageSize", pageSize,
        "offset", offset
    );

    return jdbcTemplate.queryForList(sql, params);
}
```

페이지 크기가 3,000이라면 OFFSET은 `0`, `3,000`, `6,000`처럼 증가한다. 애플리케이션이 받는 행은 매번 최대 3,000건으로 같지만, 데이터베이스가 처리해야 하는 행까지 같은 것은 아니다.

그리고 이 예제에는 `ORDER BY`가 없다. 정렬을 지정하지 않은 페이징은 페이지 경계에서 중복이나 누락을 만들 수 있는 별개의 문제다. 여기서는 OFFSET의 읽기 비용만 분리해서 보기 위해 이후 실습 쿼리에 `ORDER BY id`를 사용한다.

## LIMIT과 OFFSET이 의미하는 것

MySQL은 다음 두 문법을 모두 지원한다.

```sql
LIMIT offset, row_count;

LIMIT row_count OFFSET offset;
```

두 번째 형태를 기준으로 각 값은 다음을 뜻한다.

- `row_count`: 클라이언트에 반환할 최대 행 수
- `offset`: 결과의 시작 지점 앞에서 제외할 행 수

예를 들어 다음 쿼리는 정렬 결과의 100,001번째 행부터 최대 20건을 반환한다.

```sql
SELECT id
FROM documents
ORDER BY id
LIMIT 20 OFFSET 100000;
```

여기서 중요한 표현은 **100,001번째 행부터 반환한다**는 것이다. MySQL이 100,001번째 행의 저장 위치를 알고 그곳으로 바로 이동한다는 뜻은 아니다.

## B-Tree에는 결과의 순번이 없다

InnoDB의 일반 인덱스는 흔히 B+Tree라고 설명하는 B-Tree 계열의 구조를 사용한다. MySQL 공식 문서는 이를 넓은 의미의 B-Tree로 표현한다. 인덱스 레코드는 리프 페이지에 키 순서로 저장되므로 `id = 100000` 같은 동등 조건이나 `id > 100000` 같은 범위 조건의 시작점을 빠르게 찾을 수 있다.

```sql
SELECT id
FROM documents
WHERE id > 100000
ORDER BY id
LIMIT 20;
```

이 쿼리에는 `100000`이라는 **키 값**이 있다. B-Tree를 따라 그 값이 있는 위치를 찾고, 그다음 범위를 순서대로 읽을 수 있다.

반면 OFFSET에는 시작점으로 사용할 키가 없다.

```sql
SELECT id
FROM documents
ORDER BY id
LIMIT 20 OFFSET 100000;
```

`100000`은 `id`가 아니라 **버릴 행의 개수**다. 인덱스에는 현재 쿼리의 조건을 만족하는 행마다 1번, 2번, 3번 같은 결과 순번이 붙어 있지 않다. 따라서 쿼리 실행기(Query Executor)는 InnoDB로부터 인덱스 레코드를 순서대로 전달받아 앞의 10만 건을 버린 뒤 20건을 반환한다.

```mermaid
flowchart LR
    A[인덱스 탐색 시작] --> B[앞의 OFFSET개 행 읽기]
    B --> C[결과에서 버리기]
    C --> D[LIMIT개 행 읽기]
    D --> E[클라이언트에 반환]
```

인덱스가 하는 일과 하지 않는 일을 구분하면 이해하기 쉽다.

| 인덱스가 잘하는 일 | OFFSET이 요구하는 일 |
|---|---|
| 특정 키 찾기 | 조건을 만족하는 N번째 행 찾기 |
| 키 범위의 시작점 찾기 | 앞의 N개 결과를 세고 제외하기 |
| 키 순서로 연속해서 읽기 | 결과 순번으로 임의 이동하기 |

"인덱스가 있는데 왜 느리지?"라는 질문의 답도 여기에 있다. 인덱스를 사용하면 테이블 전체를 읽거나 별도로 정렬하는 비용을 줄일 수는 있지만, 큰 OFFSET만큼 앞의 인덱스 레코드를 읽고 버리는 일까지 없애주지는 못한다.

## 페이지가 뒤로 갈수록 처리량이 증가한다

`LIMIT 3000`으로 데이터를 읽는다고 가정해 보자.

| 페이지 | OFFSET | 반환 행 | 최대한 단순화한 처리 행 |
|---:|---:|---:|---:|
| 1 | 0 | 3,000 | 3,000 |
| 2 | 3,000 | 3,000 | 6,000 |
| 11 | 30,000 | 3,000 | 33,000 |
| 51 | 150,000 | 3,000 | 153,000 |
| 91 | 270,000 | 3,000 | 273,000 |

실제 처리 행 수는 실행계획, 필터 조건, 인덱스 구성에 따라 달라질 수 있다. 하지만 같은 접근 경로를 사용한다면 OFFSET이 증가할수록 쿼리 실행기가 건너뛰기 위해 확인해야 하는 행도 증가한다.

문제는 한 페이지의 지연만이 아니다. 30만 건을 처음부터 끝까지 3,000건씩 조회하면 앞부분을 반복해서 읽게 된다.

```text
1페이지:   3,000개 확인
2페이지:   6,000개 확인
3페이지:   9,000개 확인
...
100페이지: 300,000개 확인
```

단순화하면 전체 처리량은 다음 합에 가까워진다.

```text
3,000 + 6,000 + 9,000 + ... + 300,000
```

전체 데이터는 30만 건인데, 페이지를 넘길 때마다 앞부분을 다시 세는 비용이 누적되는 것이다. 그래서 OFFSET 페이징은 앞 페이지에서는 문제가 잘 드러나지 않다가 뒤로 갈수록 느려진다.

## EXPLAIN과 EXPLAIN ANALYZE를 구분한다

일반 `EXPLAIN`의 `rows`는 옵티마이저가 통계 정보를 바탕으로 계산한 **추정치**다. 실제 실행 중 몇 행을 처리했는지 확인하려면 MySQL 8.0.18부터 지원하는 `EXPLAIN ANALYZE`를 사용한다.

```sql
EXPLAIN ANALYZE
SELECT id
FROM documents
ORDER BY id
LIMIT 3000 OFFSET 150000;
```

`EXPLAIN ANALYZE`는 쿼리를 실제로 실행하고 각 실행 노드에 다음 정보를 붙인다.

```text
actual time=시작 시간..완료 시간 rows=실제 행 수 loops=반복 횟수
```

OFFSET의 비용을 확인할 때는 가장 바깥쪽 `Limit/Offset` 노드의 반환 행만 보면 안 된다. 그 아래 `Index scan` 또는 `Table scan` 노드의 `actual rows`가 OFFSET에 따라 얼마나 증가하는지 봐야 한다.

## 직접 재현하기

아래 실습은 다른 필터나 조인 비용을 제거하고 OFFSET 하나만 관찰하기 위한 최소 구성이다. MySQL 8.4와 InnoDB를 기준으로 한다.

### 30만 건 만들기

<details markdown="1">
<summary>테이블 생성과 데이터 적재 SQL</summary>

```sql
CREATE DATABASE IF NOT EXISTS offset_lab;
USE offset_lab;

DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS digits;

CREATE TABLE digits (
    n TINYINT UNSIGNED NOT NULL PRIMARY KEY
) ENGINE = InnoDB;

INSERT INTO digits (n)
VALUES (0), (1), (2), (3), (4),
       (5), (6), (7), (8), (9);

CREATE TABLE documents (
    id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB;

INSERT INTO documents (id, title, created_at)
SELECT
    sequence_number + 1,
    CONCAT('document-', sequence_number + 1),
    TIMESTAMP('2024-01-01 00:00:00') + INTERVAL sequence_number SECOND
FROM (
    SELECT
          a.n
        + b.n * 10
        + c.n * 100
        + d.n * 1000
        + e.n * 10000
        + f.n * 100000 AS sequence_number
    FROM digits a
    CROSS JOIN digits b
    CROSS JOIN digits c
    CROSS JOIN digits d
    CROSS JOIN digits e
    CROSS JOIN digits f
) numbers
WHERE sequence_number < 300000;

ANALYZE TABLE documents;

SELECT COUNT(*) AS document_count
FROM documents;
```

</details>

실험 결과를 공유할 때는 다음 정보도 함께 기록한다. 실행 시간은 MySQL 패치 버전, CPU, 디스크, 버퍼 풀 상태에 따라 달라지기 때문이다.

```sql
SELECT VERSION();
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
```

Docker를 사용했다면 이미지 태그뿐 아니라 이미지 ID 또는 digest도 함께 남긴다.

### OFFSET만 바꾸어 실행하기

정확한 실행 시간을 비교하려면 각 쿼리를 한 번 실행해 데이터를 버퍼 풀에 올린 뒤 같은 쿼리를 5회씩 측정하고 중앙값을 사용한다. 아래 결과는 OFFSET에 따른 처리 행 변화를 확인하기 위해 기록한 한 차례의 실행 결과다.

```sql
EXPLAIN ANALYZE
SELECT id FROM documents
ORDER BY id
LIMIT 3000 OFFSET 0;

EXPLAIN ANALYZE
SELECT id FROM documents
ORDER BY id
LIMIT 3000 OFFSET 30000;

EXPLAIN ANALYZE
SELECT id FROM documents
ORDER BY id
LIMIT 3000 OFFSET 150000;

EXPLAIN ANALYZE
SELECT id FROM documents
ORDER BY id
LIMIT 3000 OFFSET 270000;
```

`완료 시간`은 최상위 `Limit` 노드의 `actual time`에서 두 번째 값, 즉 해당 노드가 모든 행을 반환한 시점이다.

| OFFSET | 반환 행 | 하위 인덱스 스캔의 `actual rows` | 완료 시간 |
|---:|---:|---:|---:|
| 0 | 3,000 | 3,000 | 0.888 ms |
| 30,000 | 3,000 | 33,000 | 8.45 ms |
| 150,000 | 3,000 | 153,000 | 28.9 ms |
| 270,000 | 3,000 | 273,000 | 39.3 ms |

<details markdown="1">
<summary>EXPLAIN ANALYZE 원문</summary>

```text
-> Limit: 3000 row(s)  (cost=40.6 rows=3000) (actual time=0.455..0.888 rows=3000 loops=1)
    -> Covering index scan on documents using PRIMARY  (cost=40.6 rows=3000) (actual time=0.441..0.743 rows=3000 loops=1)

-> Limit/Offset: 3000/30000 row(s)  (cost=1414 rows=3000) (actual time=8.04..8.45 rows=3000 loops=1)
    -> Covering index scan on documents using PRIMARY  (cost=1414 rows=33000) (actual time=0.507..7.37 rows=33000 loops=1)

-> Limit/Offset: 3000/150000 row(s)  (cost=11310 rows=0) (actual time=28.6..28.9 rows=3000 loops=1)
    -> Covering index scan on documents using PRIMARY  (cost=11310 rows=102275) (actual time=0.853..25 rows=153000 loops=1)

-> Limit/Offset: 3000/270000 row(s)  (cost=11310 rows=0) (actual time=39..39.3 rows=3000 loops=1)
    -> Covering index scan on documents using PRIMARY  (cost=11310 rows=102275) (actual time=0.482..32.1 rows=273000 loops=1)
```

</details>

네 쿼리 모두 반환한 행은 3,000건으로 같았다. 하지만 하위 `Covering index scan` 노드는 각각 3,000건, 33,000건, 153,000건, 273,000건을 읽었다. 정확히 `OFFSET + LIMIT`만큼이다.

`OFFSET 270000`은 첫 쿼리보다 91배 많은 인덱스 레코드를 읽었고, 이 실행에서 완료 시간은 0.888ms에서 39.3ms로 증가했다. 실행 시간은 캐시와 장비 상태 등의 영향을 받으므로 처리 행 수와 정확히 같은 비율로 증가하지는 않는다. 그럼에도 OFFSET이 커질수록 반환하지 않을 행을 읽는 작업이 늘어난다는 사실은 `actual rows`에서 분명하게 확인된다.

또 하나 눈여겨볼 부분은 추정치와 실측치의 차이다. 뒤의 두 실행에서 일반 실행계획의 `rows` 추정치는 102,275였지만 실제 스캔 행은 각각 153,000건과 273,000건이었다. OFFSET 비용을 검증할 때 일반 `EXPLAIN`의 추정치만 보지 않고 `EXPLAIN ANALYZE`의 `actual rows`를 확인해야 하는 이유다.

## 주의할 점

### 작은 OFFSET까지 항상 문제인 것은 아니다

OFFSET이 작고 데이터도 적다면 단순하고 이해하기 쉬운 `LIMIT/OFFSET`이 충분히 좋은 선택일 수 있다. 문제는 페이지가 얼마나 깊어질 수 있는지, 사용자가 임의 페이지 이동을 필요로 하는지, 전체 데이터를 끝까지 순회하는 작업인지에 따라 달라진다.

### 실행 시간만으로 원인을 단정하지 않는다

첫 실행과 다음 실행은 버퍼 풀 상태 때문에 시간이 다를 수 있다. 선택하는 컬럼이 많거나 행이 넓으면 버린 행을 읽는 비용도 커진다. 필터 조건, 조인, 정렬, 네트워크 전송도 전체 응답 시간에 영향을 준다.

따라서 OFFSET의 비용을 검증할 때는 다른 조건을 고정하고, 실행 시간과 함께 실행계획의 `actual rows`를 확인해야 한다.

### 인덱스는 OFFSET 비용을 줄일 수 있지만 제거하지는 않는다

적절한 인덱스가 있으면 조건 검색과 정렬이 빨라질 수 있다. 커버링 인덱스라면 테이블 행을 추가로 찾아가는 비용도 피할 수 있다. 그래도 시작 키 없이 "앞에서 N건 제외"를 요구하는 한, N건을 세고 버리는 작업은 남는다.

## 30초로 답하기

> OFFSET은 결과의 N번째 행으로 바로 이동하는 기능이 아닙니다. InnoDB 인덱스는 키 값과 범위로 탐색하지만, 쿼리 조건을 만족하는 행의 결과 순번을 저장하지는 않습니다. 그래서 `OFFSET N`은 앞의 N개 행을 읽고 버린 뒤 LIMIT만큼 반환합니다. OFFSET이 커질수록 처리하는 행 수가 늘고, 전체 페이지를 순회하면 이 비용이 반복해서 누적됩니다.

대량 데이터를 앞에서 뒤까지 한 번 순회하는 작업이라면 마지막으로 읽은 키를 다음 조회의 시작 조건으로 사용하는 방식을 검토할 수 있다. 이 방식의 쿼리 형태와 성립 조건, 단점은 다음 글에서 다룬다.

## 참고 자료

- [MySQL 8.4 Reference Manual — SELECT Statement](https://dev.mysql.com/doc/refman/8.4/en/select.html)
- [MySQL 8.4 Reference Manual — The Physical Structure of an InnoDB Index](https://dev.mysql.com/doc/refman/8.4/en/innodb-physical-structure.html)
- [MySQL 8.4 Reference Manual — Optimizing Queries with EXPLAIN](https://dev.mysql.com/doc/refman/8.4/en/using-explain.html)
- [MySQL 8.4 Reference Manual — EXPLAIN Output Format](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html)
