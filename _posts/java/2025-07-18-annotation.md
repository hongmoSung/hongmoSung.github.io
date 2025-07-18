---
title: "접근 제어자"
categories:
  - java
tags:
  - java
  - modifier
  - abstract
  - final
toc: true
---
# Java 애노테이션 메커니즘 - Mermaid 다이어그램

## 1. 애노테이션 생명주기 전체 개요

```mermaid
flowchart TD
    A[Java 소스 코드<br/>MyAnnotation] --> B{컴파일러<br/>javac}
    
    B --> C[Retention 정책 확인]
    
    C --> D{RetentionPolicy는?}
    
    D -->|SOURCE| E[컴파일 시점 처리<br/>APT 실행]
    D -->|CLASS| F[바이트코드에 포함<br/>RuntimeInvisibleAnnotations]
    D -->|RUNTIME| G[바이트코드에 포함<br/>RuntimeVisibleAnnotations]
    
    E --> H[애노테이션 제거<br/>코드 생성/검증 완료]
    F --> I[.class 파일 생성<br/>JVM이 런타임에 무시]
    G --> J[.class 파일 생성<br/>런타임 접근 가능]
    
    I --> K[JVM 클래스 로딩]
    J --> K
    
    K --> L{리플렉션 요청?}
    L -->|Yes| M[메타데이터 반환<br/>RUNTIME만 가능]
    L -->|No| N[정상 실행]
    
    H --> O[컴파일 완료<br/>런타임 영향 없음]
    
    style E fill:#ffcccc
    style G fill:#ccffcc
    style M fill:#ccccff
```

## 2. RetentionPolicy별 처리 경로

```mermaid
flowchart LR
    subgraph "SOURCE Policy"
        A1[Getter Setter<br/>애노테이션] --> B1[APT 실행] --> C1[코드 생성] --> D1[원본 수정] --> E1[컴파일]
        E1 --> F1[애노테이션 제거]
    end
    
    subgraph "CLASS Policy"
        A2[CLASS 정책<br/>애노테이션] --> B2[바이트코드 포함] --> C2[클래스 로딩] --> D2[JVM이 무시]
    end
    
    subgraph "RUNTIME Policy"
        A3[Autowired Entity<br/>애노테이션] --> B3[바이트코드 포함] --> C3[클래스 로딩] --> D3[메모리 유지]
        D3 --> E3[리플렉션 접근]
    end
    
    style A1 fill:#ff9999
    style A2 fill:#ffff99
    style A3 fill:#99ff99
```

## 3. 컴파일 시점 처리 (APT) 메커니즘

```mermaid
sequenceDiagram
    participant SC as 소스코드
    participant CC as Java 컴파일러
    participant AP as 애노테이션 프로세서
    participant FG as 파일 생성기
    participant BC as 바이트코드
    
    SC->>CC: 컴파일 요청
    CC->>CC: 1라운드 파싱
    CC->>AP: 애노테이션 발견 알림
    
    AP->>AP: @SupportedAnnotationTypes 확인
    AP->>SC: 소스코드 분석
    AP->>FG: 새 파일 생성 요청
    FG->>FG: .java/.class/.xml 파일 생성
    
    Note over CC,AP: 여러 라운드 반복 가능
    
    CC->>CC: 2라운드 파싱 (생성된 파일 포함)
    CC->>AP: 추가 애노테이션 확인
    
    alt 더 이상 생성할 파일 없음
        AP->>CC: 처리 완료
        CC->>BC: 최종 바이트코드 생성
    else 추가 파일 생성 필요
        AP->>FG: 추가 파일 생성
        Note over CC: 다음 라운드 계속
    end
```

## 4. 런타임 리플렉션 처리 메커니즘

```mermaid
sequenceDiagram
    participant APP as 애플리케이션
    participant JVM as JVM
    participant CL as 클래스로더
    participant MA as Method Area
    participant RF as 리플렉션 API
    
    APP->>JVM: 클래스 사용 요청
    JVM->>CL: 클래스 로딩 시작
    CL->>CL: .class 파일 읽기
    CL->>CL: RuntimeVisibleAnnotations 파싱
    CL->>MA: 메타데이터 저장
    
    Note over MA: 애노테이션 정보가<br/>Method Area에 영구 저장
    
    APP->>RF: getAnnotation() 호출
    RF->>MA: 애노테이션 메타데이터 조회
    MA->>RF: 애노테이션 객체 반환
    RF->>APP: 애노테이션 정보 제공
    
    APP->>APP: 애노테이션 기반 로직 실행
```

## 5. JVM 메모리 관점의 애노테이션 관리

```mermaid
flowchart TB
    subgraph "JVM Memory Structure"
        subgraph "Method Area (Metaspace)"
            MA1[클래스 메타데이터]
            MA2[애노테이션 메타데이터<br/>RUNTIME 정책]
            MA3[상수 풀]
        end
        
        subgraph "Heap"
            H1[애노테이션 인스턴스<br/>프록시 객체]
            H2[리플렉션 결과<br/>캐시]
        end
        
        subgraph "PC Register & Stack"
            S1[리플렉션 메서드 실행]
        end
    end
    
    subgraph "Class Loading Process"
        CF[.class 파일] --> CL[클래스로더]
        CL --> MA1
        CL --> MA2
        CL --> MA3
    end
    
    subgraph "Reflection Access"
        APP[애플리케이션] --> RF[리플렉션 API]
        RF --> MA2
        RF --> H1
        H1 --> H2
    end
    
    style MA2 fill:#ccffcc
    style H1 fill:#ccccff
```

## 6. 프레임워크별 애노테이션 활용 패턴

### Spring Framework

```mermaid
flowchart TD
    A[애플리케이션 시작] --> B[컴포넌트 스캔]
    B --> C{Component Service<br/>Repository 발견}
    
    C --> D[빈 정의 생성]
    D --> E[인스턴스 생성]
    E --> F{Autowired 확인}
    
    F -->|Yes| G[의존성 주입 대상 식별]
    F -->|No| H[빈 등록 완료]
    
    G --> I[타입 매칭]
    I --> J{후보 빈 개수}
    
    J -->|1개| K[자동 주입]
    J -->|여러개| L[Qualifier 확인]
    J -->|0개| M[NoSuchBeanDefinitionException]
    
    L --> N{Qualifier 매칭}
    N -->|성공| K
    N -->|실패| M
    
    K --> H
    H --> O[애플리케이션 준비 완료]
    
    subgraph "런타임 AOP 처리"
        P[Transactional 메서드 호출]
        P --> Q[프록시 인터셉터]
        Q --> R[트랜잭션 시작]
        R --> S[실제 메서드 실행]
        S --> T[트랜잭션 커밋/롤백]
    end
```

### JUnit Test Framework

```mermaid
flowchart TD
    A[테스트 클래스 스캔] --> B{Test 메서드 발견}
    
    B --> C[테스트 스위트 구성]
    C --> D[BeforeAll 실행]
    D --> E[각 테스트 메서드 처리]
    
    E --> F[BeforeEach 실행]
    F --> G[Test 메서드 실행]
    G --> H[AfterEach 실행]
    
    H --> I{더 많은 테스트?}
    I -->|Yes| F
    I -->|No| J[AfterAll 실행]
    
    J --> K[테스트 결과 리포트]
    
    subgraph "특수 애노테이션 처리"
        L[ParameterizedTest] --> M[파라미터 소스 확인]
        M --> N[ValueSource<br/>CsvSource 등]
        N --> O[여러 번 테스트 실행]
        
        P[RepeatedTest] --> Q[지정 횟수만큼 반복]
        
        R[Disabled] --> S[테스트 스킵]
    end
```

## 7. JVM 내부 바이트코드 레벨 처리

```mermaid
flowchart LR
    subgraph "바이트코드 구조"
        A[클래스 파일<br/>Magic Number] --> B[상수 풀]
        B --> C[접근 플래그]
        C --> D[클래스 정보]
        D --> E[필드 정보]
        E --> F[메서드 정보]
        F --> G[속성 정보<br/>Attributes]
    end
    
    subgraph "애노테이션 관련 속성"
        G --> H{RuntimeVisibleAnnotations}
        G --> I{RuntimeInvisibleAnnotations}
        G --> J{AnnotationDefault}
    end
    
    subgraph "JVM 처리"
        H --> K[리플렉션 접근 가능]
        I --> L[바이트코드 도구만 접근]
        J --> M[기본값 정보]
        
        K --> N[java.lang.annotation.Annotation<br/>프록시 생성]
        N --> O[애플리케이션에서 사용]
    end
    
    style H fill:#ccffcc
    style I fill:#ffcccc
    style K fill:#ccccff
```

## 8. 성능 관점의 애노테이션 처리

```mermaid
graph TD
    subgraph "컴파일 타임 (성능 영향 없음)"
        A[SOURCE 정책] --> B[APT 처리]
        B --> C[코드 생성]
        C --> D[애노테이션 제거]
        D --> E[최적화된 바이트코드]
    end
    
    subgraph "클래스 로딩 타임 (미미한 영향)"
        F[CLASS 정책] --> G[바이트코드 포함]
        G --> H[클래스 로딩]
        H --> I[메타데이터 무시]
    end
    
    subgraph "런타임 (성능 고려 필요)"
        J[RUNTIME 정책] --> K[메모리 저장]
        K --> L[리플렉션 호출]
        L --> M{캐시 존재?}
        M -->|Yes| N[캐시된 결과 반환<br/>빠름]
        M -->|No| O[메타데이터 탐색<br/>느림]
        O --> P[결과 캐싱]
        P --> N
    end
    
    style E fill:#ccffcc
    style I fill:#ffffcc
    style O fill:#ffcccc
    style N fill:#ccffff
```

---

## 핵심 요약

**James Gosling의 관점에서 본 애노테이션 메커니즘:**

1. **단순성**: 복잡한 XML 설정을 코드 내 메타데이터로 단순화
2. **타입 안전성**: 컴파일 시점 검증으로 런타임 오류 방지
3. **성능 최적화**: RetentionPolicy를 통한 세밀한 생명주기 제어
4. **확장성**: 사용자 정의 애노테이션으로 무한한 가능성 제공
5. **JVM 통합**: 바이트코드와 메모리 구조에 자연스럽게 통합

이러한 설계 결정들이 Spring, JUnit 같은 강력한 프레임워크들이 탄생할 수 있는 기반을 마련했습니다.
