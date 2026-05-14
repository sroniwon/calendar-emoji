// popup.js — Cal Emoji Auto-Tagger popup logic (v2.2 redesign)

// ── 테마 팔레트 ──────────────────────────────────────────────
var THEMES = {
  default:  { label:"Default",  icon:"☁️", dot:"#fff", bg:"#F5F5F5", card:"rgba(0,0,0,.04)", cardSolid:"#FFFFFF", hover:"rgba(0,0,0,.07)", accent:"#4285F4", text:"#202124", muted:"#5F6368", faint:"rgba(95,99,104,.3)", border:"rgba(0,0,0,.08)", accentSoft:"rgba(66,133,244,.1)", toggleOn:"#4285F4", toggleKnob:"#FFFFFF" },
  forest:   { label:"Forest",   icon:"🌲", dot:"#2F6B3F", bg:"#2F6B3F", card:"rgba(0,0,0,.15)", cardSolid:"#256332", hover:"rgba(0,0,0,.22)", accent:"#F7C85C", text:"#FFF6C0", muted:"#7FB77E", faint:"rgba(127,183,126,.4)", border:"rgba(255,246,192,.12)", accentSoft:"rgba(247,200,92,.15)", toggleOn:"#F7C85C", toggleKnob:"#2F6B3F" },
  midnight: { label:"Midnight", icon:"🌙", dot:"#141432", bg:"#141432", card:"rgba(255,255,255,.07)", cardSolid:"#1E1E50", hover:"rgba(255,255,255,.11)", accent:"#F4D03F", text:"#E8E6F0", muted:"#7B78A8", faint:"rgba(123,120,168,.35)", border:"rgba(232,230,240,.08)", accentSoft:"rgba(244,208,63,.12)", toggleOn:"#F4D03F", toggleKnob:"#141432" },
  ocean:    { label:"Ocean",    icon:"🌊", dot:"#BBE1FA", bg:"#BBE1FA", card:"rgba(255,255,255,.5)", cardSolid:"#89CFF0", hover:"rgba(255,255,255,.6)", accent:"#0F4C75", text:"#0A1929", muted:"#1B6CA8", faint:"rgba(15,76,117,.3)", border:"rgba(10,25,41,.08)", accentSoft:"rgba(15,76,117,.1)", toggleOn:"#0F4C75", toggleKnob:"#BBE1FA" },
  lavender: { label:"Lavender", icon:"🪻", dot:"#BDA6CE", bg:"#F2EAE0", card:"rgba(155,142,199,.12)", cardSolid:"#B4D3D9", hover:"rgba(155,142,199,.18)", accent:"#9B8EC7", text:"#4A3B6B", muted:"#8E7BA8", faint:"rgba(142,123,168,.3)", border:"rgba(74,59,107,.1)", accentSoft:"rgba(155,142,199,.12)", toggleOn:"#9B8EC7", toggleKnob:"#F2EAE0" },
  sunset:   { label:"Sunset",   icon:"🌅", dot:"#F9B208", bg:"#F7FD04", card:"rgba(249,132,4,.12)", cardSolid:"#F9B208", hover:"rgba(249,132,4,.18)", accent:"#FC5404", text:"#5C2E00", muted:"#B86800", faint:"rgba(184,104,0,.3)", border:"rgba(92,46,0,.1)", accentSoft:"rgba(252,84,4,.1)", toggleOn:"#FC5404", toggleKnob:"#F7FD04" },
  peach:    { label:"Peach",    icon:"🍑", dot:"#FFF5E4", bg:"#FFF5E4", card:"rgba(0,0,0,.04)", cardSolid:"#FFE3E1", hover:"rgba(0,0,0,.07)", accent:"#FF9494", text:"#392F5A", muted:"#8B7FB5", faint:"rgba(139,127,181,.3)", border:"rgba(57,47,90,.1)", accentSoft:"rgba(255,148,148,.12)", toggleOn:"#FF9494", toggleKnob:"#FFF5E4" }
};
var THEME_KEYS = Object.keys(THEMES);
var currentTheme = "forest";

function applyTheme(name) {
  var t = THEMES[name];
  if (!t) return;
  currentTheme = name;
  var r = document.documentElement.style;
  r.setProperty("--bg", t.bg);
  r.setProperty("--card", t.card);
  r.setProperty("--card-solid", t.cardSolid);
  r.setProperty("--hover", t.hover);
  r.setProperty("--accent", t.accent);
  r.setProperty("--text", t.text);
  r.setProperty("--muted", t.muted);
  r.setProperty("--faint", t.faint);
  r.setProperty("--border", t.border);
  r.setProperty("--accent-soft", t.accentSoft);
  r.setProperty("--toggle-on", t.toggleOn);
  r.setProperty("--toggle-knob", t.toggleKnob);
  // 활성 dot 표시
  var dots = document.querySelectorAll(".theme-dot");
  for (var i = 0; i < dots.length; i++) {
    dots[i].classList.toggle("active", dots[i].getAttribute("data-theme") === name);
  }
}

function buildThemeDots() {
  var row = document.getElementById("theme-row");
  for (var i = 0; i < THEME_KEYS.length; i++) {
    var key = THEME_KEYS[i];
    var t = THEMES[key];
    var dot = document.createElement("div");
    dot.className = "theme-dot";
    dot.setAttribute("data-theme", key);
    dot.textContent = t.icon;
    dot.title = t.label;
    dot.addEventListener("click", function () {
      var name = this.getAttribute("data-theme");
      applyTheme(name);
      chrome.storage.sync.set({ theme: name });
    });
    row.appendChild(dot);
  }
}

// ── i18n 번역 ────────────────────────────────────────────────
var STRINGS = {
  ko: {
    themeTitle: "테마",
    previewTitle: "이모지 미리보기",
    previewPlaceholder: "예: 팀 미팅, 운동, 점심 약속...",
    previewBtn: "확인",
    noMatch: "매칭되는 이모지가 없습니다",
    customTitle: "나만의 이모지 규칙",
    customKeywordPh: "키워드 입력...",
    customEmpty: "아직 추가된 규칙이 없습니다",
    catShow: "▶ 지원하는 이모지 카테고리 보기",
    catHide: "▼ 카테고리 접기",
    footer: "Cal Emoji v2.2",
    badgeCount: "회 적용",
    catUnit: "개 규칙",
  },
  en: {
    themeTitle: "THEME",
    previewTitle: "EMOJI PREVIEW",
    previewPlaceholder: "e.g. Team meeting, Gym, Lunch...",
    previewBtn: "Try",
    noMatch: "No matching emoji found",
    customTitle: "MY CUSTOM RULES",
    customKeywordPh: "Enter keyword...",
    customEmpty: "No custom rules yet",
    catShow: "▶ Show emoji categories",
    catHide: "▼ Hide categories",
    footer: "Cal Emoji v2.2",
    badgeCount: " applied",
    catUnit: " rules",
  },
};

// ── DOM ──────────────────────────────────────────────────────
var toggle = document.getElementById("toggle");
var langBtn = document.getElementById("lang-btn");
var emojiCountBadge = document.getElementById("emoji-count-badge");
var catCountBadge = document.getElementById("cat-count-badge");
var previewInput = document.getElementById("preview-input");
var previewResult = document.getElementById("preview-result");
var previewBtn = document.getElementById("preview-btn");
var catToggle = document.getElementById("cat-toggle");
var catList = document.getElementById("cat-list");

var customEmojiBtn = document.getElementById("custom-emoji-btn");
var emojiPickerEl = document.getElementById("emoji-picker");
var customKeywordInput = document.getElementById("custom-keyword");
var customAddBtn = document.getElementById("custom-add-btn");
var customListEl = document.getElementById("custom-list");
var customEmptyEl = document.getElementById("custom-empty");

var currentLang = "ko";
var catOpen = false;
var customRules = [];
var selectedEmoji = "😀";

// ── 이모지 피커 데이터 ───────────────────────────────────────
var PICKER_EMOJIS = {
  "😊": ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🫢","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🥴","😵","🤯","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","☹️","😮","😯","😲","😳","🥺","🥹","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"],
  "👋": ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅","👄","🫦","💋"],
  "🐶": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🪲","🪳","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌"],
  "🍔": ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🫑","🌽","🥕","🫒","🧄","🧅","🥔","🍠","🫘","🥐","🥖","🍞","🥨","🥯","🧇","🥞","🧈","🍳","🥚","🧀","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🫓","🥪","🥙","🧆","🌮","🌯","🫔","🥗","🥘","🫕","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🫗","🍺","🍻","🥂","🍷","🍸","🍹","🧃","☕","🍵","🧋"],
  "⚽": ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🥍","🏏","🪃","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","🤺","⛹️","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚴","🚵","🏆","🥇","🥈","🥉","🏅","🎖️","🎗️","🎫","🎟️","🎪"],
  "🚗": ["🚗","🚕","🚙","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚍","🚘","🚖","🛞","🚆","🚇","🚈","🚉","🚊","🚝","🚞","🚋","🚃","🚎","🚂","✈️","🛫","🛬","🛩️","💺","🚀","🛸","🚁","🛶","⛵","🚤","🛥️","⛴️","🚢","⚓","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","⛪","🕌","🛕","🕍","⛩️","🗽"],
  "💡": ["💡","🔦","🕯️","🪔","💰","💵","💴","💶","💷","🪙","💸","💳","🧾","💹","📱","💻","⌨️","🖥️","🖨️","🖱️","🖲️","🕹️","📷","📸","📹","🎥","📽️","🎬","📺","📻","🎙️","🎚️","🎛️","⏰","⏱️","⌚","🔔","🔕","📣","📢","🔊","🔇","🔈","🔉","📡","🔋","🔌","💎","⚙️","🔧","🔨","🛠️","⛏️","🪚","🔩","📎","🖇️","📌","📍","🗑️","🔒","🔓","🔑","🗝️"],
  "❤️": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉️","☸️","✡️","🔯","🕎","☯️","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎","🔀","🔁","🔂","▶️","⏩","⏭️","⏯️","◀️","⏪","⏮️","🔼","⏫","🔽","⏬","⏸️","⏹️","⏺️","⏏️","🎵","🎶","🎼","🎹","🥁","🪘","🎷","🎺","🪗","🎸","🪕","🎻","🎤","🪈"],
  "🎉": ["🎉","🎊","🎈","🎁","🎀","🧧","🎄","🎃","🎆","🎇","🧨","✨","🎋","🎍","🎎","🎏","🎐","🎑","🧧","🎗️","🎞️","🎟️","🏷️","🔖","📫","📮","📯","📜","📃","📄","📑","🗒️","📊","📈","📉","🗂️","📁","📂","🗃️","🗄️","📋","📇","📅","📆","🗓️","📐","📏","🗺️","🧭","🌐","🔎","🔍","💊","💉","🩸","🩹","🩺","🩻","🧬","🦠","🧫","🧪","🏁","🚩","🎌","🏴","🏳️","🏳️‍🌈","🏴‍☠️","🇰🇷","🇺🇸","🇯🇵"]
};
var PICKER_TAB_KEYS = Object.keys(PICKER_EMOJIS);

// ── i18n ─────────────────────────────────────────────────────
function applyLang(lang) {
  currentLang = lang;
  var s = STRINGS[lang] || STRINGS.ko;

  var els = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < els.length; i++) {
    var key = els[i].getAttribute("data-i18n");
    if (s[key] != null) els[i].textContent = s[key];
  }

  var phEls = document.querySelectorAll("[data-i18n-placeholder]");
  for (var j = 0; j < phEls.length; j++) {
    var phKey = phEls[j].getAttribute("data-i18n-placeholder");
    if (s[phKey] != null) phEls[j].placeholder = s[phKey];
  }

  if (typeof EMOJI_RULES !== "undefined") {
    catCountBadge.textContent = EMOJI_RULES.length + (s.catUnit || "");
  }

  catToggle.textContent = catOpen ? s.catHide : s.catShow;
  langBtn.textContent = lang.toUpperCase();
  document.getElementById("toggle-label").title = lang === "ko" ? "자동 이모지 On/Off" : "Auto-emoji On/Off";
  document.documentElement.lang = lang;
}

function updateBadgeCount(count) {
  var s = STRINGS[currentLang] || STRINGS.ko;
  emojiCountBadge.textContent = (count || 0) + (s.badgeCount || "");
}

// ── 커스텀 규칙 ──────────────────────────────────────────────
function renderCustomRules() {
  customListEl.innerHTML = "";
  if (customRules.length === 0) {
    customEmptyEl.style.display = "block";
    return;
  }
  customEmptyEl.style.display = "none";

  for (var i = 0; i < customRules.length; i++) {
    var rule = customRules[i];
    var emojis = rule.emojis || [rule.emoji];
    var item = document.createElement("div");
    item.className = "custom-item";

    var emojiSpan = document.createElement("span");
    emojiSpan.className = "custom-item-emojis";
    emojiSpan.textContent = emojis.join("");

    var kwSpan = document.createElement("span");
    kwSpan.className = "custom-item-keyword";
    kwSpan.textContent = rule.keyword;

    var delBtn = document.createElement("button");
    delBtn.className = "custom-del";
    delBtn.textContent = "✕";
    delBtn.setAttribute("data-index", i);
    delBtn.addEventListener("click", function () {
      var idx = parseInt(this.getAttribute("data-index"));
      customRules.splice(idx, 1);
      saveCustomRules();
      renderCustomRules();
    });

    item.appendChild(emojiSpan);
    item.appendChild(kwSpan);
    item.appendChild(delBtn);
    customListEl.appendChild(item);
  }
}

function saveCustomRules() {
  chrome.storage.sync.set({ customRules: customRules });
  // Google Calendar 탭에 ping → 응답 없으면 자동 새로고침
  try {
    chrome.tabs.query({ url: "https://calendar.google.com/*" }, function (tabs) {
      if (chrome.runtime.lastError || !tabs) return;
      for (var i = 0; i < tabs.length; i++) {
        (function (tabId) {
          chrome.tabs.sendMessage(tabId, { type: "ping" }, function (response) {
            if (chrome.runtime.lastError || !response || !response.ok) {
              chrome.tabs.reload(tabId);
            }
          });
        })(tabs[i].id);
      }
    });
  } catch (e) { /* tabs API 접근 불가 시 무시 — storage.onChanged로 동기화됨 */ }
}

function addCustomRule() {
  var emoji = selectedEmoji;
  var keyword = customKeywordInput.value.trim().toLowerCase();
  if (!emoji || !keyword) return;

  for (var i = 0; i < customRules.length; i++) {
    if (customRules[i].keyword === keyword) {
      var emojis = customRules[i].emojis || [customRules[i].emoji];
      if (emojis.indexOf(emoji) === -1) {
        emojis.push(emoji);
      }
      customRules[i] = { emojis: emojis, keyword: keyword };
      saveCustomRules();
      renderCustomRules();
      customKeywordInput.value = "";
      return;
    }
  }

  customRules.push({ emojis: [emoji], keyword: keyword });
  saveCustomRules();
  renderCustomRules();
  customKeywordInput.value = "";
  customKeywordInput.focus();
}

// ── 이모지 피커 ──────────────────────────────────────────────
function buildEmojiPicker() {
  emojiPickerEl.innerHTML = "";

  var tabBar = document.createElement("div");
  tabBar.className = "emoji-picker-tabs";
  for (var t = 0; t < PICKER_TAB_KEYS.length; t++) {
    var tabBtn = document.createElement("button");
    tabBtn.className = "emoji-tab" + (t === 0 ? " active" : "");
    tabBtn.textContent = PICKER_TAB_KEYS[t];
    tabBtn.setAttribute("data-tab", t);
    tabBtn.addEventListener("click", function () {
      var idx = parseInt(this.getAttribute("data-tab"));
      showPickerTab(idx);
      var allTabs = tabBar.querySelectorAll(".emoji-tab");
      for (var a = 0; a < allTabs.length; a++) allTabs[a].classList.remove("active");
      this.classList.add("active");
    });
    tabBar.appendChild(tabBtn);
  }
  emojiPickerEl.appendChild(tabBar);

  var grid = document.createElement("div");
  grid.className = "emoji-grid";
  grid.id = "emoji-grid";
  emojiPickerEl.appendChild(grid);

  showPickerTab(0);
}

function showPickerTab(idx) {
  var grid = document.getElementById("emoji-grid");
  grid.innerHTML = "";
  var emojis = PICKER_EMOJIS[PICKER_TAB_KEYS[idx]];
  for (var i = 0; i < emojis.length; i++) {
    var cell = document.createElement("div");
    cell.className = "emoji-cell";
    cell.textContent = emojis[i];
    cell.addEventListener("click", function () {
      selectedEmoji = this.textContent;
      customEmojiBtn.textContent = selectedEmoji;
      emojiPickerEl.classList.remove("show");
      customEmojiBtn.classList.remove("active");
      customKeywordInput.focus();
    });
    grid.appendChild(cell);
  }
}

// ── 이벤트 바인딩 ────────────────────────────────────────────
customAddBtn.addEventListener("click", addCustomRule);
customKeywordInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") addCustomRule();
});

customEmojiBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  var isOpen = emojiPickerEl.classList.contains("show");
  if (isOpen) {
    emojiPickerEl.classList.remove("show");
    customEmojiBtn.classList.remove("active");
  } else {
    if (!emojiPickerEl.hasChildNodes()) buildEmojiPicker();
    emojiPickerEl.classList.add("show");
    customEmojiBtn.classList.add("active");
  }
});

document.addEventListener("click", function (e) {
  if (!emojiPickerEl.contains(e.target) && e.target !== customEmojiBtn) {
    emojiPickerEl.classList.remove("show");
    customEmojiBtn.classList.remove("active");
  }
});

toggle.addEventListener("change", function () {
  chrome.storage.sync.set({ enabled: toggle.checked });
});

// 언어 토글 버튼 (KO ↔ EN)
langBtn.addEventListener("click", function () {
  var newLang = currentLang === "ko" ? "en" : "ko";
  chrome.storage.sync.set({ lang: newLang });
  applyLang(newLang);
  // 배지 카운트도 다시 업데이트
  chrome.storage.sync.get({ emojiCount: 0 }, function (d) {
    updateBadgeCount(d.emojiCount);
  });
});

// 미리보기
function runPreview() {
  var title = previewInput.value.trim();
  if (!title) { previewResult.textContent = ""; return; }
  if (typeof findEmojiForTitle === "undefined") {
    previewResult.className = "preview-result preview-empty";
    previewResult.textContent = "Error: emoji map not loaded";
    return;
  }
  var emoji = findEmojiForTitle(title, customRules);
  if (emoji) {
    previewResult.className = "preview-result";
    previewResult.textContent = emoji + " " + title;
  } else {
    previewResult.className = "preview-result preview-empty";
    previewResult.textContent = STRINGS[currentLang].noMatch;
  }
}

previewBtn.addEventListener("click", runPreview);
previewInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") runPreview();
});

// 카테고리 토글
catToggle.addEventListener("click", function () {
  catOpen = !catOpen;
  catList.classList.toggle("show", catOpen);
  var s = STRINGS[currentLang];
  catToggle.textContent = catOpen ? s.catHide : s.catShow;

  if (catOpen && typeof EMOJI_RULES !== "undefined") {
    catList.innerHTML = "";
    var isKo = currentLang === "ko";
    var koRegex = /[가-힣]/;
    for (var i = 0; i < EMOJI_RULES.length; i++) {
      var rule = EMOJI_RULES[i];
      // 현재 언어에 맞는 키워드만 필터링
      var filtered = [];
      for (var j = 0; j < rule.keywords.length; j++) {
        var kw = rule.keywords[j];
        var hasKorean = koRegex.test(kw);
        if (isKo ? hasKorean : !hasKorean) filtered.push(kw);
      }
      if (filtered.length === 0) continue;
      var div = document.createElement("div");
      div.className = "cat-item";
      var displayEmoji = Array.isArray(rule.emoji) ? rule.emoji[0] : rule.emoji;
      var emojiSpan = document.createElement("span");
      emojiSpan.textContent = displayEmoji;
      div.appendChild(emojiSpan);
      div.appendChild(document.createTextNode(filtered.slice(0, 4).join(", ")));
      catList.appendChild(div);
    }
  }
});

// ── 초기 로드 ────────────────────────────────────────────────
buildThemeDots();
chrome.storage.sync.get(
  { enabled: true, emojiCount: 0, lang: "ko", customRules: [], theme: "forest" },
  function (data) {
    toggle.checked = data.enabled;
    currentLang = data.lang || "ko";
    customRules = data.customRules || [];
    applyTheme(data.theme || "forest");
    applyLang(currentLang);
    updateBadgeCount(data.emojiCount);
    renderCustomRules();
  }
);
