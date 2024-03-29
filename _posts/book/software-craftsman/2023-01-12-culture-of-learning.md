---
title: "[소프트웨어 장인] 13장 배움의 문화"
categories:
  - book
tags:
  - software-craftsman
toc: true
---

관리자들이 변화를 일으키려 할 때 일방적인 통보와 별 다를 바 없는 행동으로 아무런 효과도 봇지 못하는 경우를 흔하게 본다.
이 장에서는 배움의 문화를 만들기 위해 개발자들이 할 수 있는 여러 가지 활동들에 대해 살펴본다.

### 잘못된 방향으로 동기 부여하기

사람들에게 새로운 절차나 새로운 관례를 강제한다고 조직을 변화시킬 수 없으며 우리는 배움의 문화를 만들어 내야한다. 사람들 스스로
모든 것을 더 나아지게 하고 싶어하는 동기를 부여할 수 있어야 한다.

### 배움의 문화 만들기

관리자들은 개발자들에게 무엇을 언제 어떻게 하라고 일일이 명령할 것이 아니라 개발자들에게 권한을 위임하고 개발자들 스스로 배움의 문화를
만들어갈 수 있도록 복돋워야 한다. 명령을 하게 되면 의무가 되고 흥미를 이끌기 어렵게 된다. 언제, 무엇을, 어떻게 배울지 개발자들
스스로 정하게 내버려 두자. 그러한 자유가 있어야만 배움의 문화를 만들고 내재화할 가능성이 높아진다.

#### 북 클럽에 가입하기

아무도 관심이 없으면 그냥 본인이 원하는 책을 읽기 시작한다. 대신 휴식 시간이나 식사 시간가은 편안한 때 책의 내용을 공유하고 대화를 시도하자

#### 테크 런치 진행하기

팀원들에게 일주일에 한 번 정도 점심 시간에 기술과 관련된 난상 토론회를 가지는 것을 제안해 보자. 현재 진행 중인 프로젝트의 개선 방향을 이야기하는 것도
좋지만 이 토론회를 업무의 연장으로 만들지는 않는 것이 좋다. 이 토론회는 배움에 대한 것으로 만들어야 한다. 서로 다른 기술, 접근 방법,
테크닉, 서적 등 참여자 누구든 공유하거나 토론하고 싶어하는 것을 다룬다.

#### 그룹 토론회에 참여하기

사무실 벽이나 화이트보드를 둘로 나눈다. 한쪽에는 각 참여자들에 의해 짧은 주제 발표가 될 항목들을 모으고, 다른 한쪽은 그룹 토론 대상으로
선정된 주제들을 모아 놓는다. 모든 참여자들이 사용하도록 포스트잇과 펜을 나눠주거나 아무나 가져갈 수 있게 테이블에 비치한다.
참여자들에게 발표하고 싶은 주제를 포스트잇에 적도록 한다. 약 5분 동안 주제를 발표하고 2분의 질답으로 이루어진다.

#### 업무 교환하기

프로젝트가 전개되는 와중에 이전에 결정된 사항들을 되돌아보는 경우는 극히 드물다. 현재의 도구와 이미 결정된 설계상의 선택들에 너무
익숙해져 더 나은 방법들을 탐색해보지 않게 된다. 즉 매너리즘에 빠지고 지루함이 찾아온다. 프로젝트의 한 업무 주기 동안 팀끼리 개발자를
서로 바꾸면 새로운 것을 볼 기회가 생긴다. 다른 팀의 개발자와 페어 프로그래밍을 하면 다른 기술, 다른 테크닉 그리고 다른 업무 방식과 사고
방식을 경험하게 된다.

- 기존 결정들에 대한 재검증: 기존 결정이 이루어진 맥락을 이해한 후 그 결정이 올바른 것이었는지 확인해 줄 수 있다.
- 지식의 공유: 특정 문제들이 어떤 식으로 해결 되었는지 배울 수 있다.
- 개선: 문제들을 해결할 더 나은 방법을 제안할 수도 있다.
- 공동 학습: 서로 현재의 해결책을 토론하고 지식들을 공유하고 나면 기존 맴버와 새로운 개발자 모두 더 나은 해결책이 떠오를 수 있다.

#### 얼마 동안만 업무 교환하기

다른 팀에 가서 편하게 페어 프로그래밍을 요청할 수 있는 환경이 된다면 서로 다른 기술들에 노출될 수 있는 기회를 쉽게 만들 수 있다.

#### 그룹 코드 리뷰하기

특정 코드 부분이 개선의 여지가 많은지 아니면 모범사례로 공표할 만큼 훌륭한지를 놓고서 동료들 간에 논쟁한다. 그룹 코드 리뷰를 가치 있게 생각하지만
올바르게 수행하는 것이 중요하다. 올바르게 수행한다는 것의 의미는 아래와 같다.

- 주석은 주관적, 개인적으로 표현되어서는 안된다.
- 누가 코드를 작성하느냐는 중요하지 않다.
- 그룹 코드 리뷰 시간에 커밋 히스토리를 뒤지지 않는다. 비난할 사람을 찾기 위해 과거를 파헤치지 말고 미래를 변화시키는 데 집중한다.
- 주석은 반드시 객관적이고 생산적이어야 한다. 왜 그것이 엉망인지가 아니라 어떻게 코드를 개선할지에 집중해야 한다.
- 퍼실리테이터의 도움이 필요할 수도 있다. 퍼실리데이터의 역할은 모두에게 발언권을 주고 누군가를 비난하는 상황이 생기지 않도록 하는 것이다.
- 큰 진전을 이룰 것이라 기대하지 않는다. 이슈 한 가지에 대해서 너무 오랫동안 이야기되더라도 개발자들이 원한다면 그냥 그렇게 한다.

#### 코딩 실습하기

코딩 실습의 주 목적은 연습문제를 끝내는 것이 아니라 최선의 코드를 작성하는 법을 훈련하는 것이다. 다음은 좋은 코딩 실습을 하기 위한 몇가지 지침이다.

- 퍼실리테이터는 반드시 연습문제를 잘 알고 있어야 한다. 사전에 문제를 두번 이상 풀어 보았어야 한다.
- 개발자는 페어 프로그래밍으로 연습문제를 푼다. 이때 이전에 페어 프로그래밍을 같이 한적이 없는 개발자들을 선정하는 것이 좋다.
- 퍼실리테이터가 별도로 지정하지 않은 한 기본 원칙으로서 반드시 TDD 를 지켜야 한다.
- 모든 개발자들이 같은 연습문제를 풀어야 한다. 이렇게 하면 문제의 해답들을 서로 비교하여 잘한 것과 못한 것을 되새길 수 있?고 문제 풀이가 아니라
  훈련으로써의 의도에 더 집중할 수 있다.
- 퍼실리테이터는 개발자를 살피고 도와주어야 한다. 훈련으로써 의미있는 비판적인 질문을 던지는 것이 좋다. 정답이나 직접적인 힌트를 주지 않도록 한다.
- 연습문제 풀기가 끝나면 퍼실리테이터는 반드시 리뷰 시간을 갖는다. 모든 개발자들의 결과물을 공유하여 어떻게 했는지 무엇을 배웠는지 이야기하게 한다.
- 실습이 끝난 후 개발자들은 서로의 페어 프로그래밍 파트너에게 감사를 표해야 한다.

다음은 회사 안에서 코딩 실습에서 고려해야 할 중요한 요소들이다.

- 코딩 실습을 업무의 연장으로 만들지 않는다. 코딩 실습의 의도는 안전한 환경에서의 훈련과 배움이다.
- 한 실습에 2시간 정도를 할당한다. 한 시간은 회사의 업무 시간을 부여하고 다른 한 시간은 개발자 개인 시간을 들이도록 한다. 예를 들어 업무 시간이 9-18시 라면
  17-19시를 코딩 실습 시간으로 잡는다. 이렇게 함으로써 회사와 개인 모두 배움의 문화를 만드는 데 투자하도록 한다.
- 퍼실리테이터 스스로 사전에 코딩 실습을 수차례 반복 연습한다. 다른 개발자들이 코딩 실습을 위해 사전에 준비할 일은 거의 없다. 퍼실리테이터는 코딩 실습을
  위해 사전에 준비할 일은 거의 업ㅅ다. 퍼실리테이터는 코딩 실습을 주관할 때 최대한 친근해야 한다. 그래야만 다음 코딩 실습에 개발자들이 부담 없이 참여할 수 있다.

#### 사용할 기술은 가능한 자유롭게 선택하기

개발 언어나 개발 도구를 제한하지 않고 가능하면 자유롭게 선택할 수 있게 하자. 사용할 기술을 지정해두면 코딩 실습을 운영하기에는 편하지만
그 지정된 기술에 관심이 없는 개발자라면 코딩 실습에 아예 참여하지 않을 수도 있다.

#### 내부 학습 모임을 만들기

이미 정기적인 모임을 진행하고 있다면 자주 참석하는 개발자들에게 그 모임의 운영을 도와 달라고 요청한다. 향후 모임의 운영 방향과 활성화 방법에 대해서
함께 논의하는 자리를 정기적으로 가진다. 이때 누구든 참여할 수 있게 민주적으로 운영되도록 노력해야 한다. 절대로 모임의 규모를 키우는 데
집착해서는 안된다. 모임이 알차고 재미있게 되는 데 집중해야 한다. 그러면 참여자의 숫자는 자연스럽게 늘어난다.

#### 회사에서의 펫 프로젝트 시간을 허용하기

팀 내 누군가가 펫 프로젝트를 하고 있거나 하길 원한다면 그 사실이 회사안에 알려지는 데 껄끄러움이 없도록 한다.
개발자 입장에서 좋은 펫 프로젝트가 있다는 것은 대단한 기쁨이다.

#### 외부 기술 커뮤니티와 교류하기

조직 안에만 머물러서는 안 된다. 작은 세상에만 있어야 할 이유는 없다. 주변에 기술 커뮤니티나 사용자 그룹이 있는지 찾아보자.
외부 커뮤니티를 통해 열정적이고 재능있는 수많은 개발자들과 함께 하면 나 자신에게 커다란 도전이 된다.

### 아무도 참여하려 하지 않는다면

서로 다른 사람, 서로 다른 프로젝트, 서로 다른 회사마다 서로 다른 방식으로 행동한다. 무언가에 관심을 갖도록 사람들의 행동을
변화시키기는 어려운 일이다. 불가능하다고 말하는 사람들도 있다. 당신의 열정과 책에서 얻은 지식으로 조직 전체를 바꿀 생각이라면
그냥 잊는게 좋다.

더 나은 일터로 만들기 위해 모든 사람을 바꿀 필요하는 없다. 배움의 문화를 만들려는 대다수의 시도들이 실패하는 이유도 거기에 있다.
팀 전체를 한번에 변화시키는 것을 목표로 하면 실망할 일만 있기도 하다. 변화를 추진할 동기도 약해지고 포기하기도 한다. 그런 일이
일어나도록 해서는 안된다.

#### 모범을 보여라

"나는 TDD를 좋아하지만 팀의 다른 개발자들은 관심이 없다. 그래서 나도 안 하고 있다." 어떤 개발자는 이렇게 불평한다. 당신 스스로도
하지 않으면서 어떻게 다른 사람들을 설득할 수 있겠는가? 팀에 열정을 불어 넣고 더 나은 일하는 방법을 추구하도록 하는 가장 효율적인
방법은 스스로 모범을 보이는 것이다. 새로운 길을 추구하는 열정적인 사람의 존재 자체가 팀 전체에 자극을 주는 열쇠일지도 모른다.

#### 관심을 보이는 사람에게 집중하라

당신의 열정과 변화 의지에 모두가 관심을 가질 것으로 기대하긴 어렵다. 변화를 수용하는 사람들에 집중하자.

#### 강제하지 마라

개발자들을 학습 모임에 강제로 참석시키면 상황은 극도로 안 좋아진다. 참여하기 싫은 사람을 참여시키려고 기존에 자발적으로 참여하고 있는
사람들이 흥미를 잃게 만드는 상황을 만들지 않는다. 최소한 그들로 인해 이미 참여하고 있는 사람들의 의욕이 꺾이는 나쁜 일들은 피하는 셈이 된다.
참여하지 않는 사람들에게 실망하거나 화내지 말자. 애초의 동기를 꾸준히 유지해야 한다. 개발된 커뮤니티의 원칙 중 하나는
'들어오는 사람이 초대 받은 사람이다'라는 태도다.

#### 모두를 변화시키려 들지 말라

모두를 바꾸려 할 필요는 없다. 소수의 사람들로도 큰 진보를 만들어 나갈 수 있다.

#### 모임에 대한 약속을 제때하라

모두가 참석할 틈을 찾기 위해 일주일 내내 일정 조율만 하는 경우를 너무나 많이 봤다. 각자의 사정은 다양하다. 그냥 특정 날짜를
정해서 모임을 진행하는 것이 좋다.

#### 허락을 구하지 마라

개인 시간을 들여 공부하고 연습하는 데 상사의 허락을 구할 필요는 없다. 대부분의 회사들에서 그렇다. 심지어 업무 시간에 공부를 하더라도
상사에게 허락을 구하지 않는다. 책임있게 행동하면 될 뿐이다. 팀이 스스로 더 나아지기 위해서 훈련하는 것에 대해 민감하게 반응하고 불평할
관리자는 없다. 단, 학습활동 때문에 업무를 소홀히 해서는 안 된다. 상식적으로 책임있게 행동해야 한다.

#### 투덜대지 마라

많은 것이 필요하지는 않다. 사무실이 부적합하다면 커피숍을 이용하자. 많은 준비나 조직화가 필요한 학습 모임을 목표로 삼지 말자.

#### 리듬을 만들어라

건강하고 지속되는 커뮤니티를 만드는 비결은 리듬을 가지는 것이다. 조직에 배움의 문화를 심는 것은 어려운 일이 아니다. 배우고자 하는 열정적인
개발자들만 있으면 시작할 수 있다. 핑계거리를 찾지 말고 나 자신부터 그런 개발자가 되자.

### 요약

배움의 문화를 만드는 것은 관리자나 애자일 코치의 전담 업무가 아니다. 개발자를 포함해서 모두가 해야 할 일이다.
지원이 없더라도 개발자들 스스로 서로 배우고 공유하는 배움의 환경과 문화를 쉽게 만들 수 있다.

## 참조

- [소프트웨어 장인](http://www.yes24.com/Product/Goods/20461940)