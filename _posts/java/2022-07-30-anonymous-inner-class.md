---
title: "익명 이너 클래스"
categories:
  - java
tags:
  - class
  - inner class
toc: true
---

### 익명 이너 클래스의 정의와 특징
말 그대로 '이름을 알 수 없는 이너 클래스'를 의미한다. 익명 이너 클래스는 정의된 위치에 따라 분류할 수 있다.
클래스의 중괄호 바로 아래에 사용했을 때는 **인스턴스 익명 이너 클래스**  

```java
interface C {
    void bcd();
}
```
비교를 위해 먼저 이름이 있는 인스턴스 이너 클래스로 구현하면 다음과 같다.
```java
class A1 {
    C b = new B();
    // 인스턴스 이너 클래스 (이름이 B 로 있으므로 익명 클래스가 아니다)
    class B implements C {
        public void bcd() { // 인터페이스 메서드는 암묵적으로 public 이므로 public 필수
        }
    }

    void abc() {
        // ...
    }
}
```
같은 내용을 클래스의 중괄호 바로 아래에서 익명 이너 클래스로 작성하면 **인스턴스 익명 이너 클래스**가 된다.
```java
class A2 {
    // C를 상속받아 bcd() 메서드를 오버라이딩한 익명 이너 클래스의 객체
    C b = new C() {
        public void bcd() {
        }
    };
    
    void abc() {
        // ...
    }
}
```
메서드 내부에서 사용했을 때는 **지역 익명 이너 클래스**를 의미한다.
```java
class A3 {
    void abc() {
        // 메서드 내부에서 C를 상속받아 bcd() 메서드를 오버라이딩한 익명 이너 클래스의 객체
        C c = new C() {
            public void bcd() {
            }
        };
        c.bcd();
    }
}
```

### 익명 이너 클래스를 활용한 인터페이스 타입의 입력 매개변수 전달
인터페이스 타입의 입력매개변수로 익명 이너 클래스를 이용해 생성한 객체를 전달하는 방법

예제) interface A에는 추상메서드 abc(), 클래스 C에는 A 타입을 매개변수로 받는 def(A a)가 있다.

1. 클래스 C의 객체를 생성한 후 def(A a) 메서드를 호출하기 위해서는 A 타입의 객체를 생성해야 한다.
2. 인터페이스로는 객체를 직접 생성할수 없음 -> A를 구현한 자식 클래스의 객체가 있어야 한다.  


```java
interface A {
    void abc();
}

class C {
    void def(A a) {
        a.abc();
    }
}

class B implements A {

    @Override
    public void abc() {
        // ...
    }
}

public class Test {
    public static void main(String[] args) {
        C c = new C();
        
        // 1. A를 구현한 자식클래스 B를 생성자를 통해 변수에 저장하고 메서드에 전달
        A a1 = new B();
        c.def(a1);
        
        // 2. A를 구현한 자식클래스 B를 생성자를 메서드에 직접 전달
        c.def(new B());
        
        // 3. 익명 이너클래스를 사용해 객체를 생성하고, 참조 변수 a를 메소드에 전달
        A a = new A() {
            @Override
            public void abc() {
                //
            }
        };
        c.def(a);
        
        // 4. 참조변수를 전달하지 않고 곧바로 익명 이너 클래스 객체를 생성해 전달 
        c.def(new A() {
            @Override
            public void abc() {
                //
            }
        });
    }
}
```

## 참조
[Do it! 자바 완전 정복](https://www.yes24.com/Product/Goods/103389317)