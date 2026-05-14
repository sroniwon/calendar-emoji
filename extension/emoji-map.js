// emoji-map.js — 키워드 → 이모지 매핑 (랜덤 선택, 백엔드 없이 즉시 동작)

const EMOJI_RULES = [
  // ══════════════════════════════════════════════════════════════
  // ── 회의 / Meeting ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🤝", "🗓️", "👔", "📍"], keywords: ["회의", "미팅", "meeting", "mtg", "sync", "standup", "스탠드업", "retro", "회의실", "협의", "논의", "상의", "간담회", "조회", "브리핑", "briefing", "huddle", "catchup", "catch-up", "all-hands", "올핸즈", "townhall", "타운홀", "정기회의", "주간회의", "월간회의", "팀미팅", "그룹미팅"] },
  { emoji: ["👥", "🫂", "💬"], keywords: ["1:1", "1on1", "면담", "상담", "one on one", "면접", "interview", "인터뷰", "원온원", "일대일"] },
  { emoji: ["📞", "☎️", "📲"], keywords: ["전화", "콜", "call", "phone", "통화", "전화상담", "유선"] },
  { emoji: ["💻", "🖥️", "📹"], keywords: ["zoom", "teams", "화상", "video call", "온라인 미팅", "google meet", "webex", "webinar", "웨비나", "skype", "slack", "디스코드", "discord", "화상회의", "원격회의", "리모트"] },
  { emoji: ["🗣️", "💭", "🎙️"], keywords: ["토론", "debate", "discussion", "패널", "panel", "포럼", "forum", "라운드테이블", "roundtable", "의견교환"] },
  { emoji: ["📢", "🔔", "📣"], keywords: ["공지", "announcement", "notice", "안내", "전달사항", "알림"] },

  // ══════════════════════════════════════════════════════════════
  // ── 운동 / Exercise ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["💪", "🏃", "🔥", "⚡"], keywords: ["운동", "workout", "exercise", "헬스", "fitness", "트레이닝", "training", "체육", "체력", "gym", "짐"] },
  { emoji: ["🏋️", "💪", "🔥"], keywords: ["웨이트", "weight", "크로스핏", "crossfit", "데드리프트", "스쿼트", "벤치프레스"] },
  { emoji: ["🧘", "🧘‍♀️", "🕊️", "☮️"], keywords: ["요가", "yoga", "필라테스", "pilates", "스트레칭", "stretching", "명상", "meditation", "마인드풀니스", "mindfulness"] },
  { emoji: ["🏃", "🏃‍♀️", "👟", "🏅"], keywords: ["러닝", "running", "조깅", "jogging", "마라톤", "marathon", "달리기", "런닝", "트레일러닝"] },
  { emoji: ["🏊", "🏊‍♀️", "🤽", "💦"], keywords: ["수영", "swimming", "swim", "수영장", "아쿠아", "aqua", "물놀이"] },
  { emoji: ["⚽", "🥅", "🏟️"], keywords: ["축구", "soccer", "football", "풋살", "futsal"] },
  { emoji: ["🏀", "⛹️"], keywords: ["농구", "basketball"] },
  { emoji: ["⚾", "🥎"], keywords: ["야구", "baseball", "캐치볼"] },
  { emoji: ["🏐"], keywords: ["배구", "volleyball"] },
  { emoji: ["🎾", "🏸"], keywords: ["테니스", "tennis", "배드민턴", "badminton", "스쿼시", "squash", "탁구", "pingpong", "라켓"] },
  { emoji: ["⛳", "🏌️", "🏌️‍♂️"], keywords: ["골프", "golf", "스크린골프", "골프연습장", "골프장", "라운딩"] },
  { emoji: ["🚴", "🚴‍♀️", "🚲"], keywords: ["자전거", "cycling", "bike", "라이딩", "riding", "따릉이", "mtb"] },
  { emoji: ["🥊", "🥋", "👊"], keywords: ["복싱", "boxing", "격투기", "mma", "주짓수", "무에타이", "킥복싱", "태권도", "유도", "검도", "합기도", "무술", "martial"] },
  { emoji: ["🧗", "🧗‍♀️", "🪨"], keywords: ["클라이밍", "climbing", "볼더링", "bouldering", "암벽"] },
  { emoji: ["🏂", "⛷️", "🎿"], keywords: ["스노보드", "snowboard", "스키", "ski", "보드", "슬로프"] },
  { emoji: ["🏄", "🏄‍♀️", "🌊"], keywords: ["서핑", "surfing", "surf", "웨이크보드", "wakeboard", "카약", "kayak", "래프팅", "rafting", "수상스키"] },
  { emoji: ["🥾", "🏔️", "⛰️", "🌿"], keywords: ["등산", "hiking", "hike", "산행", "트레킹", "trekking", "산책", "walk", "walking", "둘레길", "올레길"] },
  { emoji: ["💃", "🕺", "👯"], keywords: ["댄스", "dance", "dancing", "춤", "발레", "ballet", "살사", "salsa", "힙합", "방송댄스", "왈츠", "탱고"] },
  { emoji: ["🤸", "🤸‍♀️"], keywords: ["체조", "gymnastics", "에어로빅", "aerobics", "줌바", "zumba"] },
  { emoji: ["🏇", "🐴"], keywords: ["승마", "horse riding", "horseback", "말타기"] },
  { emoji: ["🎳"], keywords: ["볼링", "bowling"] },
  { emoji: ["🛹", "⛸️"], keywords: ["스케이트", "skating", "롤러", "roller", "인라인"] },

  // ══════════════════════════════════════════════════════════════
  // ── 식사 / Food & Drink ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🍽️", "🥗", "🍲", "🥘", "🍱"], keywords: ["점심", "식사", "lunch", "밥", "외식", "맛집", "식당", "레스토랑", "restaurant", "뷔페", "buffet", "점심식사"] },
  { emoji: ["🍽️", "🥂", "🌙", "🍷"], keywords: ["저녁", "dinner", "디너", "만찬", "저녁식사", "회식"] },
  { emoji: ["🌅", "🥞", "🍳", "☀️"], keywords: ["아침", "조식", "breakfast", "모닝", "아침식사", "조찬"] },
  { emoji: ["☕", "🫖", "🍵"], keywords: ["커피", "coffee", "카페", "cafe", "tea", "차 한잔", "티타임", "스타벅스", "starbucks", "라떼", "아메리카노", "차한잔"] },
  { emoji: ["🍺", "🍻", "🥃"], keywords: ["술", "맥주", "beer", "소주", "drinking", "한잔", "술자리", "뒤풀이", "이차", "2차", "삼차", "3차", "호프", "펍", "pub", "bar", "바", "포차", "이자카야"] },
  { emoji: ["🍷", "🥂", "🫗"], keywords: ["와인", "wine", "와인바", "와인모임", "와인파티"] },
  { emoji: ["🥂", "🍾", "🥂"], keywords: ["브런치", "brunch", "샴페인", "champagne", "건배", "toast"] },
  { emoji: ["🍰", "🧁", "🎂", "🍩"], keywords: ["디저트", "dessert", "케이크", "cake", "베이킹", "baking", "빵", "bread", "제과", "파티시에", "마카롱", "쿠키"] },
  { emoji: ["🍜", "🍝", "🍲"], keywords: ["라면", "ramen", "면", "noodle", "국수", "우동", "파스타", "pasta", "쌀국수"] },
  { emoji: ["🍕", "🍔", "🍟"], keywords: ["피자", "pizza", "치킨", "chicken", "버거", "burger", "패스트푸드", "fast food", "햄버거"] },
  { emoji: ["🍣", "🐟", "🍙"], keywords: ["초밥", "sushi", "회", "sashimi", "일식", "오마카세", "omakase"] },
  { emoji: ["🥘", "🍖", "🥩"], keywords: ["한식", "korean", "찌개", "탕", "갈비", "삼겹살", "bbq", "고기", "구이", "불고기"] },
  { emoji: ["🌮", "🌯"], keywords: ["멕시칸", "mexican", "타코", "taco", "부리또", "burrito"] },
  { emoji: ["🍛", "🥡", "🥟"], keywords: ["카레", "curry", "인도", "indian", "태국", "thai", "중식", "중국집", "짜장", "짬뽕"] },

  // ══════════════════════════════════════════════════════════════
  // ── 업무 / Work ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["⏰", "⏳", "🔴", "🚨"], keywords: ["마감", "deadline", "due", "d-day", "디데이", "납기", "제출", "submission", "기한", "만기"] },
  { emoji: ["🎤", "📊", "🎯", "🗣️"], keywords: ["발표", "presentation", "프레젠테이션", "세미나", "seminar", "강연", "lecture", "컨퍼런스", "conference", "keynote", "키노트", "스피치", "speech", "demo", "데모", "시연"] },
  { emoji: ["📝", "📋", "✅"], keywords: ["보고", "report", "리뷰", "review", "피드백", "feedback", "평가", "assessment", "주간보고", "월간보고", "일일보고", "성과", "performance"] },
  { emoji: ["🚀", "🎉", "🛫"], keywords: ["출시", "launch", "릴리즈", "release", "배포", "deploy", "오픈", "go-live", "런칭", "론칭"] },
  { emoji: ["📊", "📈", "📉"], keywords: ["분석", "analytics", "데이터", "data", "통계", "대시보드", "dashboard", "지표", "metrics", "kpi", "okr", "roi"] },
  { emoji: ["💼", "🧳", "✈️"], keywords: ["출장", "business trip", "외근", "방문", "visit", "출근", "미출근", "재택", "remote", "wfh", "work from home", "워케이션", "workation"] },
  { emoji: ["📋", "🗺️", "📌"], keywords: ["계획", "plan", "planning", "기획", "브레인스토밍", "brainstorm", "전략", "strategy", "로드맵", "roadmap", "스프린트", "sprint", "어젠다", "agenda", "backlog", "백로그"] },
  { emoji: ["✍️", "📝", "📄"], keywords: ["작성", "writing", "글쓰기", "블로그", "blog", "문서", "document", "docs", "기안", "초안", "draft", "원고", "매뉴얼", "manual", "가이드", "guide"] },
  { emoji: ["🔧", "🛠️", "⚙️"], keywords: ["수리", "repair", "fix", "정비", "maintenance", "점검", "수선", "as", "a/s"] },
  { emoji: ["👨‍💻", "👩‍💻", "💻", "⌨️"], keywords: ["코딩", "coding", "개발", "development", "dev", "프로그래밍", "programming", "hackathon", "해커톤", "코드리뷰", "code review", "pr", "pull request", "merge", "git", "ci/cd"] },
  { emoji: ["🧪", "🐛", "🔍"], keywords: ["테스트", "testing", "qa", "디버그", "debug", "버그", "bug", "이슈", "issue", "qc"] },
  { emoji: ["📐", "🎨", "✏️"], keywords: ["디자인", "design", "figma", "ui", "ux", "프로토타입", "prototype", "와이어프레임", "wireframe", "목업", "mockup"] },
  { emoji: ["🤖", "🧠", "⚡"], keywords: ["ai", "인공지능", "머신러닝", "machine learning", "gpt", "챗봇", "chatbot", "자동화", "automation", "rpa"] },
  { emoji: ["📧", "✉️", "📨"], keywords: ["이메일", "email", "메일", "mail", "뉴스레터", "newsletter"] },
  { emoji: ["🖨️", "📃"], keywords: ["인쇄", "print", "printing", "출력", "프린트", "복사", "copy"] },
  { emoji: ["📎", "🗂️", "📁"], keywords: ["정리", "organize", "파일", "file", "폴더", "folder", "아카이브", "archive", "백업", "backup"] },
  { emoji: ["💬", "🗨️", "📱"], keywords: ["채팅", "chat", "메시지", "message", "dm", "문의", "inquiry", "응대", "cs", "고객지원", "support"] },
  { emoji: ["🎯", "✅", "☑️"], keywords: ["목표", "goal", "target", "할일", "todo", "to-do", "task", "태스크", "체크리스트", "checklist", "action item"] },
  { emoji: ["📌", "❗", "🔺"], keywords: ["중요", "important", "urgent", "긴급", "필수", "priority", "우선순위", "핵심", "주요"] },
  { emoji: ["🔄", "♻️", "🔃"], keywords: ["업데이트", "update", "갱신", "변경", "change", "수정", "modify", "마이그레이션", "migration"] },
  { emoji: ["👔", "🏢", "💼"], keywords: ["오피스", "office", "사무실", "근무", "work", "업무", "워크", "비즈니스", "business"] },

  // ══════════════════════════════════════════════════════════════
  // ── 비즈니스 / Business ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🤝", "🫱🏻‍🫲🏽", "💼"], keywords: ["협업", "collaboration", "파트너십", "partnership", "제휴", "mou", "계약체결"] },
  { emoji: ["📈", "💹", "🚀"], keywords: ["매출", "revenue", "sales", "영업", "수익", "이익", "profit", "성장", "growth", "실적"] },
  { emoji: ["💵", "💳", "🧾"], keywords: ["결제", "payment", "정산", "settlement", "청구", "invoice", "인보이스", "billing", "견적", "quote", "quotation", "estimate"] },
  { emoji: ["🏗️", "📐", "🚧"], keywords: ["프로젝트", "project", "proj", "pj", "착수", "kickoff", "킥오프", "착공", "준공", "완공"] },
  { emoji: ["📑", "🖊️", "📜"], keywords: ["계약", "contract", "nda", "sla", "약관", "terms", "합의서", "agreement", "서명", "sign", "날인", "체결"] },
  { emoji: ["👥", "🧑‍🤝‍🧑", "🆕"], keywords: ["온보딩", "onboarding", "오프보딩", "offboarding", "입사", "퇴사", "채용", "hiring", "recruit", "리크루팅"] },
  { emoji: ["🏆", "🥇", "🎖️"], keywords: ["시상", "award", "수상", "표창", "우수", "어워드", "인센티브", "incentive", "보너스", "bonus"] },
  { emoji: ["📣", "📢", "🎯"], keywords: ["마케팅", "marketing", "홍보", "pr", "광고", "ad", "advertising", "프로모션", "promotion", "캠페인", "campaign"] },
  { emoji: ["🎪", "🎊", "🏟️"], keywords: ["이벤트", "event", "행사", "전시회", "expo", "박람회", "fair", "부스", "booth", "오프사이트", "offsite"] },

  // ══════════════════════════════════════════════════════════════
  // ── 재무 / Finance & Tax ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🏦", "💰", "🏧"], keywords: ["은행", "bank", "banking", "금융", "대출", "loan", "모기지", "mortgage", "이자", "interest", "예금", "deposit", "적금", "savings"] },
  { emoji: ["💰", "📈", "💎"], keywords: ["투자", "invest", "주식", "stock", "재테크", "finance", "펀드", "fund", "crypto", "코인", "비트코인", "bitcoin", "etf", "ipo", "배당", "dividend", "포트폴리오", "portfolio"] },
  { emoji: ["📄", "🧾", "💰"], keywords: ["세금", "tax", "보험", "insurance", "서류", "신고", "vat", "부가세", "부가가치세", "소득세", "income tax", "법인세", "corporate tax", "원천징수", "withholding", "연말정산", "세무", "세무사", "회계", "accounting", "회계사", "감사", "audit", "재무제표", "financial statement", "장부", "bookkeeping"] },
  { emoji: ["💳", "🏧"], keywords: ["카드", "card", "신용카드", "credit card", "체크카드", "debit", "할부", "installment"] },
  { emoji: ["🧾", "💸", "📊"], keywords: ["영수증", "receipt", "경비", "expense", "비용", "cost", "환급", "refund", "환불", "지출", "예산", "budget"] },

  // ══════════════════════════════════════════════════════════════
  // ── 공부 / Study & Education ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["📚", "📖", "📗", "🧠"], keywords: ["공부", "study", "스터디", "학습", "learning", "독서", "reading", "책", "book", "도서관", "library", "자습", "복습", "예습"] },
  { emoji: ["🎓", "🏫", "📝"], keywords: ["졸업", "graduation", "입학", "학교", "school", "수업", "class", "강의", "과외", "학원", "academy", "등교", "하교", "학기", "semester", "방학"] },
  { emoji: ["💡", "🧩", "🎯"], keywords: ["워크숍", "workshop", "교육", "세션", "session", "부트캠프", "bootcamp", "특강", "집중교육", "오리엔테이션", "orientation"] },
  { emoji: ["🔬", "🧬", "🔭"], keywords: ["연구", "research", "실험", "experiment", "lab", "논문", "paper", "thesis", "학회", "journal", "발간", "출판", "publish"] },
  { emoji: ["🌐", "🗺️", "💬"], keywords: ["영어", "english", "언어", "language", "일본어", "japanese", "중국어", "chinese", "어학", "토익", "toeic", "토플", "toefl", "ielts", "회화", "conversation", "통역", "번역", "translation", "스페인어", "프랑스어", "독일어", "한국어"] },
  { emoji: ["📖", "✏️", "📝"], keywords: ["시험", "exam", "자격증", "certification", "자격시험", "중간고사", "기말고사", "모의고사", "수능", "csat", "고시", "공무원시험", "필기", "실기", "면허"] },
  { emoji: ["✏️", "📓", "📝"], keywords: ["숙제", "homework", "과제", "assignment", "리포트", "레포트", "에세이", "essay"] },

  // ══════════════════════════════════════════════════════════════
  // ── 여행 / Travel ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["✈️", "🛫", "🌍", "🧳"], keywords: ["여행", "travel", "flight", "비행", "공항", "airport", "해외", "탑승", "출국", "입국", "항공", "비행기", "체크인", "check-in", "boarding", "국내여행", "해외여행", "trip"] },
  { emoji: ["🏖️", "🌴", "☀️", "🏝️"], keywords: ["휴가", "vacation", "holiday", "바캉스", "리조트", "resort", "바다", "beach", "해변", "풀빌라", "호캉스", "staycation"] },
  { emoji: ["🚗", "🚙", "🛣️"], keywords: ["드라이브", "drive", "운전", "car", "렌트카", "rental", "로드트립", "road trip", "카풀", "carpool"] },
  { emoji: ["🏕️", "⛺", "🌲"], keywords: ["캠핑", "camping", "글램핑", "glamping", "야영", "텐트", "tent", "캠프파이어", "차박"] },
  { emoji: ["🚂", "🚄", "🛤️"], keywords: ["기차", "train", "ktx", "srt", "열차", "무궁화", "새마을", "itx", "지하철", "subway", "metro"] },
  { emoji: ["🚢", "⛵", "🛳️"], keywords: ["크루즈", "cruise", "ferry", "페리", "요트", "yacht", "보트", "boat"] },
  { emoji: ["🏨", "🛏️", "🏩"], keywords: ["호텔", "hotel", "숙소", "accommodation", "에어비앤비", "airbnb", "게스트하우스", "guesthouse", "모텔", "펜션", "pension", "민박"] },
  { emoji: ["🗺️", "📸", "🎒"], keywords: ["관광", "sightseeing", "tour", "투어", "가이드", "guide", "명소", "landmark"] },

  // ══════════════════════════════════════════════════════════════
  // ── 의료 / Medical ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🏥", "🩺", "👨‍⚕️"], keywords: ["병원", "hospital", "의원", "clinic", "진료", "진찰", "doctor", "내과", "외과", "검진", "건강검진", "종합검진", "의사", "진단", "수술", "surgery", "입원", "퇴원", "응급", "emergency", "이비인후과", "피부과", "비뇨기과", "정형외과", "신경과"] },
  { emoji: ["🦷", "😁"], keywords: ["치과", "dentist", "dental", "치아", "스케일링", "임플란트", "implant", "교정", "orthodontic", "충치", "발치", "크라운"] },
  { emoji: ["👁️", "👓"], keywords: ["안과", "eye", "ophthalmology", "시력", "라식", "라섹", "렌즈", "lens", "안경", "glasses"] },
  { emoji: ["💊", "💉", "🩹"], keywords: ["약", "medicine", "pharmacy", "약국", "처방", "prescription", "복약", "건강보조", "supplement", "영양제", "vitamin", "비타민"] },
  { emoji: ["🧠", "💆", "🫂"], keywords: ["심리", "therapy", "상담사", "counseling", "정신과", "심리상담", "정신건강", "mental health", "우울", "스트레스", "stress"] },
  { emoji: ["🤰", "👶", "🍼"], keywords: ["산부인과", "임신", "pregnancy", "산전검사", "초음파", "ultrasound", "출산", "산후", "태교"] },
  { emoji: ["💉", "🩹", "🛡️"], keywords: ["예방접종", "vaccine", "vaccination", "접종", "주사", "독감", "flu", "코로나", "covid", "pcr"] },
  { emoji: ["🦴", "🏥", "💆"], keywords: ["물리치료", "재활", "rehabilitation", "physiotherapy", "정형", "orthopedic", "허리", "어깨", "무릎", "관절", "척추", "spine"] },

  // ══════════════════════════════════════════════════════════════
  // ── 쇼핑 / Shopping ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🛍️", "🛒", "🏬"], keywords: ["쇼핑", "shopping", "장보기", "마트", "mart", "grocery", "코스트코", "costco", "이마트", "홈플러스", "롯데마트", "트레이더스", "백화점", "department store", "아울렛", "outlet", "면세점", "duty free"] },
  { emoji: ["📦", "🚚", "📬"], keywords: ["택배", "delivery", "배송", "shipping", "수령", "픽업", "pickup", "반품", "return", "교환", "exchange", "발송"] },
  { emoji: ["🛒", "💳", "🛍️"], keywords: ["주문", "order", "구매", "purchase", "구입", "결제", "checkout"] },

  // ══════════════════════════════════════════════════════════════
  // ── 경축 / Celebrations ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🎂", "🥳", "🎁", "🎈"], keywords: ["생일", "birthday", "bday", "돌잔치", "생파", "생일파티", "환갑", "칠순", "백일"] },
  { emoji: ["💍", "👰", "🤵", "💒"], keywords: ["결혼", "wedding", "marriage", "약혼", "결혼식", "웨딩", "신혼", "예식", "피로연", "상견례", "맞선", "소개팅", "blind date"] },
  { emoji: ["🎉", "🥳", "🎊", "🎈"], keywords: ["파티", "party", "축하", "celebration", "기념일", "anniversary", "축제", "festival", "페스티벌", "잔치", "환영", "welcome", "송별", "farewell", "goodbye"] },
  { emoji: ["🎄", "🎅", "⛄"], keywords: ["크리스마스", "christmas", "xmas", "산타", "santa", "캐럴"] },
  { emoji: ["🎃", "👻", "🦇"], keywords: ["할로윈", "halloween", "코스튬", "costume"] },
  { emoji: ["🧧", "🎊", "🏮"], keywords: ["설날", "새해", "new year", "추석", "chuseok", "명절", "한가위", "구정", "신정", "세배", "떡국"] },
  { emoji: ["🌸", "🌺", "🌷"], keywords: ["벚꽃", "cherry blossom", "꽃구경", "봄소풍", "나들이"] },
  { emoji: ["💐", "🌹", "🌻"], keywords: ["꽃", "flower", "어버이날", "스승의날", "화환", "부케", "bouquet", "플라워"] },
  { emoji: ["🎆", "🎇", "✨"], keywords: ["불꽃놀이", "fireworks", "카운트다운", "countdown", "송년", "신년"] },
  { emoji: ["🕯️", "🙏"], keywords: ["추모", "memorial", "기일", "제사", "성묘", "차례"] },

  // ══════════════════════════════════════════════════════════════
  // ── 개인 / Personal ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["💇", "💇‍♀️", "✂️"], keywords: ["미용실", "hair", "헤어", "haircut", "salon", "미장원", "파마", "perm", "염색", "컷", "cut", "두피", "탈모"] },
  { emoji: ["💅", "💅🏻", "✨"], keywords: ["네일", "nail", "매니큐어", "manicure", "pedicure", "페디큐어", "젤네일", "네일아트"] },
  { emoji: ["💆", "💆‍♀️", "🧖"], keywords: ["마사지", "massage", "스파", "spa", "사우나", "sauna", "찜질방", "피부관리", "에스테틱", "esthetic"] },
  { emoji: ["🧹", "🧽", "🫧"], keywords: ["청소", "cleaning", "clean", "정리", "세탁", "laundry", "빨래", "다림질", "ironing", "세차", "car wash", "대청소", "분리수거"] },
  { emoji: ["🐶", "🐱", "🐾"], keywords: ["반려동물", "pet", "강아지", "dog", "고양이", "cat", "동물병원", "vet", "산책", "애견", "펫시터", "pet sitter", "미용", "grooming"] },
  { emoji: ["🏠", "🏡", "🔑"], keywords: ["이사", "moving", "집", "home", "부동산", "real estate", "인테리어", "집들이", "housewarming", "입주", "임대", "전세", "월세", "계약갱신", "수리"] },
  { emoji: ["👗", "👔", "👠"], keywords: ["옷", "clothes", "패션", "fashion", "쇼핑몰", "의류", "코디", "outfit", "드레스", "dress", "정장", "suit"] },

  // ══════════════════════════════════════════════════════════════
  // ── 가족 / Family ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["👨‍👩‍👧", "👪", "🏠"], keywords: ["가족", "family", "부모님", "parents", "엄마", "아빠", "mom", "dad", "가족모임", "가족식사", "가족여행", "명절모임"] },
  { emoji: ["👶", "🍼", "🧒"], keywords: ["아이", "baby", "육아", "어린이집", "daycare", "등원", "하원", "유치원", "kindergarten", "초등학교", "참관", "학예회", "운동회", "돌봄", "베이비시터", "babysitter"] },
  { emoji: ["🧓", "👴", "👵"], keywords: ["할머니", "할아버지", "grandma", "grandpa", "조부모", "경로당", "요양", "care"] },
  { emoji: ["❤️", "💕", "💑"], keywords: ["데이트", "date", "연애", "기념일", "valentine", "발렌타인", "화이트데이", "커플", "couple", "애인", "남자친구", "여자친구", "남친", "여친"] },

  // ══════════════════════════════════════════════════════════════
  // ── 취미 / Hobby & Entertainment ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🎬", "🍿", "🎥"], keywords: ["영화", "movie", "cinema", "film", "넷플릭스", "netflix", "극장", "시네마", "왓챠", "watcha", "디즈니", "disney", "상영", "개봉", "시사회", "preview"] },
  { emoji: ["🎵", "🎶", "🎤"], keywords: ["음악", "music", "콘서트", "concert", "공연", "show", "뮤지컬", "musical", "노래", "song", "라이브", "live", "페스티벌", "버스킹", "busking", "합창", "choir", "오케스트라", "orchestra", "오페라", "opera"] },
  { emoji: ["🎮", "🕹️", "👾"], keywords: ["게임", "game", "gaming", "pc방", "플레이", "play", "보드게임", "board game", "닌텐도", "nintendo", "플스", "playstation", "xbox"] },
  { emoji: ["🎨", "🖼️", "🖌️"], keywords: ["그림", "art", "painting", "drawing", "미술", "전시", "exhibition", "갤러리", "gallery", "뮤지엄", "museum", "박물관", "미술관", "작품", "artwork"] },
  { emoji: ["📷", "📸", "🤳"], keywords: ["사진", "photo", "photography", "촬영", "shoot", "앨범", "album", "포토", "셀카", "selfie", "스냅", "snap"] },
  { emoji: ["🎣", "🐟"], keywords: ["낚시", "fishing", "fish", "바다낚시", "민물낚시", "루어", "선상낚시"] },
  { emoji: ["🎹", "🎸", "🥁"], keywords: ["피아노", "piano", "기타", "guitar", "악기", "instrument", "드럼", "drum", "레슨", "lesson", "바이올린", "violin", "첼로", "cello", "우쿨렐레", "ukulele", "연습", "practice"] },
  { emoji: ["📺", "🎥", "📱"], keywords: ["방송", "broadcast", "유튜브", "youtube", "스트리밍", "streaming", "팟캐스트", "podcast", "vlog", "브이로그", "tiktok", "틱톡", "릴스", "reels"] },
  { emoji: ["📕", "📖", "☕"], keywords: ["독서모임", "book club", "북클럽", "독서회", "서점", "bookstore"] },
  { emoji: ["🧶", "🪡", "✂️"], keywords: ["뜨개질", "knitting", "crocheting", "크로셰", "자수", "embroidery", "퀼트", "quilt", "핸드메이드", "handmade", "diy", "공예", "craft"] },
  { emoji: ["🌱", "🌿", "🌻"], keywords: ["원예", "gardening", "정원", "garden", "식물", "plant", "화분", "텃밭", "플랜테리어"] },
  { emoji: ["🍳", "👨‍🍳", "👩‍🍳"], keywords: ["요리", "cooking", "cook", "쿠킹클래스", "cooking class", "레시피", "recipe", "요리교실"] },

  // ══════════════════════════════════════════════════════════════
  // ── 종교 / Religious ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["⛪", "✝️", "🙏"], keywords: ["교회", "church", "예배", "worship", "성당", "미사", "기도", "prayer", "성경", "bible", "찬양", "praise", "선교", "mission", "세례", "baptism", "부활절", "easter", "성탄절"] },
  { emoji: ["🛕", "☸️", "🧘"], keywords: ["절", "temple", "사찰", "법회", "불교", "buddhism", "명상", "참선", "스님"] },
  { emoji: ["🕌", "☪️"], keywords: ["모스크", "mosque", "이슬람", "islam", "라마단", "ramadan"] },

  // ══════════════════════════════════════════════════════════════
  // ── 법률 / Legal ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["⚖️", "🏛️", "📜"], keywords: ["법원", "court", "법률", "legal", "변호사", "lawyer", "attorney", "소송", "lawsuit", "재판", "trial", "조정", "mediation", "중재", "arbitration", "법무", "법적", "판결", "verdict", "공증", "notary"] },
  { emoji: ["👮", "🚔", "🔍"], keywords: ["경찰", "police", "신고", "report", "민원", "complaint", "조사", "investigation"] },
  { emoji: ["📜", "™️", "©️"], keywords: ["특허", "patent", "상표", "trademark", "저작권", "copyright", "지식재산", "ip", "intellectual property", "등록", "registration"] },

  // ══════════════════════════════════════════════════════════════
  // ── 교통 / Transportation ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🚌", "🚍"], keywords: ["버스", "bus", "통근", "commute", "셔틀", "shuttle", "통학"] },
  { emoji: ["🚇", "🚆", "🚉"], keywords: ["지하철", "subway", "metro", "전철", "역", "station"] },
  { emoji: ["🚕", "🚖"], keywords: ["택시", "taxi", "cab", "우버", "uber", "카카오택시", "타다"] },
  { emoji: ["🅿️", "🚗", "🔧"], keywords: ["주차", "parking", "차량", "세차", "정비", "타이어", "tire", "오일", "oil", "차검사", "자동차"] },
  { emoji: ["🛵", "🏍️", "🛴"], keywords: ["오토바이", "motorcycle", "스쿠터", "scooter", "킥보드", "kickboard", "전동킥보드"] },

  // ══════════════════════════════════════════════════════════════
  // ── 행정 / Government & Admin ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🏢", "🏛️", "📋"], keywords: ["관공서", "government", "구청", "시청", "주민센터", "행정", "공공기관", "동사무소", "읍사무소", "면사무소", "출입국", "immigration", "대사관", "embassy", "영사관", "consulate"] },
  { emoji: ["📮", "✉️", "📯"], keywords: ["우체국", "post office", "우편", "등기", "택배접수"] },
  { emoji: ["🪪", "📇", "🛂"], keywords: ["신분증", "id", "주민등록", "여권", "passport", "비자", "visa", "운전면허", "license", "갱신", "renewal", "발급", "재발급"] },
  { emoji: ["🗳️", "🏛️"], keywords: ["투표", "vote", "voting", "선거", "election", "국민투표"] },

  // ══════════════════════════════════════════════════════════════
  // ── IT / Tech ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🖥️", "💻", "⌨️"], keywords: ["컴퓨터", "computer", "pc", "노트북", "laptop", "맥북", "macbook", "셋업", "setup", "설치", "install", "포맷", "format"] },
  { emoji: ["📱", "📲"], keywords: ["핸드폰", "phone", "스마트폰", "smartphone", "아이폰", "iphone", "갤럭시", "galaxy", "기기변경", "기변", "개통"] },
  { emoji: ["🌐", "🔗", "🖥️"], keywords: ["웹사이트", "website", "홈페이지", "homepage", "도메인", "domain", "서버", "server", "호스팅", "hosting", "ssl", "dns"] },
  { emoji: ["🔒", "🛡️", "🔐"], keywords: ["보안", "security", "암호", "encryption", "인증", "authentication", "2fa", "vpn", "방화벽", "firewall"] },
  { emoji: ["☁️", "🌥️"], keywords: ["클라우드", "cloud", "aws", "azure", "gcp", "saas", "iaas"] },
  { emoji: ["📡", "🌐", "📶"], keywords: ["인터넷", "internet", "wifi", "와이파이", "네트워크", "network", "5g", "통신"] },

  // ══════════════════════════════════════════════════════════════
  // ── 날씨 / Weather & Season ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["☀️", "🌤️", "🌞"], keywords: ["날씨", "weather", "맑음", "sunny", "야외", "outdoor", "소풍", "picnic", "피크닉"] },
  { emoji: ["🌧️", "☔", "🌂"], keywords: ["비", "rain", "rainy", "우천", "장마", "태풍", "typhoon", "폭우", "우산"] },
  { emoji: ["❄️", "⛄", "🌨️"], keywords: ["눈", "snow", "겨울", "winter", "한파", "cold", "방한", "동절기"] },
  { emoji: ["🌡️", "☀️", "🥵"], keywords: ["폭염", "heat", "더위", "heatwave", "여름", "summer", "하절기"] },

  // ══════════════════════════════════════════════════════════════
  // ── 감정 / Emotion & Social ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🙏", "💛", "🤗"], keywords: ["감사", "thanks", "thank you", "감사인사", "답례"] },
  { emoji: ["🎊", "🎉", "👏"], keywords: ["환영회", "welcome party", "입사환영", "신입", "신규"] },
  { emoji: ["👋", "🫡", "🥲"], keywords: ["송별회", "farewell party", "이별", "전출", "전보", "이동"] },

  // ══════════════════════════════════════════════════════════════
  // ── 봉사 / Volunteer ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["🎗️", "🤲", "💚"], keywords: ["봉사", "volunteer", "volunteering", "봉사활동", "기부", "donation", "자선", "charity", "헌혈", "blood donation", "나눔", "후원", "sponsor"] },

  // ══════════════════════════════════════════════════════════════
  // ── 기타 / Other ──
  // ══════════════════════════════════════════════════════════════
  { emoji: ["💤", "😴", "🛌"], keywords: ["휴식", "rest", "쉬는날", "off", "day off", "연차", "휴무", "안식", "반차", "반일", "half day", "휴일", "공휴일"] },
  { emoji: ["🔑", "🔐", "🗝️"], keywords: ["열쇠", "key", "비밀번호", "password", "잠금", "lock", "보관함", "locker"] },
  { emoji: ["🎁", "🎀", "🧧"], keywords: ["선물", "gift", "present", "기프트", "선물준비", "포장", "wrapping"] },
  { emoji: ["💌", "✉️", "📨"], keywords: ["편지", "letter", "카드", "card", "초대", "invitation", "초대장", "rsvp"] },
  { emoji: ["🌍", "🌎", "🌏"], keywords: ["해외", "abroad", "국제", "international", "글로벌", "global", "외국"] },
  { emoji: ["⭐", "✨", "💫"], keywords: ["특별", "special", "스페셜", "vip", "프리미엄", "premium", "럭셔리", "luxury"] },
  { emoji: ["📅", "🗓️", "📆"], keywords: ["일정", "schedule", "캘린더", "calendar", "예약", "reservation", "booking", "예약확인", "확정", "confirm"] },
  { emoji: ["⚡", "🔥", "💨"], keywords: ["번개", "lightning", "급", "asap", "즉시", "immediately", "당장", "번개모임"] },
  { emoji: ["🔔", "⏰", "📌"], keywords: ["리마인더", "reminder", "알림", "notification", "알람", "alarm", "메모", "memo", "note"] },
  { emoji: ["🚨", "🆘", "⚠️"], keywords: ["비상", "emergency", "긴급", "urgent", "위급", "critical", "장애", "outage", "incident", "인시던트"] },
  { emoji: ["♻️", "🌿", "🌍"], keywords: ["환경", "environment", "에코", "eco", "재활용", "recycle", "친환경", "지속가능", "sustainability"] },
  { emoji: ["🎶", "🎤", "🎵"], keywords: ["노래방", "karaoke", "ktv", "코인노래방"] },
  { emoji: ["🎲", "🧩", "🎰"], keywords: ["보드게임카페", "방탈출", "escape room", "vr", "오락", "amusement", "놀이공원", "theme park", "워터파크", "water park"] },
];

/**
 * 제목에서 가장 적합한 이모지를 찾고, 배열에서 랜덤으로 선택합니다.
 * 커스텀 규칙이 있으면 내장 규칙보다 우선 검색합니다.
 * @param {string} title - 일정 제목
 * @param {Array} [customRules] - 사용자 정의 규칙 [{ emojis: ["😍","💖"], keyword: "다솜" }, ...]
 * @returns {string|null} 이모지 또는 null
 */
function findEmojiForTitle(title, customRules) {
  if (!title) return null;
  var lower = title.toLowerCase().trim();

  // ── 1) 커스텀 규칙 우선 검색 ──
  if (customRules && customRules.length > 0) {
    for (var c = 0; c < customRules.length; c++) {
      if (lower.includes(customRules[c].keyword)) {
        // emojis 배열이면 랜덤, 구버전 emoji 문자열이면 그대로
        var emojis = customRules[c].emojis || [customRules[c].emoji];
        return emojis[Math.floor(Math.random() * emojis.length)];
      }
    }
  }

  // ── 2) 내장 규칙 검색 ──
  for (var i = 0; i < EMOJI_RULES.length; i++) {
    var rule = EMOJI_RULES[i];
    for (var j = 0; j < rule.keywords.length; j++) {
      if (lower.includes(rule.keywords[j])) {
        var emojis = rule.emoji;
        if (Array.isArray(emojis)) {
          return emojis[Math.floor(Math.random() * emojis.length)];
        }
        return emojis;
      }
    }
  }
  return null;
}
