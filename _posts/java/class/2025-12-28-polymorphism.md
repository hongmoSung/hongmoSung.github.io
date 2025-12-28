---
title: "Java 다형성"
date: 2024-12-28
last_modified_at: 2024-12-28
categories:
  - java
tags:
  - polymorphism
  - overloading
  - overriding
  - inheritance
toc: true
toc_sticky: true
---

## 다형성이란?

**다형성(Polymorphism)**은 "여러 가지 형태"를 의미하며, ==하나의 객체나 메서드가 다양한 형태로 동작==할 수 있는 능력입니다.

### 실무에서의 다형성

실무에서 다형성은 매일 사용합니다. 예를 들어:

```java
// 다형성 사용
List<String> names = new ArrayList<>();
List<Integer> numbers = new LinkedList<>();
Map<String, Object> data = new HashMap<>();
```

왜 `ArrayList`가 아닌 `List`로 선언할까요?

```java
// 구체 타입으로 선언
ArrayList<String> names = new ArrayList<>();

// 나중에 LinkedList로 변경하려면?
// 모든 코드를 수정해야 함!
ArrayList<String> names = new LinkedList<>();  // 컴파일 에러!
```

```java
// ✅ 인터페이스로 선언
List<String> names = new ArrayList<>();

// 나중에 구현체를 바꿔도 OK!
List<String> names = new LinkedList<>();  // ✅ 문제없음
List<String> names = new Vector<>();      // ✅ 문제없음
```

## 다형성이 필요한 이유

### 다형성 없이 작성한 코드

```java
class ReportService {
    void sendEmailReport(EmailSender email) {
        email.send("보고서 내용");
    }

    void sendSmsReport(SmsSender sms) {
        sms.send("보고서 내용");
    }

    void sendSlackReport(SlackSender slack) {
        slack.send("보고서 내용");
    }

    // 새로운 발송 수단이 추가될 때마다 메서드를 계속 만들어야 함!
}
```

### 다형성을 사용한 코드

```java
// 인터페이스 정의
interface MessageSender {
    void send(String message);
}

// 구현체들
class EmailSender implements MessageSender {
    @Override
    public void send(String message) {
        System.out.println("이메일 발송: " + message);
    }
}

class SmsSender implements MessageSender {
    @Override
    public void send(String message) {
        System.out.println("SMS 발송: " + message);
    }
}

class SlackSender implements MessageSender {
    @Override
    public void send(String message) {
        System.out.println("Slack 발송: " + message);
    }
}

// 하나의 메서드로 모든 발송 수단 처리
class ReportService {
    void sendReport(MessageSender sender, String content) {
        sender.send(content);
    }
}

// 사용
ReportService service = new ReportService();
service.sendReport(new EmailSender(), "보고서 내용");
service.sendReport(new SmsSender(), "보고서 내용");
service.sendReport(new SlackSender(), "보고서 내용");

// 새로운 발송 수단 추가도 쉬움
class KakaoTalkSender implements MessageSender {
    @Override
    public void send(String message) {
        System.out.println("카카오톡 발송: " + message);
    }
}
service.sendReport(new KakaoTalkSender(), "보고서 내용");
```

## 다형성의 두 가지 종류

Java의 다형성은 **컴파일 타임 다형성**과 **런타임 다형성** 두 가지로 나뉩니다.

| 구분        | 컴파일 타임 다형성     | 런타임 다형성        |
|-----------|----------------|----------------|
| **다른 이름** | 정적 바인딩, 조기 바인딩 | 동적 바인딩, 후기 바인딩 |
| **구현 방법** | 메서드 오버로딩       | 메서드 오버라이딩      |
| **결정 시점** | 컴파일 시          | 실행 시           |
| **성능**    | 빠름             | 상대적으로 느림       |

## 컴파일 타임 다형성: 오버로딩

### 오버로딩이란?

**메서드 오버로딩(Overloading)**은 ==같은 이름의 메서드를 여러 개== 정의하는 것입니다.

### 예제: String의 valueOf()

```java
public class String {
    // 여러 타입을 String으로 변환
    static String valueOf(int i) {}
    static String valueOf(long l) {}
    static String valueOf(boolean f) {}
}

// 사용
String.valueOf(10);        // int 버전
String.valueOf(10.5);      // double 버전
String.valueOf(true);      // boolean 버전
```

### 예제: StringBuilder

```java
StringBuilder sb = new StringBuilder();

// 다양한 타입을 추가할 수 있음
sb.append("Hello");      // String
sb.append(123);          // int
sb.append(true);         // boolean
```

### 오버로딩 규칙

**반드시 달라야 하는 것:**

- ✅ 매개변수 개수
- ✅ 매개변수 타입
- ✅ 매개변수 순서

**달라도 오버로딩이 안 되는 것:**

- ❌ 리턴 타입만 다른 경우
- ❌ 매개변수 이름만 다른 경우

```java
// ❌ 컴파일 에러!
int calculate(int a) {
    return a * 2;
}

double calculate(int a) {  // 리턴 타입만 다름
    return a * 2.0;
}
```

## 런타임 다형성: 오버라이딩

### 오버라이딩이란?

**메서드 오버라이딩(Overriding)**은 ==부모 클래스의 메서드를 자식 클래스에서 재정의==하는 것입니다.

### 예제: DAO 계층

```java
// 인터페이스
interface UserRepository {
    User findById(Long id);
    void save(User user);
}

// MySQL 구현
class MySqlUserRepository implements UserRepository {
    @Override
    public User findById(Long id) {
        // MySQL 조회 로직
        return new User();
    }

    @Override
    public void save(User user) {
        // MySQL 저장 로직
    }
}

// MongoDB 구현
class MongoUserRepository implements UserRepository {
    @Override
    public User findById(Long id) {
        // MongoDB 조회 로직
        return new User();
    }

    @Override
    public void save(User user) {
        // MongoDB 저장 로직
    }
}

// Service 계층
class UserService {
    private UserRepository repository;

    // 생성자 주입
    UserService(UserRepository repository) {
        this.repository = repository;
    }

    void processUser(Long id) {
        User user = repository.findById(id);  // 어떤 구현체든 OK!
        // 비즈니스 로직
        repository.save(user);
    }
}

// 사용
UserService mysqlService = new UserService(new MySqlUserRepository());
mysqlService.processUser(1L);  // MySQL 사용

UserService mongoService = new UserService(new MongoUserRepository());
mongoService.processUser(1L);  // MongoDB 사용
```

### 예제: List 인터페이스

```java
// List 인터페이스
interface List<E> {
    boolean add(E element);
    E get(int index);
    int size();
}

// ArrayList 구현
class ArrayList<E> implements List<E> {
    @Override
    public boolean add(E element) {
        // 배열 기반 추가
        return true;
    }

    @Override
    public E get(int index) {
        // 배열 인덱스로 빠른 조회
        return null;
    }
}

// LinkedList 구현
class LinkedList<E> implements List<E> {
    @Override
    public boolean add(E element) {
        // 노드 연결로 추가
        return true;
    }

    @Override
    public E get(int index) {
        // 노드 탐색으로 조회
        return null;
    }
}

// 사용
List<String> list1 = new ArrayList<>();
list1.add("Hello");  // ArrayList의 add() 호출

List<String> list2 = new LinkedList<>();
list2.add("Hello");  // LinkedList의 add() 호출
```

## 오버로딩 vs 오버라이딩

### 비교표

| 특징            | 오버로딩           | 오버라이딩       |
|---------------|----------------|-------------|
| **정의**        | 같은 이름, 다른 매개변수 | 부모 메서드 재정의  |
| **위치**        | 같은 클래스 내       | 부모-자식 클래스 간 |
| **시그니처**      | 달라야 함          | 같아야 함       |
| **리턴 타입**     | 상관 없음          | 같거나 하위 타입   |
| **바인딩**       | 컴파일 타임 (정적)    | 런타임 (동적)    |
| **@Override** | 사용 안 함         | 사용 권장       |

### 코드 비교

```java
// 오버로딩 - StringBuilder
StringBuilder sb = new StringBuilder();
sb.append("text");
sb.append(123);
sb.append(45.6);

// 오버라이딩 - List 구현체
List<String> list1 = new ArrayList<>();  // ArrayList의 add() 호출
List<String> list2 = new LinkedList<>(); // LinkedList의 add() 호출
```

## 다형성의 활용

### 1. Spring Framework의 의존성 주입

```java

@Service
class OrderService {
    private final PaymentService paymentService;

    // 인터페이스로 주입받음
    @Autowired
    OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    void createOrder(Order order) {
        // 구체적인 구현체를 몰라도 됨!
        paymentService.processPayment(order);
    }
}

// 실제 구현체는 설정으로 결정
@Service
class CreditCardPaymentService implements PaymentService {
    @Override
    public void processPayment(Order order) {
        // 신용카드 결제 로직
    }
}
```

### 2. 전략 패턴 (Strategy Pattern)

```java
// 할인 전략 인터페이스
interface DiscountPolicy {
    int discount(int price);
}

// 정률 할인
class RateDiscountPolicy implements DiscountPolicy {
    @Override
    public int discount(int price) {
        return price * 10 / 100;  // 10% 할인
    }
}

// 정액 할인
class FixDiscountPolicy implements DiscountPolicy {
    @Override
    public int discount(int price) {
        return 1000;  // 1000원 할인
    }
}

// 할인 없음
class NoDiscountPolicy implements DiscountPolicy {
    @Override
    public int discount(int price) {
        return 0;
    }
}

// 주문 서비스
class OrderService {
    private DiscountPolicy discountPolicy;

    // 할인 정책을 자유롭게 변경 가능!
    void setDiscountPolicy(DiscountPolicy policy) {
        this.discountPolicy = policy;
    }

    int calculatePrice(int price) {
        int discountAmount = discountPolicy.discount(price);
        return price - discountAmount;
    }
}

// 사용
OrderService service = new OrderService();
service.setDiscountPolicy(new RateDiscountPolicy());
service.calculatePrice(10000);  // 9000원

service.setDiscountPolicy(new FixDiscountPolicy());
service.calculatePrice(10000);  // 9000원

service.setDiscountPolicy(new NoDiscountPolicy());
service.calculatePrice(10000);  // 10000원
```

### 3. 팩토리 패턴 (Factory Pattern)

```java
// 데이터베이스 연결 인터페이스
interface DatabaseConnection {
    void connect();
}

class MySqlConnection implements DatabaseConnection {
    @Override
    public void connect() {
        System.out.println("MySQL 연결");
    }
}

class PostgreSqlConnection implements DatabaseConnection {
    @Override
    public void connect() {
        System.out.println("PostgreSQL 연결");
    }
}

class OracleConnection implements DatabaseConnection {
    @Override
    public void connect() {
        System.out.println("Oracle 연결");
    }
}

// 팩토리
class DatabaseConnectionFactory {
    static DatabaseConnection createConnection(String type) {
        switch (type) {
            case "mysql":
                return new MySqlConnection();
            case "postgresql":
                return new PostgreSqlConnection();
            case "oracle":
                return new OracleConnection();
            default:
                throw new IllegalArgumentException("Unknown type: " + type);
        }
    }
}

// 사용
DatabaseConnection conn = DatabaseConnectionFactory.createConnection("mysql");
conn.connect();  // "MySQL 연결"
```

## 타입 캐스팅

### 업캐스팅 (Upcasting)

**업캐스팅**은 ==자식 타입을 부모 타입으로 변환==하는 것으로, **자동으로** 일어납니다.

#### 기본 예제
```java
Dog dog = new Dog();
Animal animal = dog;  // Dog → Animal (자동 변환)

ArrayList<String> arrayList = new ArrayList<>();
List<String> list = arrayList;  // ArrayList → List (자동 변환)
```

#### 왜 자동으로 될까?

자식은 항상 부모의 모든 기능을 가지고 있기 때문에 **안전**합니다.

```java
List<String> list = new ArrayList<>();

// List가 가진 메서드는 ArrayList도 당연히 가지고 있음
list.add("Hello");     // ✅ ArrayList에 add() 있음
list.get(0);           // ✅ ArrayList에 get() 있음
list.size();           // ✅ ArrayList에 size() 있음
```

#### 업캐스팅을 쓰는 이유

```java
public class UserService {
    // ✅ List 타입으로 받으면 유연함
    public void processUsers(List<String> users) {
        for (String user : users) {
            System.out.println(user);
        }
    }
}

// 어떤 List 구현체든 넘길 수 있음!
UserService service = new UserService();
service.processUsers(new ArrayList<>());     // ✅
service.processUsers(new LinkedList<>());    // ✅
service.processUsers(new Vector<>());        // ✅
```

### 다운캐스팅 (Downcasting)

**다운캐스팅**은 ==부모 타입을 자식 타입으로 변환==하는 것으로, **명시적으로** 해야 합니다.

#### 기본 예제

```java
// List로 선언했지만 실제로는 ArrayList
List<String> list = new ArrayList<>();

// ArrayList만 가진 메서드를 쓰고 싶다면?
ArrayList<String> arrayList = (ArrayList<String>) list;  // 명시적 변환
arrayList.trimToSize();  // ArrayList만 가진 메서드
```

#### 왜 명시적으로 해야 할까?

부모 타입이 자식의 모든 기능을 가지고 있는 건 아니기 때문에 **위험**합니다.

```java
List<String> list = new LinkedList<>();  // 실제로는 LinkedList

// ArrayList로 캐스팅하려고 하면?
ArrayList<String> arrayList = (ArrayList<String>) list;  
// ❌ 런타임 에러! ClassCastException
// LinkedList를 ArrayList로 바꿀 수 없음!
```

#### 안전하게 다운캐스팅하기

**방법 1: instanceof로 확인**
```java
List<String> list = new ArrayList<>();

if (list instanceof ArrayList) {
    ArrayList<String> arrayList = (ArrayList<String>) list;
    arrayList.trimToSize();
    System.out.println("ArrayList 메서드 사용 가능!");
}
```

**방법 2: Java 16+ Pattern Matching**
```java
List<String> list = new ArrayList<>();

// instanceof와 동시에 캐스팅까지 됨!
if (list instanceof ArrayList<String> arrayList) {
    arrayList.trimToSize();
    System.out.println("더 간단해진 코드!");
}
```

### 업캐스팅 vs 다운캐스팅 정리

| 구분        | 업캐스팅     | 다운캐스팅         |
|-----------|----------|---------------|
| **방향**    | 자식 → 부모  | 부모 → 자식       |
| **변환**    | 자동 (묵시적) | 명시적 필요        |
| **안전성**   | 항상 안전    | 위험 (타입 확인 필요) |
| **사용 시기** | 일반적인 경우  | 특정 기능 필요할 때만  |

```java
// 업캐스팅 (Upcasting)
ArrayList<String> arrayList = new ArrayList<>();
List<String> list = arrayList;  // ✅ 자동 OK

// 다운캐스팅 (Downcasting)
List<String> list2 = new ArrayList<>();
ArrayList<String> arrayList2 = (ArrayList<String>) list2;  // ⚠️ 명시적 필요
```

## 정리

### 다형성이란?

하나의 객체나 메서드가 **여러 형태로 동작**할 수 있는 능력

### 가장 많이 보는 다형성

```java
List<String> list = new ArrayList<>();
Map<String, Object> map = new HashMap<>();
UserRepository repository = new MySqlUserRepository();
PaymentService service = new CreditCardPaymentService();
```

### 핵심 원칙

**"구현이 아닌 인터페이스에 의존하라"**

```java
// ❌ 구현에 의존
ArrayList<String> list = new ArrayList<>();

// ✅ 인터페이스에 의존
List<String> list = new ArrayList<>();
```
