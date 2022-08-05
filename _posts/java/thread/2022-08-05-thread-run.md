---
title: "프로그램, 프로세스, 쓰레드"
categories:
  - java
tags:
  - java
  - process
  - thread
toc: true
---
쓰레드를 생성하는 방법은 크게 2가지로 나눌수 있다.  
1. Thread 클래스를 상속받아 run() 메서드를 오버라이딩하는 것
2. Runnable 인터페이스를 구현한 객체를 생성한뒤 run() 메서드를 구현하는 것

## 쓰레드의 생성 및 실행

### Thread 클래스를 상속받아 run() 메서드 재정의

```java
class A extends Thread {
    @Override
    public void run() {
        String[] strs = {"하나", "둘", "셋", "넷", "다섯"};

        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        for (String str : strs) {
            System.out.println("- (자막 번호) " + str);
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

    }
}

class B extends Thread{
    @Override
    public void run() {
        int[] ints = {1, 2, 3, 4, 5};

        for (int anInt : ints) {
            System.out.println("(비디오 프레임) " + anInt);
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}

public class Test {
    public static void main(String[] args) {
        A a = new A();
        a.start();

        B b = new B();
        b.start();
    }
}

```

### Runnable 인터페이스 구현 객체를 생성한 후 Thread 생성자로 Runnable 객체 전달

```java
class A implements Runnable {
    @Override
    public void run() {
        String[] strs = {"하나", "둘", "셋", "넷", "다섯"};

        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        for (String str : strs) {
            System.out.println("- (자막 번호) " + str);
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

    }
}

class B implements Runnable{
    @Override
    public void run() {
        int[] ints = {1, 2, 3, 4, 5};

        for (int anInt : ints) {
            System.out.println("(비디오 프레임) " + anInt);
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }
}

public class Test {
    public static void main(String[] args) {
        Runnable a = new A();
        Thread thread1 = new Thread(a);

        Runnable b = new B();
        Thread thread2 = new Thread(b);

        thread1.start();
        thread2.start();
    }
}

```

## 참조

[Do it! 자바 완전 정복](http://www.yes24.com/Product/Goods/103389317)