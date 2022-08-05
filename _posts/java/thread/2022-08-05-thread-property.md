---
title: "쓰레드(Thread)의 속성"
categories:
  - java
tags:
  - java
  - process
  - thread
toc: true
---
쓰레드의 객체를 참조하거나 우선순위를 지정하는 것, 쓰레드의 속성 종류와 활용하는 방법

## 쓰레드의 속성

### 현재 쓰레드 객체 참조값 얻어오기
```java
Thread.currentThread()
```

### 실행 중인 쓰레드의 갯수 가져오기
```java
Thread.activeCount()

```

```java
public class Test {
    public static void main(String[] args) {
        Thread currentThread = Thread.currentThread();
        System.out.println("현재 쓰레드의 이름 -> " + currentThread.getName());
        System.out.println("동작하는 쓰레드의 갯수 -> " + Thread.activeCount());

        for (int i = 0; i < 3; i++) {
            Thread thread = new Thread();
            System.out.println(thread.getName());
            thread.start();
        }

        for (int i = 0; i < 3; i++) {
            Thread thread = new Thread();
            thread.setName(i + " 번째 쓰레드");
            System.out.println(thread.getName());
            thread.start();
        }

        for (int i = 0; i < 3; i++) {
            Thread thread = new Thread();
            System.out.println(thread.getName());
            thread.start();
        }

        System.out.println("동작하는 쓰레드의 갯수" + Thread.activeCount());

    }
}
```
## 참조

[Do it! 자바 완전 정복](http://www.yes24.com/Product/Goods/103389317)