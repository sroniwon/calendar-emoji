// content.js — Calendar Emoji Auto-Tagger v2.1
// Google Calendar 일정 제목에 이모지를 자동으로 붙여주는 content script

(function () {
  "use strict";

  let isEnabled = true;
  let processedInputs = new WeakSet();
  let applyingEmoji = false;
  let lang = "ko";
  let customRules = []; // 사용자 커스텀 규칙 [{ emoji, keyword }]

  // ── 설정 로드 ──────────────────────────────────────────────
  chrome.storage.sync.get({ enabled: true, lang: "ko", customRules: [] }, (data) => {
    isEnabled = data.enabled;
    lang = data.lang || "ko";
    customRules = data.customRules || [];
  });

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) isEnabled = changes.enabled.newValue;
    if (changes.lang) lang = changes.lang.newValue;
    if (changes.customRules) customRules = changes.customRules.newValue || [];
  });

  // ── 팝업에서 ping 수신 → content script 살아있음 확인 ──────
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "ping") sendResponse({ ok: true });
  });

  // ── 이모지 시작 여부 체크 ──────────────────────────────────
  function startsWithEmoji(str) {
    return /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/u.test(str);
  }

  // ── 제목 input인지 판별 ────────────────────────────────────
  function isTitleInput(el) {
    if (!el) return false;
    if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" && !el.isContentEditable) return false;

    const aria = (el.getAttribute("aria-label") || "").toLowerCase();
    const placeholder = (el.getAttribute("placeholder") || "").toLowerCase();
    const dataPlaceholder = (el.getAttribute("data-placeholder") || "").toLowerCase();

    // 다국어 지원: 제목/Title/タイトル/Título 등
    const titleKeywords = ["title", "제목", "タイトル", "título", "titre", "titel"];
    const combined = `${aria} ${placeholder} ${dataPlaceholder}`;

    return titleKeywords.some((kw) => combined.includes(kw));
  }

  // ── 저장 버튼인지 판별 ─────────────────────────────────────
  function isSaveButton(el) {
    if (!el) return false;
    const text = (el.textContent || "").trim().toLowerCase();
    const tooltip = (el.getAttribute("data-tooltip") || "").toLowerCase();
    const aria = (el.getAttribute("aria-label") || "").toLowerCase();
    const combined = `${text} ${tooltip} ${aria}`;

    return (
      combined.includes("save") ||
      combined.includes("저장") ||
      combined.includes("保存") ||
      combined.includes("guardar")
    );
  }

  // ── 현재 열린 다이얼로그에서 제목 input 찾기 ──────────────
  function findTitleInput() {
    // 전략 1: aria-label 기반 (가장 안정적)
    const ariaSelectors = [
      '[aria-label="Title"]',
      '[aria-label="제목"]',
      '[aria-label="Add title"]',
      '[aria-label="제목 추가"]',
    ];
    for (const sel of ariaSelectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }

    // 전략 2: placeholder 기반
    const placeholderSelectors = [
      'input[placeholder="Add title"]',
      'input[placeholder="제목 추가"]',
      'input[placeholder*="title" i]',
      'input[placeholder*="제목"]',
      'input[placeholder="Add title and time"]',
      'input[placeholder="제목 및 시간 추가"]',
    ];
    for (const sel of placeholderSelectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }

    // 전략 3: data-placeholder 기반
    const dataSelectors = [
      '[data-placeholder="Add title"]',
      '[data-placeholder="제목 추가"]',
      '[data-placeholder*="title" i]',
      '[data-placeholder*="제목"]',
    ];
    for (const sel of dataSelectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }

    return null;
  }

  // ── input 값 설정 (Closure Library / jsaction 호환) ─────────
  // Google Calendar는 Closure Library를 사용하며, isTrusted: false인
  // 합성 이벤트를 무시합니다. execCommand를 사용하면 브라우저가
  // trusted 이벤트를 생성하여 프레임워크 내부 state가 업데이트됩니다.
  function setInputValue(inputEl, newValue) {
    inputEl.focus();

    if (inputEl.tagName === "INPUT" || inputEl.tagName === "TEXTAREA") {
      // 전체 텍스트 선택 후 execCommand로 교체 (trusted event 발생)
      inputEl.setSelectionRange(0, inputEl.value.length);
      document.execCommand("insertText", false, newValue);
    } else if (inputEl.isContentEditable) {
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, newValue);
    }
  }

  // ── 이모지 적용 (동기, 즉시) ───────────────────────────────
  function applyEmojiSync(inputEl) {
    if (!isEnabled || applyingEmoji) return false;

    const raw = inputEl.value || inputEl.textContent || "";
    const title = raw.trim();
    if (!title) return false;

    // 이미 이모지로 시작하면 스킵
    if (startsWithEmoji(title)) return false;

    // 커스텀 규칙 우선 → 내장 맵에서 이모지 검색
    const emoji = findEmojiForTitle(title, customRules);
    if (!emoji) return false;

    const newTitle = `${emoji} ${title}`;
    applyingEmoji = true;
    setInputValue(inputEl, newTitle);
    applyingEmoji = false;
    showToast(emoji, title);

    // 카운트 증가 (storage에 직접)
    chrome.storage.sync.get({ emojiCount: 0 }, function (data) {
      chrome.storage.sync.set({ emojiCount: (data.emojiCount || 0) + 1 });
    });

    return true;
  }

  // ── 이벤트 핸들러 등록 ─────────────────────────────────────

  // 1. focusin: 제목 input이 포커스될 때 blur 핸들러 등록
  document.addEventListener(
    "focusin",
    (e) => {
      const el = e.target;
      if (!isTitleInput(el)) return;
      if (processedInputs.has(el)) return;

      processedInputs.add(el);

      el.addEventListener("blur", () => {
        // blur 시 이모지 적용 (사용자가 제목 입력 완료 후)
        setTimeout(() => applyEmojiSync(el), 50);
      });
    },
    true
  );

  // 2. 저장 버튼 mousedown 감지 (mousedown → blur → click 순서이므로
  //    mousedown에서 이모지를 적용하면 blur 시점에 이미 반영됨)
  document.addEventListener(
    "mousedown",
    (e) => {
      if (!isEnabled || applyingEmoji) return;

      // 클릭된 요소가 저장 버튼인지 확인 (부모 6단계까지)
      let el = e.target;
      let depth = 0;
      let foundSave = false;
      while (el && depth < 6) {
        if (isSaveButton(el)) {
          foundSave = true;
          break;
        }
        el = el.parentElement;
        depth++;
      }

      if (!foundSave) return;

      const input = findTitleInput();
      if (!input) return;

      applyEmojiSync(input);
      // 저장 이벤트는 그대로 진행 (중단하지 않음)
    },
    true
  );

  // 3. Enter 키로 저장 감지 (keydown capture phase)
  document.addEventListener(
    "keydown",
    (e) => {
      if (!isEnabled || applyingEmoji || e.key !== "Enter") return;

      const input = e.target;
      if (!isTitleInput(input)) return;

      const raw = input.value || input.textContent || "";
      const title = raw.trim();
      if (!title || startsWithEmoji(title)) return;

      const emoji = findEmojiForTitle(title, customRules);
      if (!emoji) return;

      // 이모지 적용 후 Enter는 자연스럽게 진행
      applyEmojiSync(input);
      // Enter 이벤트는 그대로 진행 (중단하지 않음)
    },
    true
  );

  // ── MutationObserver: 다이얼로그 열림 감지 ─────────────────
  // Google Calendar의 이벤트 생성/편집 다이얼로그가 열릴 때를 감지
  const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;

        // 새로 추가된 노드에서 제목 input 찾기
        const inputs = node.querySelectorAll
          ? [
              ...node.querySelectorAll("input"),
              ...(node.tagName === "INPUT" ? [node] : []),
            ]
          : [];

        for (const input of inputs) {
          if (isTitleInput(input) && !processedInputs.has(input)) {
            processedInputs.add(input);
            input.addEventListener("blur", () => {
              setTimeout(() => applyEmojiSync(input), 50);
            });
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // ── Toast 알림 ─────────────────────────────────────────────
  function showToast(emoji, originalTitle) {
    const old = document.getElementById("cet-toast");
    if (old) old.remove();

    const t = document.createElement("div");
    t.id = "cet-toast";

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "cet-emoji";
    emojiSpan.textContent = emoji;

    const msgSpan = document.createElement("span");
    msgSpan.className = "cet-msg";
    // 제목이 길면 잘라서 표시
    const displayTitle =
      originalTitle.length > 20
        ? originalTitle.slice(0, 20) + "..."
        : originalTitle;
    msgSpan.textContent = `"${displayTitle}" → ${emoji}`;

    t.appendChild(emojiSpan);
    t.appendChild(msgSpan);
    document.body.appendChild(t);

    requestAnimationFrame(() => t.classList.add("cet-show"));
    setTimeout(() => {
      t.classList.remove("cet-show");
      setTimeout(() => t.remove(), 400);
    }, 2000);
  }

})();
