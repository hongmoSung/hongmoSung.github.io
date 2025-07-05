---
title: "Java Collections Framework"
categories:
  - java
tags:
  - Collections
toc: true
mermaid: true
---

## 1. 핵심 개념

### 1.1 설계 철학

Java Collections Framework(JCF)는 세 가지 핵심 원칙을 기반으로 설계되었습니다:

1. **통일된 아키텍처**: 모든 컬렉션이 일관된 인터페이스를 제공
2. **성능 최적화**: 각 상황에 최적화된 구현체 제공
3. **타입 안전성**: 제네릭을 통한 컴파일 타임 타입 검사

### 1.2 핵심 인터페이스

```java
Collection<E>               // 최상위 인터페이스
├── List<E>                // 순서 있는 컬렉션, 중복 허용
├── Set<E>                 // 중복 없는 컬렉션
└── Queue<E>               // FIFO 처리를 위한 컬렉션

Map<K,V>                   // 키-값 쌍을 저장하는 별도 계층
```

### 1.3 설계 패턴: 인터페이스 우선

```java
// ✅ 좋은 예: 인터페이스로 선언
List<String> names = new ArrayList<>();
Map<String, Integer> ages = new HashMap<>();

// ❌ 나쁜 예: 구현체로 선언
ArrayList<String> names = new ArrayList<>();
HashMap<String, Integer> ages = new HashMap<>();
```

---

## 2. 빠른 선택 가이드

### 2.1 상황별 권장 컬렉션

|요구사항|권장 컬렉션|이유|
|---|---|---|
|순서 있는 리스트, 빠른 조회|`ArrayList`|O(1) 인덱스 접근|
|순서 있는 리스트, 빈번한 삽입/삭제|`LinkedList`|O(1) 양 끝 연산|
|중복 제거, 순서 무관|`HashSet`|O(1) 평균 성능|
|중복 제거, 삽입 순서 유지|`LinkedHashSet`|순서 보장 + O(1) 성능|
|중복 제거, 정렬된 순서|`TreeSet`|자동 정렬|
|키-값 매핑, 빠른 조회|`HashMap`|O(1) 평균 성능|
|키-값 매핑, 삽입 순서 유지|`LinkedHashMap`|순서 보장|
|키-값 매핑, 정렬된 키|`TreeMap`|키 자동 정렬|
|FIFO 큐/LIFO 스택|`ArrayDeque`|양 끝 O(1) 성능|
|우선순위 큐|`PriorityQueue`|힙 기반 우선순위|

### 2.2 성능 요약

|컬렉션|추가|삭제|조회|특징|
|---|---|---|---|---|
|`ArrayList`|O(1)*|O(n)|O(1)|인덱스 접근|
|`LinkedList`|O(1)|O(1)|O(n)|양 끝 연산|
|`HashSet`|O(1)|O(1)|O(1)|해시 기반|
|`TreeSet`|O(log n)|O(log n)|O(log n)|정렬 유지|
|`HashMap`|O(1)|O(1)|O(1)|해시 기반|
|`TreeMap`|O(log n)|O(log n)|O(log n)|정렬 유지|

---

## 3. List 컬렉션

### 3.1 ArrayList - 동적 배열

**언제 사용할까?**

- 인덱스 기반 조회가 빈번한 경우
- 읽기 연산이 쓰기 연산보다 많은 경우

```java
List<String> fruits = new ArrayList<>();
fruits.add("apple");        // O(1) - 끝에 추가
fruits.add("banana");
fruits.get(0);              // O(1) - 인덱스 조회
fruits.set(1, "orange");    // O(1) - 인덱스 수정
fruits.add(1, "grape");     // O(n) - 중간 삽입
```

**성능 특성:**

- 조회/수정: O(1)
- 끝에 추가: O(1) 상각
- 중간 삽입/삭제: O(n)

### 3.2 LinkedList - 이중 연결 리스트

**언제 사용할까?**

- 리스트의 양 끝에서 빈번한 삽입/삭제
- Queue나 Stack으로 사용할 때

```java
LinkedList<String> tasks = new LinkedList<>();
tasks.addFirst("urgent");    // O(1) - 맨 앞 추가
tasks.addLast("normal");     // O(1) - 맨 뒤 추가
tasks.removeFirst();         // O(1) - 맨 앞 제거
String first = tasks.peekFirst(); // O(1) - 맨 앞 조회
```

**Queue/Deque 인터페이스 활용:**

```java
Queue<String> queue = new LinkedList<>();
queue.offer("task1");        // 큐에 추가
String next = queue.poll();  // 큐에서 제거

Deque<String> stack = new LinkedList<>();
stack.push("item1");         // 스택에 추가
String top = stack.pop();    // 스택에서 제거
```

### 3.3 ArrayList vs LinkedList 선택 기준

```java
// 조회가 많은 경우 - ArrayList
List<String> readHeavy = new ArrayList<>();
for (int i = 0; i < 1000; i++) {
    String item = readHeavy.get(i); // ArrayList가 빠름
}

// 삽입/삭제가 많은 경우 - LinkedList
List<String> writeHeavy = new LinkedList<>();
for (int i = 0; i < 1000; i++) {
    writeHeavy.add(0, "new item"); // LinkedList가 빠름
}
```

---

## 4. Set 컬렉션

### 4.1 HashSet - 해시 기반 집합

**언제 사용할까?**

- 단순히 중복 제거가 목적
- 순서가 중요하지 않은 경우

```java
Set<String> uniqueWords = new HashSet<>();
uniqueWords.add("hello");    // O(1)
uniqueWords.add("world");
uniqueWords.add("hello");    // 중복, 무시됨

boolean exists = uniqueWords.contains("hello"); // O(1)
```

### 4.2 LinkedHashSet - 순서 보장 집합

**언제 사용할까?**

- 중복 제거 + 삽입 순서 유지가 필요한 경우

```java
Set<String> orderedSet = new LinkedHashSet<>();
orderedSet.add("first");
orderedSet.add("second");
orderedSet.add("third");

// 삽입 순서대로 반복됨
for (String item : orderedSet) {
    System.out.println(item); // first, second, third 순서
}
```

### 4.3 TreeSet - 정렬된 집합

**언제 사용할까?**

- 중복 제거 + 자동 정렬이 필요한 경우

```java
Set<Integer> sortedNumbers = new TreeSet<>();
sortedNumbers.add(3);
sortedNumbers.add(1);
sortedNumbers.add(2);

// 자동으로 정렬됨: 1, 2, 3
System.out.println(sortedNumbers); // [1, 2, 3]

// 범위 연산 가능
NavigableSet<Integer> subset = ((TreeSet<Integer>) sortedNumbers)
    .subSet(1, 3); // 1 이상 3 미만
```

### 4.4 Set 컬렉션 비교

```java
// 성능 테스트
Set<String> hashSet = new HashSet<>();         // 가장 빠름
Set<String> linkedHashSet = new LinkedHashSet<>(); // 중간
Set<String> treeSet = new TreeSet<>();         // 가장 느림

// null 처리
hashSet.add(null);         // ✅ 허용 (1개만)
linkedHashSet.add(null);   // ✅ 허용 (1개만)
// treeSet.add(null);      // ❌ NullPointerException
```

---

## 5. Map 컬렉션

### 5.1 HashMap - 해시 기반 맵

**언제 사용할까?**

- 일반적인 키-값 저장소가 필요한 경우
- 성능이 가장 중요한 경우

```java
Map<String, Integer> ageMap = new HashMap<>();
ageMap.put("Alice", 25);     // O(1)
ageMap.put("Bob", 30);
ageMap.put("Alice", 26);     // 덮어쓰기

Integer age = ageMap.get("Alice");      // O(1) - 26
boolean hasKey = ageMap.containsKey("Charlie"); // O(1) - false
```

### 5.2 LinkedHashMap - 순서 보장 맵

**언제 사용할까?**

- 키-값 매핑 + 삽입 순서 유지가 필요한 경우
- LRU 캐시 구현 시

```java
// 일반적인 사용
Map<String, String> orderedMap = new LinkedHashMap<>();
orderedMap.put("first", "1");
orderedMap.put("second", "2");
orderedMap.put("third", "3");

// LRU 캐시 구현
Map<String, String> lruCache = new LinkedHashMap<String, String>(16, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry<String, String> eldest) {
        return size() > 100; // 최대 100개 유지
    }
};
```

### 5.3 TreeMap - 정렬된 맵

**언제 사용할까?**

- 키가 정렬된 순서로 저장되어야 하는 경우
- 범위 기반 검색이 필요한 경우

```java
NavigableMap<String, Integer> sortedMap = new TreeMap<>();
sortedMap.put("charlie", 3);
sortedMap.put("alice", 1);
sortedMap.put("bob", 2);

// 키 기준 자동 정렬: alice, bob, charlie
System.out.println(sortedMap.keySet()); // [alice, bob, charlie]

// 범위 연산
Map<String, Integer> subMap = sortedMap.subMap("alice", "charlie");
String firstKey = sortedMap.firstKey();  // "alice"
String lastKey = sortedMap.lastKey();    // "charlie"
```

### 5.4 Map 활용 패턴

**빈도 계산:**

```java
Map<String, Integer> wordCount = new HashMap<>();
String[] words = {"apple", "banana", "apple", "cherry"};

for (String word : words) {
    wordCount.merge(word, 1, Integer::sum);
}
// {apple=2, banana=1, cherry=1}
```

**그룹핑:**

```java
Map<String, List<Person>> peopleByCity = new HashMap<>();
for (Person person : people) {
    peopleByCity.computeIfAbsent(person.getCity(), k -> new ArrayList<>())
               .add(person);
}
```

---

## 6. Queue 컬렉션

### 6.1 ArrayDeque - 고성능 큐/스택

**언제 사용할까?**

- Stack 클래스를 대체할 때
- 빠른 FIFO/LIFO 연산이 필요한 경우

```java
// FIFO 큐로 사용
Queue<String> queue = new ArrayDeque<>();
queue.offer("first");     // 큐에 추가
queue.offer("second");
String head = queue.poll(); // "first" 제거 및 반환

// LIFO 스택으로 사용
Deque<String> stack = new ArrayDeque<>();
stack.push("bottom");     // 스택에 추가
stack.push("top");
String top = stack.pop(); // "top" 제거 및 반환
```

### 6.2 PriorityQueue - 우선순위 큐

**언제 사용할까?**

- 작업 스케줄링
- 우선순위 기반 처리가 필요한 경우

```java
// 자연 순서 (작은 값이 높은 우선순위)
Queue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(3);
minHeap.offer(1);
minHeap.offer(2);
System.out.println(minHeap.poll()); // 1 (가장 작은 값)

// 사용자 정의 우선순위
Queue<Task> taskQueue = new PriorityQueue<>(
    Comparator.comparing(Task::getPriority).reversed()
);

// 복잡한 객체 우선순위
record Task(String name, int priority) {}
Queue<Task> tasks = new PriorityQueue<>(
    Comparator.comparing(Task::priority)
);
```

---

## 7. 동시성 컬렉션

### 7.1 ConcurrentHashMap

**Vector/Hashtable의 현대적 대안:**

```java
// ❌ 구식 방법
Map<String, Integer> oldMap = Collections.synchronizedMap(new HashMap<>());

// ✅ 현대적 방법
Map<String, Integer> concurrentMap = new ConcurrentHashMap<>();

// 원자적 연산
concurrentMap.putIfAbsent("key", 1);
concurrentMap.compute("key", (k, v) -> v == null ? 1 : v + 1);
concurrentMap.merge("key", 1, Integer::sum);
```

### 7.2 CopyOnWriteArrayList

**읽기가 많고 쓰기가 적은 경우:**

```java
List<EventListener> listeners = new CopyOnWriteArrayList<>();

// 안전한 반복 (쓰기 중에도 안전)
for (EventListener listener : listeners) {
    listener.onEvent(event); // 스냅샷에서 반복
}

// 백그라운드에서 안전한 수정
listeners.add(newListener);
```

### 7.3 BlockingQueue

**생산자-소비자 패턴:**

```java
BlockingQueue<Task> taskQueue = new ArrayBlockingQueue<>(100);

// 생산자 스레드
new Thread(() -> {
    try {
        taskQueue.put(new Task()); // 큐가 가득 차면 대기
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();

// 소비자 스레드
new Thread(() -> {
    try {
        Task task = taskQueue.take(); // 큐가 비어 있으면 대기
        process(task);
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();
```

---

## 8. 성능 최적화

### 8.1 초기 용량 설정

```java
// ❌ 기본 용량 (16, 로드팩터 0.75)
Map<String, String> map1 = new HashMap<>();

// ✅ 예상 크기에 맞는 초기 용량
int expectedSize = 1000;
int initialCapacity = (int) (expectedSize / 0.75) + 1;
Map<String, String> map2 = new HashMap<>(initialCapacity);
```

### 8.2 적절한 컬렉션 선택

```java
// 크기가 작고 변경되지 않는 컬렉션
List<String> small = List.of("a", "b", "c");  // 불변, 메모리 효율적

// 크기를 미리 알 수 있는 경우
List<String> known = new ArrayList<>(expectedSize);

// 빈번한 contains() 연산
Set<String> fastLookup = new HashSet<>(items); // O(1) contains()
```

### 8.3 스트림 API와의 조합

```java
// 컬렉션에서 스트림으로
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
List<String> upperNames = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());

// 특정 컬렉션 타입으로 수집
Set<String> uniqueNames = names.stream()
    .collect(Collectors.toSet());

Map<Integer, String> lengthMap = names.stream()
    .collect(Collectors.toMap(String::length, s -> s));
```

---

## 9. 모범 사례

### 9.1 타입 안전성

```java
// ✅ 제네릭 사용
List<String> names = new ArrayList<>();

// ❌ Raw 타입 사용
List names = new ArrayList(); // 경고 발생
```

### 9.2 불변 컬렉션 활용

```java
// Java 9+ 팩토리 메서드
List<String> immutableList = List.of("a", "b", "c");
Set<String> immutableSet = Set.of("x", "y", "z");
Map<String, Integer> immutableMap = Map.of("key", 1);

// 방어적 복사
public List<String> getItems() {
    return Collections.unmodifiableList(items);
}
```

### 9.3 안전한 반복

```java
// ✅ Iterator의 remove() 사용
Iterator<String> iter = list.iterator();
while (iter.hasNext()) {
    String item = iter.next();
    if (shouldRemove(item)) {
        iter.remove(); // 안전
    }
}

// ✅ removeIf() 사용 (Java 8+)
list.removeIf(item -> shouldRemove(item));

// ❌ 반복 중 직접 수정
for (String item : list) {
    if (shouldRemove(item)) {
        list.remove(item); // ConcurrentModificationException
    }
}
```

---

## 10. 자주 하는 실수

### 10.1 Arrays.asList()의 함정

```java
// ❌ 고정 크기 리스트
List<String> list = Arrays.asList("a", "b", "c");
// list.add("d"); // UnsupportedOperationException

// ✅ 가변 리스트
List<String> mutableList = new ArrayList<>(Arrays.asList("a", "b", "c"));
mutableList.add("d"); // 정상 동작
```

### 10.2 null 처리 불일치

```java
// null 허용하는 컬렉션
Map<String, String> hashMap = new HashMap<>();
hashMap.put(null, "value");  // ✅ 허용

Set<String> hashSet = new HashSet<>();
hashSet.add(null);           // ✅ 허용

// null 허용하지 않는 컬렉션
// TreeSet<String> treeSet = new TreeSet<>();
// treeSet.add(null);        // ❌ NullPointerException

// ArrayDeque<String> deque = new ArrayDeque<>();
// deque.add(null);          // ❌ NullPointerException
```

### 10.3 동시성 문제

```java
// ❌ 비동기화 컬렉션의 동시 접근
Map<String, Integer> map = new HashMap<>();
// 여러 스레드에서 동시 수정 시 문제 발생

// ✅ 동시성 컬렉션 사용
Map<String, Integer> safeMap = new ConcurrentHashMap<>();

// ✅ 동기화 래퍼 사용 (성능은 떨어짐)
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());
```

### 10.4 메모리 누수

```java
// ❌ 불필요한 참조 유지
List<LargeObject> cache = new ArrayList<>();
// cache가 계속 커져서 메모리 누수

// ✅ 적절한 크기 제한
Map<String, String> cache = new LinkedHashMap<String, String>(16, 0.75f, true) {
    @Override
    protected boolean removeEldestEntry(Map.Entry<String, String> eldest) {
        return size() > MAX_CACHE_SIZE;
    }
};
```

---

## 참고 자료

### 공식 문서

- [Oracle Java Collections Tutorial](https://docs.oracle.com/javase/tutorial/collections/)
- [Java Platform SE API Specification](https://docs.oracle.com/en/java/javase/17/docs/api/)

### 유용한 도구

- JProfiler - 메모리 사용량 분석
- JMH (Java Microbenchmark Harness) - 성능 벤치마킹
- VisualVM - JVM 모니터링
