# 올챙이 — DevLog

[![Deploy site to Pages](https://github.com/hongmoSung/hongmoSung.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/hongmoSung/hongmoSung.github.io/actions/workflows/pages.yml)

백엔드 개발 기록을 남기는 개인 블로그입니다. Java, Spring, 데이터베이스, OOP, 기술서적 리뷰를 주로 다룹니다.

**https://hongmosung.github.io**

## 스택

| | |
|---|---|
| 정적 사이트 생성기 | Jekyll 4.4 (kramdown + Rouge 4, Dart Sass) |
| 테마 | [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) 4.28.1 — 이 리포에 vendoring |
| 배포 | GitHub Actions (`.github/workflows/pages.yml`) |
| 댓글 | [utterances](https://utteranc.es/) (GitHub Issues) |
| 검색 | lunr |

`Gemfile.lock` 을 커밋해 두고 `dependabot` 이 액션·젬 업데이트를 월간 PR 로 올립니다.

## 로컬 실행

```shell
# 의존성 설치 (clone 직후, Gemfile 변경 후 필수)
bundle install

# 개발 서버 (http://localhost:4000)
bundle exec jekyll serve

# 빌드 캐시 정리
bundle exec jekyll clean
```

댓글은 `jekyll.environment` 가 `production` 일 때만 렌더되므로 로컬 `serve` 에서는 보이지 않습니다.

## 글 쓰기

`_posts/<카테고리>/YYYY-MM-DD-<제목>.md` 로 만듭니다. 파일명의 날짜는 **zero-padding** 하고 front matter 의 `date` 와 일치시켜 주세요 (front matter 가 우선합니다).

```yaml
---
title: "글 제목"
categories:
  - java
tags:
  - tag1
toc: true          # 선택
---
```

본문 이미지는 `/assets/images/...` 처럼 **루트 절대경로**로 씁니다.

## 배포

`master` 에 push 하면 GitHub Actions 가 빌드해서 Pages 로 배포합니다. Pages 의 `build_type` 은 `workflow` 이며, 클래식 브랜치 빌드는 쓰지 않습니다.

빌드·배포 상세, 테마 업그레이드 절차, 커스터마이즈된 테마 파일 목록은 [`CLAUDE.md`](CLAUDE.md) 에 정리되어 있습니다.

## 라이선스

테마는 [mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes) 의 fork 이며 MIT 라이선스를 따릅니다 ([`LICENSE`](LICENSE)). 글과 이미지의 저작권은 작성자에게 있습니다.
