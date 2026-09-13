---
title: "Java 리플렉션"
categories:
  - java
tags:
  - jvm
  - java-reflection
  - dynamic-programming
  - runtime
toc: true
mermaid: true
---

## 리플렉션의 핵심 개념

### 리플렉션이란?

자바 리플렉션은 **실행 중인 프로그램이 런타임에 자신의 구조와 동작을 검사하고 수정할 수 있도록 하는 능력**입니다. 이는 클래스, 인터페이스, 필드, 메서드, 생성자의 구조를 동적으로 탐색하고, 새로운 인스턴스를 생성하며, 필드 값을 조작하고, 메서드를 호출할 수 있는 포괄적인 기능을 제공합니다.

리플렉션은 **컴파일 시점의 제약을 런타임의 유연성으로 변환**하는 핵심 메커니즘입니다.

### 핵심 API 구성요소

리플렉션의 핵심 클래스들은 각각 명확한 책임을 가지고 설계되었습니다 (`Class`는 `java.lang`, 나머지는 `java.lang.reflect` 패키지):

- **Class**: 모든 리플렉션 작업의 진입점이자 타입 메타데이터의 컨테이너
- **Constructor**: 동적 객체 생성을 위한 인터페이스
- **Field**: 객체 상태에 대한 런타임 접근
- **Method**: 동적 행위 호출을 위한 메커니즘
- **Proxy**: AOP와 인터셉션 패턴의 기반

```java
// 세 가지 Class 객체 획득 방법
Class<?> clazz1 = MyClass.class;              // 컴파일 타임 안전성
Class<?> clazz2 = obj.getClass();             // 런타임 다형성
Class<?> clazz3 = Class.forName("MyClass");   // 완전한 동적 로딩
```

## JVM 아키텍처와 리플렉션의 깊은 통합

### 메모리 구조와 런타임 메타데이터

JVM이 유지하는 **풍부한 런타임 타입 정보**는 리플렉션을 가능하게 하는 핵심입니다. HotSpot JVM에서 이 메타데이터는 다음과 같이 구조화됩니다:

#### 객체 헤더 구조
- **마크 워드(Mark Word)**: 동기화, GC 정보 등 인스턴스별 메타데이터
- **클래스 워드(Klass Word)**: 타입별 메타데이터에 대한 포인터

#### 메타스페이스(Metaspace)
클래스 정의, 메서드 테이블, 필드 정보, 상수 풀 등 **공유되는 타입별 메타데이터**가 저장됩니다. 리플렉션은 본질적으로 이미 존재하는 메타데이터에 대한 **프로그래밍 방식으로 접근할 수 있는 인터페이스**를 제공하는 것입니다.

```mermaid
graph TB
    subgraph "JVM 메모리 구조"
        subgraph "Method Area (Metaspace)"
            ClassMeta["클래스 메타데이터<br/>- 클래스명<br/>- 필드 정보<br/>- 메서드 시그니처<br/>- 생성자 정보<br/>- 접근 제어자"]
            ConstPool["상수 풀<br/>- 문자열 리터럴<br/>- 클래스 참조<br/>- 메서드 참조"]
        end

        subgraph "Heap Memory"
            ClassObj["Class 객체<br/>(java.lang.Class)"]
            Instances["일반 객체 인스턴스들"]
        end

        subgraph "PC Register & Stack"
            BytecodeExec["바이트코드 실행<br/>리플렉션 API 호출"]
        end
    end

    subgraph "리플렉션 API"
        ReflectAPI["java.lang.reflect"]
        Constructor["Constructor"]
        Field["Field"]
        Method["Method"]
        Proxy["Proxy"]
    end

    ClassMeta --> ClassObj
    ConstPool --> ClassObj
    ClassObj --> ReflectAPI
    ReflectAPI --> Constructor
    ReflectAPI --> Field
    ReflectAPI --> Method
    ReflectAPI --> Proxy

    BytecodeExec --> ClassObj
    ClassObj --> ClassMeta
```

### 클래스 로딩 라이프사이클

클래스 로더 서브시스템은 **로딩, 링크, 초기화**의 3단계 프로세스를 통해 동작합니다:

```mermaid
sequenceDiagram
    participant Dev as 개발자
    participant Compiler as javac 컴파일러
    participant ClassFile as .class 파일
    participant ClassLoader as 클래스 로더
    participant JVM as JVM Method Area
    participant ClassObj as Class 객체
    participant ReflectAPI as 리플렉션 API

    Dev->>Compiler: MyClass.java 작성
    Note over Compiler: 소스코드 분석<br/>메타데이터 추출

    Compiler->>ClassFile: 바이트코드 + 메타데이터 생성
    Note over ClassFile: - 상수 풀<br/>- 필드 테이블<br/>- 메서드 테이블<br/>- 애트리뷰트 테이블

    ClassLoader->>ClassFile: 클래스 로딩 요청
    ClassFile->>ClassLoader: 바이트코드 반환

    ClassLoader->>JVM: 메타데이터를 Method Area에 저장
    Note over JVM: - 클래스 구조 정보<br/>- 메서드 시그니처<br/>- 필드 타입 정보<br/>- 접근 제어자

    JVM->>ClassObj: Class 객체 생성 및 연결
    Note over ClassObj: 런타임 타입 정보<br/>접근 포인트 역할

    Dev->>ReflectAPI: Class.forName("MyClass")
    ReflectAPI->>ClassObj: Class 객체 반환
    ClassObj->>JVM: 메타데이터 조회
    JVM->>ClassObj: 메타데이터 반환
    ClassObj->>ReflectAPI: 구조 정보 제공
    ReflectAPI->>Dev: Constructor/Field/Method 객체들
```

#### 로딩(Loading)
부트스트랩, 확장, 시스템 클래스 로더의 **위임 계층**을 통해 .class 파일을 읽고 메서드 영역에 저장합니다.

#### 링크(Linking)
- **검증**: 바이트코드의 구조적/의미론적 정확성 확인
- **준비**: 정적 변수를 위한 메모리 할당과 기본값 초기화
- **해결**: 심볼릭 참조를 직접 참조로 변환

#### 초기화(Initialization)
정적 변수에 실제 값을 할당하고 정적 블록을 실행합니다.

## 리플렉션의 내부 동작 메커니즘

### Class.forName(): 동적 해결의 복잡성

`Class.forName(String className)`이 호출되면, JVM은 **동적 바인딩과 해결**을 수행해야 합니다. 클래스 이름이 컴파일 타임 상수가 아닌 경우, 일반적인 정적 해결 대신 런타임에 메서드 영역을 검색하여 심볼릭 참조를 직접 참조로 변환하는 과정이 필요합니다.

이는 **컴파일 타임 바인딩을 우회**하고 JVM이 동적으로 클래스 해결을 수행하도록 강제하며, 이는 정적으로 링크된 코드에 비해 본질적인 오버헤드를 추가합니다.

### Method.invoke(): MethodAccessor를 통한 호출

`Method.invoke()`는 JNI의 `Call<Type>Method` 함수를 거치지 않습니다. HotSpot은 JDK 버전에 따라 다음과 같이 호출합니다.

- **JDK 17 이하**: 처음에는 `NativeMethodAccessorImpl`이 JVM 내부 함수(`JVM_InvokeMethod`)를 통해 대상 메서드를 호출합니다. 같은 메서드를 약 15회(`sun.reflect.inflationThreshold`) 넘게 호출하면, 대상 메서드를 직접 호출하는 바이트코드 접근자 클래스(`GeneratedMethodAccessor`)를 런타임에 생성해 교체합니다. 이를 **inflation**이라고 하며, 이후 호출은 일반 메서드 호출처럼 JIT 최적화를 받을 수 있습니다.
- **JDK 18 이상**: JEP 416에 따라 핵심 리플렉션이 `MethodHandle` 기반으로 다시 구현되었습니다.

```mermaid
sequenceDiagram
    participant App as Java 애플리케이션
    participant Method as Method 객체
    participant Accessor as MethodAccessor
    participant JVM as JVM 내부 (JVM_InvokeMethod)
    participant Target as 대상 메서드

    App->>Method: invoke(obj, args)
    alt override 플래그(setAccessible(true))가 꺼져 있음
        Method->>Method: 접근 검사 (IllegalAccessException 발생 가능)
    end
    Method->>Accessor: 호출 위임
    alt JDK 17 이하, 호출 초기 (약 15회까지)
        Accessor->>JVM: NativeMethodAccessorImpl
        JVM->>Target: 대상 메서드 실행
    else JDK 17 이하, inflation 이후
        Accessor->>Target: 생성된 바이트코드 접근자가 직접 호출
    else JDK 18 이상
        Accessor->>Target: MethodHandle로 호출
    end
    Target-->>App: 결과 반환 (대상 메서드의 예외는 InvocationTargetException으로 감싸짐)
```

인수 배열 생성, 기본형 박싱/언박싱, 접근 검사, 예외 래핑이 매 호출마다 추가되기 때문에 직접 호출보다 느립니다.

### Field.get()/set(): 필드 접근자

필드에 대한 리플렉티브 접근도 JNI의 `Get<Type>Field`/`Set<Type>Field`를 거치지 않습니다.
- **JDK 17 이하**: `Unsafe`로 필드 오프셋에 직접 읽고 쓰는 `UnsafeFieldAccessorImpl` 계열을 사용합니다.
- **JDK 18 이상**: `MethodHandle` 기반 접근자를 사용합니다.

`setAccessible(true)`는 객체의 메모리 레이아웃을 바꾸지 않습니다. `AccessibleObject`의 `override` 플래그를 켜서 이후 호출에서 **접근 제어 검사를 생략**하게 할 뿐이며, 이를 통해 private 필드와 메서드에도 접근할 수 있게 됩니다. (Java 9+ 모듈 시스템에서는 대상 패키지가 `opens` 되어 있지 않으면 `InaccessibleObjectException`이 발생합니다.)
