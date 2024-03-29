---
title: "[소프트웨어 장인] 6장 동작하는 소프트웨어"
categories:
  - book
tags:
  - software-craftsman
toc: true
---
소프트웨어 프로젝트는 중요한 일들이 상당히 많아서 그에 비해 덜 중요해 보이는 것들, 예를 들어 코드의 품질에는 조직 차원의
주의를 기울이지 않는 경향이 있다. 이 장에서는 왜 동작하는 소프트웨어 만으로는 부족한지, 나쁜 소프트웨어가 보이지 않는 어떤
문제들을 일으키는지 알바볼 것이다. 더불어 레거시 시스템을 다루는 개발자들을 돕고 저품질 소프트웨어 양산을 막을 수 있는지도
이야기한다.

### 동작하는 소프트웨어만으로는 부족하다.

시간이 흐르면서 동작하는 소프트웨어에 대한 개념이 '고품질의 동작하는 소프트웨어'로 옮겨간다. 그럼에도 불구하고 애자일 프로젝트들이
수준 이하의 코드들이 많아지고 있다. 매일같이 부딪히는 엉망진창인 레거시 코드들로 만들어진 애플리케이션에 새로운 기능을 추가한다고 생각해보자.
그마저도 자동화가 되어 있지 않아 모든 것을 직접 손으로 하나하나 테스트해야 한다. 이러한 소프트웨어도 동작하는 소프트웨어이기는 하다.

이런 상황들은 품질에 대한 개념을 완전히 잃어 버렸거나 그냥 주어진 상황을 체념하고 받아들이는 것과 같다.

### 정원 돌보기

> 프로그래밍은 집을 짓는다기보다는 정원을 돌보는 것에 더 가깝다.
> - "실용주의 프로그래머" 인용

코드는 정원처럼 지속적인 유지보수가 필요하다. 정기적으로 살피지 않으면 변화가 있을 때마다, 새 기능을 추가할 때마다 상태가 나빠진다.
잘못된 설계, 테스트 부족, 프로그래밍 언어나 도구의 미숙한 활용도 코드를 더 빨리 썩게 만든다. 결국 유지보수에 드는 비용과
노력이 감당할 수 없을 만큼 커져버린다.

### 보이지 않는 위협

개발 업무가 공장 라인처럼 취급되는 환경이라면, 시간이 갈수록 상황이 악화된다. 제대로 원인 파악도 안 된 버그들이 생겨나고 기능 구현과
테스트에 걸리는 시간이 점점 더 길어진다. 코드의 품질이 낮아질수록 새로운 기능을 추가하거나 버그를 수정하거나 어떤 기능을 테스트하는 일이
점점 더 어려워진다.

코드의 품질에 제대로 신경을 쓸 시간이 없다고 말하는 사람들이 많다. "원래 소프트웨어 프로젝트가 그런거 아닌가? 처음에는 개발하면서 쌓아 올리지만
테스트와 안정화 단계를 거칠수밖에 없는 거 아닌가? 모든 소프트웨어 개발이 그렇지 않나?"라고 말하기도 한다.

#### 자신이 만든 소프트웨어 인질이 되는 상황

기능을 수정하거나 새로 추가할 때 코드 베이스에 너무 많은 시간을 들여야 한다면, 개발자들이 기존 코드에 손을 대는 것을 두려워 한다면 지체 없이 대응해야 한다.
비즈니스 의사결정에 영향을 끼치는 저품질 코드는 용납될 수가 없다.

가장 큰 문제는 나쁜 코드가 개발자 외에 다른 사람들에게 보이지 않는다는 점이다. 개발자가 코드의 문제를 프로젝트 관리자에게 이야기하고 리펙토링 시간을 요구할 때도
있지만 무시되는 경우가 많다. 이는 관리자가 나쁜코드의 악영향에 대해 이해가 부족하거나 개발자가 문제 상황을 제대로 설명하지 못한다는 것이다.
개발자가 별도의 리펙토링 시간을 요구한다는 것은 과거에 이런 저런 이유로 코드를 대충 작성한 부분이 있다는 뜻이기도 하다.

#### 평범한 개발자가 아닌 장인을 고용하라

장인에게 시간적인 제약이나 요구사항의 변경이 나쁜 코드를 위한 변명이 될 수는 없다. 우리 업계는 이제서야 코드의 품질이 프로젝트의 성공을 보증하지는 못하더라도
실패의 핵심 요인이 될 수 있다는 것을 배우고 있다.

### 시간에 대한 잘못된 인식

아침에 일어나면서 "오늘은 하루를 망쳐야겠다. 할 수 있는 한 최악의 코드를 짜서 상사와 팀 전체를 골탕먹이겠어."라고 마음먹는 사람은 없다.
그렇다면 왜 그많은 애자일 프로젝트들이 실패하고 있을까?

#### 기술적 부채에 대한 이야기

"이미 동작하고 있는 코드예요. 이 코드는 당장은 안쓰지만 나중에 필요할 수도 있고요", "제안하신 부분을 이렇게 리펙토링해볼게요 단위 테스트 구현도 기술적 부채
백로그에 기록하겠습니다."

누군가가 백로그 기술적 부채 항목을 보고 언제가 고칠 거라고 생각들을 하지만 그런 일은 절대 일어나지 않는다.  
백로그에 기술적 부채를 더하는 행위는 **개발자가 코딩을 하던 당시에 아무런 죄책감 없이 잘못된 코드를 그대로 반영**했다는 것밖에는
설명이 안 된다.

#### 우리는 올바른 것을 하길 원한다

개발자들이 의도적으로 나쁜 코드를 작성하지는 않는다. 다만 항상 왜 그렇게 될 수밖에 없었는지 핑계거리를 찾는다. 비즈니스 팀이 일정에 관해
압박할 때도 있지만 스스로 쫓기는 경우가 대부분이다.

비즈니스에서 필요로 하는 기능을 최대한 빨리 끝내는 것이 개발자로서 미덕이라고 느끼고 있다. 상황을 솔직하고 투명하게 밝히고 며칠 더 늦게 안정적인
솔루션을 전달하기보다 버그가 좀 있더라도 일정 안에 전달하는 편이 더 낫다고 느낀다. 빨리 하는 것과 허술한 것은 다르다.

#### 시간적 여유가 없는 바쁜 팀

단위 테스트를 작성할 시간적 여유가 없다는 이유로 단위 테스트로 쉽게 발견할 수 있는 사소한 논리 오류가 다른 개발자들의 시간까지 갉아 먹는다.

#### 내겐 없는 여유, 다른 누군가에겐 있는 여유

1990년대만 해도 디버깅 스킬이 채용 면접의 주요 주제였다. 하지만 지금은 디버깅을 해야하는 상황이 발생하면 즉시 문제를 해결해 관련 코드를 리팩토링하고
테스트 코드를 만들어서 다시는 그런 일이 필요하지 않도록 해야 한다.

#### 단위 테스트 작성은 별개의 업무인가

단위 테스트는 우리가 코드를 작성하는 방식에 이미 녹아있는 것이지 별도의 작업이 아니다. 테스트하지 않았다면 코드 작성을 완료했다고 할 수 없다.
단위 테스트를 작성하도록 팀 단위에서의 합의가 있었다면, 기능 구현 환료에는 단위 테스트의 구현 및 테스트 완료까지 포함되어야 한다.

항상 프로젝트에 다른 사람들도 잇다는 사실을 인식하고 전체 프로젝트에 미치는 영향을 감안하여 책임있게 행동해야 한다.  
소프트웨어 프로젝트는 팀워크다. 특정 개발자 한 사람을 위한 것이 아니다. 특정 개발자에게 쉽고 분명한 것이 팀내 다른 개발자에게는
난해하고 불분명할 수 있다. 시스템이 커짐에 따라 프로젝트에 관계된 모든 사람들이 개인의 작은 이기적 행동들 때문에 피해를 입게 된다.

#### 효율적인 시간 활용

고객들, 고용주들이 관심 있는 사항은 요구사항의 변화 속도만큼이나 소프트웨어의 변화 속도도 빠르기를 희망한다. 이러한 기대를 충족시키는 것이
우리들의 과업이다. 결국 관심이 있는 사항은 투자한 만큼 이득이 되돌아 오느냐다.

업무를 계획하고 일정을 춧한할 때, 좋은 코드뿐만 아니라 좋은 개발 환경을 만드는 데 필요한 것도 함께 고려해 두어야 한다.

수동 테스트, 디버깅, 오래 걸리는 빌드, 까다로운 애플리케이션 배포(deploy), 복잡한 프로젝트 개발 환경 설정같은 것에 시간을 덜 빼앗길수록
애플리케이션의 품질에 더 신경을 쓸 수 있고 고객을 행복하게 할 수 있다.

### 레거시 코드

새로운 직장에서 또다른 레거시 코드를 만나지 않을 가능성은 극히 낮다. 서로 다른 회사나 프로젝트들에 따라 다른 점은 단지
빠져있는 구렁텅이의 깊이가 얼마냐 깊느냐의 차이뿐이다.

#### 태도의 변화

> 무언가가 마음에 들지 않는다면 바꾸어라.  
> 그것을 바꿀 수 없다면, 그에 대한 당신의 생각을 바꾸어라.
> - 마리 엥겔브레이트

레거시 코드에서 일하면서 지난 몇 년간 몇가지를 배웠다. 아무리 한탄하고 불평하더라도 쉬워지거나 나아지지 않는다는 점이다.
무언가 나아지길 원한다면 그에 맞는 행동을 취해야 한다. 레거시 코드를 다룰 때는 끙끙 앓으면서 상스런 말을 내뱉는 대신 그것을 이해하고
개선하려 노력해야 한다. 레거시 코드를 개선하고 이해도를 높이면 업무에 크게 도움이 된다.

테스트 코드를 작성하고 메서드와 클래스를 정리하며 변수명을 적합하게 바꾸는 등 점차적으로 코들르 이해하기 쉽고 다루기 편하게 만들어 갈 수 있다.

즉 점진적으로 기존 코드에 대한 테스트 코드를 작성하면서 코드에 대한 이해도를 높이고 리펙토링을 해나간다.

남이 작성한 코드를 엉망이라고 그냥 말하기는 쉽다. 심지어 비웃을 수도 있다. 하지만 나라면 더 잘 만들 수 있는가?라고 스스로에게 물어보아야 한다.

#### 고객과 개발자 모두의 만족

항상 우리가 대가를 지불받고 있는 프로페셔널이라는 사실을 잊지 않고 고객이 비즈니스 목적을 달성토록 주의를 기울여야 한다.
애플리케이션의 수명을 늘린다는 것은 고객의 투자 이익을 극해돠한다는 의미다. 일을 즐길 수 있느냐 없느냐는 우리의 태도에 달려 있다.

### 요약

많은 기업들이 자신의 소프트웨어에 인질로 잡혀 있다. 소프트웨어의 품질이 좋지 않을수록 변경하기가 더 어려워진다. 기업이 사용하는 소프트웨어의 개선이나
변경이 느릴수록 시장 환경의 변화에 기업이 대응하는 속도도 떨어진다.

회사와 개발자들은 정기적으로 도끼날을 가는 시간이 낭비가 아니라는 사실을 이해해야 한다. 바로 그것이 시간을 절약하고 끊임없이 빨리
움직일수 있는 최선의 방법이다.

## 참조

- [소프트웨어 장인](http://www.yes24.com/Product/Goods/20461940)