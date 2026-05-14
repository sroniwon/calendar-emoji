// background.js — Service Worker for Calendar Emoji Auto-Tagger

// 익스텐션 설치 시 기본 설정 초기화
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.sync.set({
      enabled: true,
      installDate: Date.now(),
      emojiCount: 0,
    });
    // installed
  }
});

// 팝업이나 content script에서 메시지 수신
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getStats") {
    chrome.storage.sync.get(["emojiCount", "installDate"], (data) => {
      sendResponse({
        emojiCount: data.emojiCount || 0,
        installDate: data.installDate || Date.now(),
      });
    });
    return true; // async sendResponse
  }

  if (message.type === "incrementCount") {
    chrome.storage.sync.get(["emojiCount"], (data) => {
      const newCount = (data.emojiCount || 0) + 1;
      chrome.storage.sync.set({ emojiCount: newCount });
      sendResponse({ emojiCount: newCount });
    });
    return true;
  }
});
