---
title: "인터페이스"
categories:
  - java
tags:
  - java
  - interface
toc: true
---

### 인터페이스의 정의와 특징
인터페이스는 내부의 모든 필드가 `public static final`로 정의 되고, `static`과 `default` 메서드 이외의 모든 
모든 메서드는 `public abstract`로 정의된 객체지향 프로그래밍 요소다.  
`class` 키워드 대신 `interface` 키워드를 사용해 선언한다.

```java
interface A {
    public static final int a = 3; // (public static final)

    public abstract void abc(); // (public abstract)
} 
```

이처럼 인터페이스 내에서 필드와 메서드에 사용할 수 있는 제어자(modifier)가 확정돼 있으므로 필드와 메서드 앞에 
제어자를 생략해도 컴파일러가 자동으로 각각의 제어자를 삽입한다.

```java
interface A {
    int a = 0;

    void abc();
}

public class Test {

    public static void main(String[] args) {
        // static 확인
        System.out.println(A.a);

        // final 확인
        // Cannot assign a value to final variable 'a'
        A.a = 0;
    }
}
```

### 인터페이스의 상속
클래스가 클래스를 상속할 때 `extends` 키워드를 사용한 반면, 클래스가 인터페이스를 상속할 때는 `implements` 키워드를 사용한다.  
상속에 있어서 인터페이스의 가장 큰 특징은 **다중 상속이 가능**하다는 것이다.

#### 다중 상속이 인터페이스에서는 어떻게 가능할까?
클래스에서 다중 상속을 할 수 없는 이유는 두 부모 클래스에 동일한 이름의 필드 또는 메서드가 존자할 때 
이를 내려받으면 충돌이 발생(ambiguous error)하기 때문이다.  
하지만 인터페이스에서는 모든 필드가 `public static fianl`로 정의돼 있어 실제 데이터값은 각각의 인터페이스 
내부에 존재(즉, 저장 공간이 분리)해 공간상 겹치지 않기 때문이다.  

### 디폴트 메서드와 정적 메서드
자바8 부터 인터페이스 내에 완성된 메서드인 디폴트(default) 메서드가 포함될수 있다.  
디폴트 메서드는 `public default 리턴타입`을 붙여 표기한다.

> 탄생된 배경은 많은 클래스들이 해당 인터페이스를 구현하고 있을때 인터페이스에 메서드가 추가하게 되면 모두 구현을 해주어야 하기 때문에 탄생하게 되었다.

## 참조

[Do it! 자바 완전 정복](http://www.yes24.com/Product/Goods/103389317)