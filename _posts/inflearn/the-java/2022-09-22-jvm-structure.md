---
title: "[더 자바 - 백기선] JVM 구조"
categories:
  - inflearn
  - the-java
tags:
  - jvm
toc: true
---
<img src="../../../assets/images/inflearn/the-java/jvm.png" alt="jvm">  

### 클래스 로더 시스템
- .class 에서 바이트코드를 읽고 메모리에 저장
- 로딩: 클래스 읽어오는 과정
- 링크: 레퍼런스를 연결하는 과정
- 초기화: static 값들 초기화 및 변수에 할당

### 메모리
- 메소스 영역에는 클래스 수준의 정보(클래스 이름, 부모 클래스 이름, 메소드, 변수) 저장. 공유되는 자원이다.
- 힙 영역에는 객체를 저장. 공유 자원이다. (인스턴스?)
- 스택 영역에는 쓰레드 마다 런타임 스택을 만들고, 그 안에 메소드 호출을 스택 프레임이라 부르는 블럭으로 쌓는다.
  쓰레드를 종료하면 런타임 스택도 사라진다.
- PC(Program Counter) 레지스터: 쓰레드 마다 쓰레드 내 현재 실행할 스택 프레임을 가리키는 포인터가 생성된다.
- 네이티브 메소드 스택
- https://javapapers.com/core-java/java-jvm-run-time-data-areas/#Program_Counter_PC_
  Register

### 실행 엔진
- 인터프리터: 바이트 코드를 한줄 씩 실행
- JIT 컴파일러: 인터프리터 효율을 높이기 위해, 인터프리터가 반복되는 코드를 발견하면 JIT 컴파일러로 반복되는 코드를 모두 네이티브 코드로 바꿔둔다.
  그 다음부터 인터프리터는 네이티브 코드로 컴파일된 코드를 바로 사용한다.
- GC(Garbage Collector): 더 이상 참조되지 않는 객체를 모아서 정리한다.

### JNI(Java Native Interface)
- 자바 애플리케이션에서 C, C++, 어셈블리로 작성된 함수를 사용할 수 있는 방법을 제공
- Native 키워드를 사용한 메소드 호출
- https://medium.com/@bschlining/a-simple-java-native-interface-jni-example-in-java-andscala-68fdafe76f5f

### 네이티브 메소드 라이브러리
- C, C++ 로 작성 된 라이브러리

## 참조
- [더 자바, 코드를 조작하는 다양한 방법](https://www.inflearn.com/course/the-java-code-manipulation)
- [jvm-works-jvm-architecture](https://www.geeksforgeeks.org/jvm-works-jvm-architecture/)
- [jvm-architecture-explained](https://dzone.com/articles/jvm-architecture-explained)
- [JVMInternals](http://blog.jamesdbloom.com/JVMInternals.html)