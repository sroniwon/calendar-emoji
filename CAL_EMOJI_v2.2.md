# Cal Emoji Auto-Tagger v2.2 — Product Reference

## Overview

**Cal Emoji**는 Google Calendar 일정 제목에 매칭되는 이모지를 자동으로 붙여주는 Chrome Extension입니다. 키워드 기반 매칭으로 작동하며, 서버 없이 100% 오프라인으로 동작합니다.

- **이름**: Calendar Emoji Auto-Tagger (Cal Emoji)
- **버전**: 2.2.0
- **플랫폼**: Chrome Extension (Manifest V3)
- **권한**: `storage` only (최소 권한)
- **대상**: Google Calendar 사용자 (https://calendar.google.com)
- **언어**: 한국어 / English

---

## Core Features

### 1. 자동 이모지 태깅
- 일정 제목 입력 후 blur, Enter, 저장 버튼 클릭 시 자동으로 이모지가 앞에 추가됨
- 이미 이모지로 시작하는 제목은 중복 적용 안 됨
- 매칭되는 이모지가 여러 개일 경우 **랜덤 선택**

### 2. 내장 이모지 규칙
- **121개 규칙**, **23개 카테고리**
- 각 규칙에 1~4개 이모지 + 5~15개 이상의 키워드
- 한국어/영어 키워드 모두 지원

| 카테고리 | 규칙 수 | 예시 키워드 |
|----------|---------|-------------|
| 회의 / Meeting | 6 | 회의, meeting, zoom, 1:1 |
| 운동 / Exercise | 18 | 운동, gym, 요가, 러닝 |
| 식사 / Food | 14 | 점심, 커피, lunch, dinner |
| 업무 / Work | 18 | 보고서, 마감, deadline |
| 경축 / Celebrations | 10 | 생일, 기념일, birthday |
| 여행 / Travel | 8 | 여행, 출장, flight |
| 의료 / Medical | 8 | 병원, 치과, hospital |
| 취미 / Hobby | 12 | 영화, 게임, 독서 |
| ... 외 15개 카테고리 | | |

### 3. 커스텀 이모지 규칙
- 사용자가 직접 키워드 + 이모지를 등록 가능
- **내장 규칙보다 우선 적용**됨
- 같은 키워드에 여러 이모지 추가 가능 → 랜덤 선택
- 이모지 피커 내장 (9개 탭, 800+ 이모지)
- 추가/삭제 시 열려있는 캘린더 탭에 즉시 동기화

### 4. 7가지 테마
| 테마 | 아이콘 | 배경 | 액센트 | 분위기 |
|------|--------|------|--------|--------|
| Default | ☁️ | 흰색 `#F5F5F5` | Google 블루 `#4285F4` | 기본/클린 |
| Forest | 🌲 | 진한 초록 `#2F6B3F` | 골드 `#F7C85C` | 자연/따뜻 |
| Midnight | 🌙 | 깊은 남색 `#141432` | 달빛 골드 `#F4D03F` | 밤하늘 |
| Ocean | 🌊 | 하늘색 `#BBE1FA` | 네이비 `#0F4C75` | 밝은 바다 |
| Lavender | 🪻 | 베이지 `#F2EAE0` | 라벤더 `#9B8EC7` | 파스텔 |
| Sunset | 🌅 | 밝은 노랑 `#F7FD04` | 오렌지 레드 `#FC5404` | 노을 |
| Peach | 🍑 | 크림 `#FFF5E4` | 코랄 `#FF9494` | 밝은 파스텔 |

- CSS 변수 기반으로 12개 색상 속성을 동적으로 전환
- 선택한 테마는 `chrome.storage.sync`에 저장 (기기간 동기화)

### 5. 다국어 지원 (i18n)
- **한국어 (KO)** / **English (EN)** 전환 가능
- 헤더의 언어 버튼 한 번 클릭으로 토글
- 카테고리 목록도 현재 언어의 키워드만 필터링하여 표시
- 캘린더 내 제목 input 감지: 한/영/일/스/불/독 6개 언어 지원

### 6. 통계
- 이모지가 적용될 때마다 카운트 증가
- 팝업 헤더 배지에 "N회 적용" / "N applied" 표시
- `chrome.storage.sync`에 저장되어 기기간 동기화

---

## Technical Architecture

### 파일 구조
```
extension/
├── manifest.json          # MV3 매니페스트
├── background.js          # Service Worker (설치 초기화, 메시지 핸들링)
├── content.js             # Content Script (캘린더 DOM 감지 + 이모지 적용)
├── emoji-map.js           # 키워드→이모지 매핑 엔진
├── popup.html             # 팝업 UI (HTML + CSS)
├── popup.js               # 팝업 로직 (테마, i18n, 커스텀규칙, 피커)
├── style.css              # Toast 알림 스타일 (캘린더 페이지에 주입)
├── icon16.png             # 아이콘 16x16
├── icon32.png             # 아이콘 32x32
├── icon48.png             # 아이콘 48x48
└── icon128.png            # 아이콘 128x128
```

### 핵심 동작 흐름
```
사용자가 캘린더에서 일정 제목 입력
    ↓
blur / Enter / 저장버튼 감지 (content.js)
    ↓
findEmojiForTitle(title, customRules)
    ↓ 1순위: 커스텀 규칙 검색
    ↓ 2순위: 내장 EMOJI_RULES 검색
    ↓
매칭된 이모지를 제목 앞에 추가
    ↓
Toast 알림 표시 + 카운트 증가
```

### Google Calendar 호환성
- **Closure Library 대응**: `document.execCommand("insertText")` 사용하여 trusted event 생성
- **MutationObserver**: 동적 다이얼로그 감지 (이벤트 생성/편집 팝업)
- **WeakSet**: 중복 이벤트 리스너 방지
- **3단계 title input 탐색**: aria-label → placeholder → data-placeholder

### 데이터 저장 (chrome.storage.sync)
| 키 | 타입 | 설명 |
|----|------|------|
| `enabled` | boolean | 자동 이모지 On/Off |
| `emojiCount` | number | 누적 적용 횟수 |
| `lang` | string | UI 언어 ("ko" / "en") |
| `customRules` | array | 커스텀 규칙 목록 |
| `theme` | string | 선택된 테마 키 |
| `installDate` | number | 설치 타임스탬프 |

---

## Chrome Web Store 정보

### 스토어 등록 요구사항
- [x] manifest.json 완성 (MV3)
- [x] 아이콘 4사이즈 (16/32/48/128)
- [x] 최소 권한 (storage only)
- [x] console.log 제거
- [x] innerHTML XSS 수정 (createElement 사용)
- [ ] Privacy Policy 웹페이지
- [ ] 스크린샷 (1280x800 또는 640x400, 최소 1장)
- [ ] 프로모션 이미지 (440x280)
- [ ] 상세 설명 (Web Store 등록용)

### 스토어 설명 (초안)

**짧은 설명 (132자 이내):**
> Google Calendar 일정 제목에 연관 이모지를 자동으로 달아줍니다.

**긴 설명:**
> Cal Emoji는 Google Calendar 일정 제목을 분석하여 가장 어울리는 이모지를 자동으로 추가하는 Chrome 확장 프로그램입니다.
>
> - 121개 내장 규칙, 23개 카테고리 지원
> - 나만의 커스텀 이모지 규칙 등록
> - 7가지 테마 (다크, 라이트, 파스텔 등)
> - 한국어/English 지원
> - 서버 불필요, 100% 오프라인 동작
> - 개인정보 수집 없음

---

## 마케팅 포인트

### 타겟 유저
- Google Calendar 헤비 유저
- 일정 정리를 시각적으로 하고 싶은 사람
- 생산성 도구 좋아하는 사람

### USP (Unique Selling Point)
1. **제로 설정** — 설치하면 바로 동작
2. **오프라인** — 서버 없이 즉시 매칭
3. **커스터마이징** — 나만의 규칙 + 7가지 테마
4. **프라이버시** — 데이터 수집 없음, storage 권한만 사용

### 경쟁 장점
- 대부분의 캘린더 이모지 도구는 수동 → Cal Emoji는 **자동**
- 커스텀 규칙 + 랜덤 이모지로 개인화 가능
- 무료, 광고 없음

---

## Version History

### v2.2.0 (Current)
- 7가지 테마 시스템 (CSS 변수 기반)
- 커스텀 이모지 규칙 (다중 이모지, 이모지 피커)
- 팝업 UI 전면 리디자인
- 카테고리 목록 언어별 필터링
- 커스텀 규칙 저장 시 캘린더 탭 자동 동기화
- 에러 핸들링 강화
- console.log 제거, innerHTML XSS 수정

### v2.1.0
- 이모지 랜덤 선택 (배열 지원)
- 한/영 i18n 지원
- 통계 카운트
- 기본 다크 테마

### v2.0.0
- 초기 릴리즈
- 키워드 매칭 기반 이모지 자동 추가
- Google Calendar content script
