# Privacy Policy — Calendar Emoji Auto-Tagger

**Last updated:** May 14, 2026
**Version:** 2.2

---

## 요약 (TL;DR)

이 확장 프로그램은 사용자 개인정보나 일정 내용을 **외부 서버로 전송하지 않습니다**. 모든 작업은 브라우저 안에서만 이루어집니다.

> **Summary (English):** This extension does not collect, transmit, or share any personal information or calendar data. Everything runs locally in your browser.

---

## 1. 수집하는 정보 / Information We Collect

**없음 (None).** 본 확장 프로그램은 다음 데이터를 **수집하거나 외부로 전송하지 않습니다**:

- 이름, 이메일, 사용자 ID 등 개인 식별 정보
- Google 계정 정보 또는 인증 토큰
- 캘린더 일정의 제목, 설명, 참석자, 시간 등 내용
- IP 주소, 브라우저 핑거프린팅, 위치 정보
- 분석 데이터, 광고 식별자, 쿠키

---

## 2. 로컬에 저장되는 항목 / Data Stored Locally

다음 사용자 설정만 Chrome의 `chrome.storage.sync` API를 통해 사용자 본인의 Google 계정에 동기화 저장됩니다. 이 데이터는 **개발자나 제3자에게 전송되지 않으며**, Google이 사용자의 브라우저 간 동기화를 위해서만 사용합니다.

| 항목 | 설명 |
|---|---|
| Toggle 상태 | 자동 이모지 기능 ON/OFF |
| 언어 설정 | 한국어/영어 표시 언어 |
| 테마 설정 | UI 색상 테마 선택값 |
| 커스텀 규칙 | 사용자가 직접 추가한 [이모지 + 키워드] 매칭 규칙 |
| 적용 카운트 | 이모지가 자동 적용된 누적 횟수 (숫자 1개) |

---

## 3. 캘린더 데이터를 어떻게 처리하나요 / How We Handle Calendar Data

확장 프로그램은 사용자가 `calendar.google.com`에서 일정 제목을 입력할 때, 입력창에 입력된 텍스트를 **브라우저 메모리 내에서만** 읽어 키워드 매칭을 수행합니다. 매칭된 이모지는 같은 입력창에 추가됩니다.

- 일정 내용은 **외부 서버로 전송되지 않습니다.**
- 처리는 **로컬 키워드 매칭 (offline)** 방식으로만 이루어집니다.
- 일정 내용은 어디에도 **저장·기록되지 않습니다** (휘발성).

---

## 4. 권한 사용 목적 / Permissions Justification

| 권한 | 사용 목적 |
|---|---|
| `storage` | 사용자 설정(토글, 언어, 테마, 커스텀 규칙)을 저장하기 위함 |
| `host: calendar.google.com` | Google Calendar 페이지의 일정 제목 입력창에 이모지를 자동으로 삽입하기 위함 |

---

## 5. 제3자 공유 / Third-Party Sharing

**없음 (None).** 본 확장 프로그램은 제3자 서비스, 분석 도구, 광고 네트워크, 외부 API를 사용하지 않습니다.

---

## 6. 어린이 개인정보 / Children's Privacy

본 확장 프로그램은 13세 미만 어린이로부터 어떠한 개인정보도 의도적으로 수집하지 않습니다. (수집하는 정보 자체가 없음)

---

## 7. 정책 변경 / Changes to This Policy

향후 정책에 중요한 변경이 있을 경우 본 페이지 상단의 "Last updated" 날짜가 갱신되며, 변경 사항은 확장 프로그램 업데이트와 함께 안내됩니다. AI 기반 기능이 추가될 경우(예: Anthropic API 연동), 본 정책은 그에 맞춰 사전 공지 후 업데이트됩니다.

---

## 8. 문의 / Contact

본 정책에 대한 질문이나 문의는 다음 이메일로 연락해 주세요:

**jwhwang@jupiterleto.com**

---

*Calendar Emoji Auto-Tagger · v2.2 · Offline · No server · No tracking*
*© 2026 Jupiter Leto. All rights reserved.*
