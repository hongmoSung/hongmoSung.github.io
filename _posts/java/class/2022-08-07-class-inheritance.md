---
title: "클래스 상속의 개념과 문법적 특징"
date: 2022-08-07
last_modified_at: 2025-12-25
categories:
  - java
tags:
  - inheritance
  - super
  - override
toc: true
toc_sticky: true
---

## 상속이란?

### 상속이 필요한 이유

소프트웨어를 개발하다 보면 비슷한 클래스를 반복해서 만들게 됩니다.

```java
class Dog {
    String name;
    int age;

    void eat() {
        System.out.println("먹는다");
    }
}

class Cat {
    String name;
    int age;

    void eat() {
        System.out.println("먹는다");
    }
}

class Bird {
    String name;
    int age;

    void eat() {
        System.out.println("먹는다");
    }
}
```

**문제점**

- `name`, `age`, `eat()` 같은 공통 코드가 반복됩니다
- 공통 기능(`eat()`)을 수정하려면 모든 클래스를 일일이 고쳐야 합니다
- 코드의 양이 불필요하게 늘어납니다


이럴 때는 ==공통된 부분을 부모 클래스==로 묶고, 각 동물은 ==부모 클래스를 상속==받으면 됩니다.

```java
// 공통 기능을 가진 부모 클래스
class Animal { 
    String name;
    int age;

    void eat() {
        System.out.println("먹는다");
    }
}

// 각 동물은 Animal을 상속받고 자신만의 특징 추가
class Dog extends Animal { 
    void bark() {
        System.out.println("멍멍");
    }
}

class Cat extends Animal {
    void meow() {
        System.out.println("야옹");
    }
}

class Bird extends Animal {
    void fly() {
        System.out.println("날다");
    }
}
```

**장점**

- 중복 코드 제거
- 유지보수 용이 (Animal의 `eat()` 메서드만 수정하면 모든 동물에 적용)
- 계층적 구조로 개념 정리

### IS-A 관계

상속은 단순한 코드 재사용이 아닙니다. **"~은 ~이다"라는 관계**를 표현합니다.

```java
Dog dog = new Dog(); // Dog IS-A Animal (개는 동물이다)
Cat cat = new Cat(); // Cat IS-A Animal (고양이는 동물이다)
```

#### IS-A 관계가 중요한 이유

**1. 다형성의 기반**

IS-A 관계 덕분에 부모 타입으로 자식 객체를 다룰 수 있습니다.

```java
// Animal 타입으로 모든 동물을 관리
Animal[] animals = {new Dog(), new Cat(), new Bird()};

// 모든 동물을 같은 방식으로 처리
for(Animal animal :animals){
    animal.eat();  // 모두 먹을 수 있음
}
```

**2. 코드의 유연성**

새로운 동물을 추가해도 기존 코드를 수정할 필요가 없습니다.

```java
// 동물병원 클래스
class PetClinic { 
    // Animal 타입만 받음
    void treat(Animal animal) {  
        System.out.println(animal.name + " 치료 중...");
        animal.eat();
    }
}

class Rabbit extends Animal { // 새로운 동물 추가
    void jump() {
        System.out.println("깡충");
    }
}

// 기존 코드 수정 없이 토끼도 치료 가능!
PetClinic clinic = new PetClinic();
clinic.treat(new Dog()); 
clinic.treat(new Cat()); 
clinic.treat(new Rabbit()); // ✅ 새로 추가한 동물도 가능
```

**3. 의미 있는 분류 체계**

IS-A 관계는 현실 세계의 개념을 코드로 자연스럽게 옮깁니다.

```java
// 현실 세계 코드로 표현
class Animal {
}

// 포유류 IS-A 동물
class Mammal extends Animal {
}

class Bird extends Animal {
}

// 개 IS-A 포유류
class Dog extends Mammal {
}
```

**잘못된 상속: IS-A 관계가 아닌 경우**

```java
// ❌ 나쁜 예 1: 자동차가 엔진이다?
class Car extends Engine {
    // Car IS-A Engine? (자동차는 엔진이다?)
    // 말이 안 됨!
}

// ✅ 올바른 설계: 자동차가 엔진을 가진다
class Car {
    private Engine engine;  // HAS-A 관계 (구성)
    // Car HAS-A Engine (자동차는 엔진을 가진다) ✅
}
```

---

## extends 키워드

Java에서 상속은 `extends` 키워드로 표현합니다.

### 기본 문법

```java
class 부모클래스 {
    // 공통 필드
    // 공통 메서드
}

class 자식클래스 extends 부모클래스 {
    // 부모의 기능을 자동으로 물려받음
    // 추가 필드와 메서드 정의 가능
}
```

### 실제 예시

```java
// 부모 클래스 (슈퍼클래스, 기반 클래스)
class Parent {
    int a = 10;

    void parentMethod() {
        System.out.println("부모 메서드");
    }
}

// 자식 클래스 (서브클래스, 파생 클래스)
class Child extends Parent {
    int b = 20;

    void childMethod() {
        System.out.println("자식 메서드");
    }
}

// 사용
Child child = new Child();

// 1. 부모로부터 상속받은 것
child.a;              // ✅ 10
child.parentMethod(); // ✅ "부모 메서드"

// 2. 자신이 정의한 것
child.b;             // ✅ 20
child.childMethod(); // ✅ "자식 메서드"
```

### 상속의 핵심 규칙

- `extends` 뒤에는 단 **하나의 클래스**만 올 수 있습니다 (단일 상속)
- 자식 클래스는 부모의 `public`, `protected` 멤버를 상속받습니다
- 자식 클래스는 부모에 없는 **새로운 기능을 추가**할 수 있습니다
- `private` 멤버는 상속되지 않습니다

---

## 참조

[Do it! 자바 완전 정복](http://www.yes24.com/Product/Goods/103389317)
