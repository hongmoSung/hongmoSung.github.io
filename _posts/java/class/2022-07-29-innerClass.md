---
title: "이너 클래스"
categories:
  - java
tags:
  - java
  - inner class
toc: true
---
### 이너 클래스의 종류
클래스 내부에 포함되는 이너 클래스(inner class)는 인스턴스 맴버 이너 클래스, 
정적 맴버 이너클래스 그리고 
지역 이너 클래스로 나뉜다.

```java
public class A { // outer class

    // member inner class
    class B { // instance member class
    }

    static class C { // static member class
    }
    // member inner class

    void abc() {
        // local inner class
        class D {

        }
    }
}
```

인스턴스 맴버와 정적 맴버 이너 클래스는 필드와 메서드처럼 클래스의 맴버인 반면, 
지역 이너 클래스는 메서드 내에서 정의하며, 지역 변수처럼 해당 메서드 내부에서만 한정적으로 사용되는 클래스다.

### 인스턴스 맴버 이너 클래스
객체 내부에 맴버의 형태로 존재, 자신을 감싸고 있는 아우터 클래스(outer class)의 모든 접근 지정자의 맴버에 접근할 수 있다.  

#### 인스턴스 이너 클래스 객체 생성하기
인스턴스 맴버 이너 클래스는 아우터 클래스의 객체 내부에 존재한다. 따라서 이너 클래스의 객체를 생성하기 위해서는 
먼저 아우터 클래스의 객체를 생성해야 한다. 이후 생성한 아우터 클래스 객체의 참조 변수를 이용해 객체 내부에 있는 
이너 클래스의 생성자를 다음과 같이 호출한다.

```java
class Test {
    class A {
        class B {

        }
    }

    public static void main(String[] args) {
        A a = new A();
        A.B b = a.new B();
    }
}
```


## 참조

[Do it! 자바 완전 정복](http://www.yes24.com/Product/Goods/103389317)