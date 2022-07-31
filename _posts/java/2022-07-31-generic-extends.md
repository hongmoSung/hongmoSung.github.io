---
title: "제네릭 타입 범위 제한"
categories:
  - java
tags:
  - generic
  - 제네릭
  - 제네릭 상속
  - 제네릭 타입 범위 제한
toc: true
---

## 제네릭 타입 범위 제한의 필요성
다양한 타입을 처리할 수 있다는 장접이 있지만 어떤 타입으로 올지 모르기 때문에 Object 클래스의 메서드 외에는 사용할 수 있는 메서드가 제한적이다.

```java
class A {

    <T> void example(T t) {
        // t.length() 사용 불가능
    }

    <T extends String> void example2(T t) {
        // 제한을 함으로써 사용 가능
        t.length();
    }
}
```

### 제네릭 클래스의 타입 제한

```java
class 클래스명 <T extends 최상위 클래스 / 인터페이스명> {
    
}
```

```java
class Fruit {
}

class Apple extends Fruit{
}

class Pencil {
}

// 과일로 타입으로 제한
class Goods<T extends Fruit> {
    private T t;
    public T get() {
        return t;
    }

    public void set(T t) {
        this.t = t;
    }
}
public class Test {

    public static void main(String[] args) {
        Goods<Fruit> fruitGoods = new Goods<>();
        // 과일 타입은 가능
        fruitGoods.set(new Apple());
        // fruitGoods.set(new Pencil()); 아닌 경우 불가능
    }
}

```

### 제네릭 메서드의 타입 제한
```java
public <T extends 최상위 클래스 / 인터페이스명> T example(T t) {
    // ...
}
```

```java
// 클래스로 제한
class A {
    <T extends String> void method(T t) {
        System.out.println(t.length());
    }
}

// 인터페이스로 제한
interface MyInterface {
    void print();
}

class B {
    // 인터페이스에서도 extends 키워드를 사용한다.
    <T extends MyInterface> void example(T t) {
        t.print();
    }
}
```

### 메서드 매개변수일 때 제네릭 클래스의 타입 제한

```java
// 상속 구조: A <- B <- C <- D 
class A {}
class B extends A {}
class C extends B {}
class D extends C {}

class Goods<T> {
    private T t;

    public T get() {
        return t;
    }

    public void set(T t) {
        this.t = t;
    }
}

class Test {
    void mehod1(Goods<A> g) {} // A인 객체만 가능
    void mehod2(Goods<?> g) {} // 모든 타입 객체 가능
    void mehod3(Goods<? extends B> g) {} // B 또는 B의 자식 클래스인 객체만 가능
    void mehod4(Goods<? super B> g) {} // B 또는 B의 부모 클래스인 객체만 가능
}

public class Test3 {

    public static void main(String[] args) {
        Test t = new Test();
        
        // case1
        t.mehod1(new Goods<A>());
//        t.mehod1(new Goods<B>());
//        t.mehod1(new Goods<C>());
//        t.mehod1(new Goods<D>());

        // case2
        t.mehod2(new Goods<A>());
        t.mehod2(new Goods<B>());
        t.mehod2(new Goods<C>());
        t.mehod2(new Goods<D>());

        // case3
//        t.mehod3(new Goods<A>());
        t.mehod3(new Goods<B>());
        t.mehod3(new Goods<C>());
        t.mehod3(new Goods<D>());

        // case4
        t.mehod4(new Goods<A>());
        t.mehod4(new Goods<B>());
//        t.mehod4(new Goods<C>());
//        t.mehod4(new Goods<D>());

    }
}

```

## 참조

[Do it! 자바 완전 정복](http://www.yes24.com/Product/Goods/103389317)