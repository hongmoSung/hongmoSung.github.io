---
title: "제네릭의 상속"
categories:
  - java
tags:
  - generic
  - 제네릭
  - 제네릭 상속
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

```


## 참조

[Do it! 자바 완전 정복](http://www.yes24.com/Product/Goods/103389317)