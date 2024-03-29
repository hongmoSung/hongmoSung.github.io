---
title: "[더 자바 - 백기선] 클래스 로더"
categories:
  - inflearn
  - the-java
tags:
  - class-loader
toc: true
---
<img src="../../../assets/images/inflearn/the-java/class-loader.png" alt="class-loader">  

- ### 로딩
    - 클래스 로더가 .class 파일을 읽고 그 내용에 따라 적절한 바이너리 데이터를 만들고 "메소드" 영역에 저장.
    - 이때 메소드 영역에 저장하는 데이터
        - FQCN
        - 클래스 | 인터페잇 | 이늄
    - 로딩이 끝나면 해당 클래스 타입의 Class 객체를 생성하여 "힙" 영역에 저장.
- ### 링크
    - Verify, Prepare, Resolve(optional) 세 단계로 나눠져 있다.
    - 검증: .class 파일 형식이 유효한지 체크한다.
    - Preparation: 클래스 변수(static 변수) 와 기본값에 필요한 메모리
    - Resolve: 심볼릭 메모리 레퍼런스를 메소드 영역에 있는 실제 레퍼런스로 교체한다.
- ### 초기화
    - Static 변수의 값을 할당한다. (static 블럭이 있다면 이때 실행된다.)
- ### 클래스 로더는 계층 구조로 이뤄져 있으면 기본적으로 세가지 클래스 로더가 제공된다.
    - 부트 스트랩 클래스 로더 - JAVA_HOME\lib 에 있는 코어 자바 API 를 제공한다. 최상위 우선순위를 가진 클래스 로더
    - 플랫폼 클래스로더 - JAVA_HOME\lib\ext 폴더 또는 java.ext.dirs 시스템 변수에 해당하는 위치에 있는 클래스를 읽는다.
    - 애플리케이션 클래스로더 - 애플리케이션 클래스패스(애플리케이션 실행할 때 주는 -classpath 옵션 또는 java.class.path 환경 변수의 값에 해당하는 위치)
      에서 클래스를 읽는다.

## 참조
- [더 자바, 코드를 조작하는 다양한 방법](https://www.inflearn.com/course/the-java-code-manipulation)
