---
title: "객체의 타입 변환"
categories:
  - java
tags:
  - upcasting
  - downcasting
  - object
  - type
toc: true
---
자료형이 서로 다를 때는 컴파일러가 자동으로 타입을 변환해 주거나 개발자가 직접 명시적으로 타입을 변환해 줘야한다.
객체에서도 이러한 타입 변환이 일어나는데 이름 업캐스팅(Upcasting), 다운캐스팅(Downcasting)이라 한다.

### 객체의 업캐스팅과 다운캐스팅

#### 기본 자료형
- 업 캐스팅 : 범위가 좁은 쪽 -> 넓은 쪽으로 캐스팅하는 것
- 다운 캐스팅 : 범위가 넓은 쪽 -> 좁은 쪽

#### 객체
- 업 캐스팅 : 자식 클래스 -> 부모 클래스 쪽으로 변환
  - 항상 가능 명시적으로 적어 주지 않아도 컴파일러가 대신 넣어 준다.
- 다운 캐스팅 : 부모 클래스 -> 자식 클래스 쪽으로 변환
  - 개발자가 직접 명시적으로 넣어 줘야한다.
  - 잘못된 다운 캐스팅을 수행하면 `ClassCastException`이라는 예외가 발생한다.

```java
class Human {
}

class Student extends Human {
}

class HighSchool extends Student {
}

public class Test {
    public static void main(String[] args) {
        // 고등학생 -> 학생 -> 사람 (o)
        HighSchool a = new HighSchool();
        Human h1 = a;
        
        // 사람 -> 학생 -> 고등학생 (x)
        Human h2 = new Human();
        // -> java.lang.ClassCastException
        Student s1 = (Student) h2; 

        Human h3 = new Student();
        // (o)
        Student s = (Student) h3;
        // Exception in thread "main" java.lang.ClassCastException:
        HighSchool h = (HighSchool) h3;
    }
}
```

> 캐스팅 가능 여부는 무슨 타입으로 선언돼 있는지는 중요하지 않으며 **어떤 생성자로 생성**됐는지가 중요하다.



