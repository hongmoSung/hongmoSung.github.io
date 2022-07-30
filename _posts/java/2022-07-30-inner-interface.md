---
title: "이너 인터페이스"
categories:
  - java
tags:
  - interface
  - inner interface
toc: true
---

## 정의와 특징
중요한 특징 중 하나는 **정적 이너 인터페이스만 존재**할 수 있다는 것이다.  
만일 이너 인터페이스 앞에 `static` 제어자를 생략하면 컴파일러가 자동으로 추가해 준다.

```java
class A {
    static interface B { // static 을 생략하면 컴파일러가 자동으로 추가
        void hello();
    }
}

class C implements A.B {

    @Override
    public void hello() {

    }

}

public class Test {
    public static void main(String[] args) {

        // 1. 인터페에스 구현 클래스 생성 및 객체 생성
        C c = new C();
        c.hello();
        
        // 2. 익명 이너 클래스 사용
        A.B b = new A.B() {
            @Override
            public void hello() {
                // ...
            }
        };
        b.hello();
    }

}
```

이너 인터페이스도 인터페이스이므로 자체적으로 객체를 생성할 수 없다.  
따라서 객체를 생성하기 위해서는 해당 인터페이스를 상속한 자식 클래스를 생성한후 생성자를 이용해 객체를 생성하거나 
익명 이너 클래스를 활용해 객체를 생성해야 한다.  

## 참조
[Do it! 자바 완전 정복](http://www.yes24.com/Product/Goods/103389317)
