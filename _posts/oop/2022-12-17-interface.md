---
title: "What Is an Interface?"
categories:
  - oop
tags:
  - interface
toc: true
---
객체는 노출된 메서드를 통해 외부 세계와의 상호 작용을 정의합니다.  
메소드는 외부 세계와 객체의 인터페이스를 형성합니다.   
예를 들어 텔레비전 전면에 있는 버튼은 사용자와 플라스틱 케이스의 다른 쪽 전기 배선 사이의 인터페이스입니다.  
"전원" 버튼을 눌러 TV를 켜고 끕니다.

가장 일반적인 형태의 인터페이스는 본문이 비어 있는 관련 메서드 그룹입니다.  
인터페이스로 지정된 경우 자전거의 동작은 다음과 같이 나타날 수 있습니다.

```java
interface Bicycle {

    //  wheel revolutions per minute
    void changeCadence(int newValue);

    void changeGear(int newValue);

    void speedUp(int increment);

    void applyBrakes(int decrement);
}
```

이 인터페이스를 구현하려면 클래스 이름이 변경되고(예: ACMEBicycle과 같은 특정 브랜드의 자전거로) 클래스 선언에서 implements 키워드를 사용합니다.

```java
class ACMEBicycle implements Bicycle {

    int cadence = 0;
    int speed = 0;
    int gear = 1;

    // The compiler will now require that methods
    // changeCadence, changeGear, speedUp, and applyBrakes
    // all be implemented. Compilation will fail if those
    // methods are missing from this class.

    void changeCadence(int newValue) {
        cadence = newValue;
    }

    void changeGear(int newValue) {
        gear = newValue;
    }

    void speedUp(int increment) {
        speed = speed + increment;
    }

    void applyBrakes(int decrement) {
        speed = speed - decrement;
    }

    void printStates() {
        System.out.println("cadence:" +
                cadence + " speed:" +
                speed + " gear:" + gear);
    }
}
```

인터페이스를 구현하면 클래스가 제공하겠다고 약속한 동작에 대해 보다 형식적이 될 수 있습니다.  
인터페이스는 클래스와 외부 세계 간의 계약을 형성하며 이 계약은 빌드 시 컴파일러에 의해 적용됩니다.  
클래스가 인터페이스를 구현한다고 주장하는 경우 해당 인터페이스에서 정의한 모든 메서드는 클래스가 성공적으로 컴파일되기 전에 해당 소스 코드에 나타나야 합니다.

### 참조

- [What Is an Interface?](https://docs.oracle.com/javase/tutorial/java/concepts/interface.html)