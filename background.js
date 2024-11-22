chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTabInfo") {
      // Get all tabs in the current window
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        const tabInfo = tabs.map(tab => ({
          title: tab.title,
          url: tab.url
        }));
        sendResponse(tabInfo);
      });
      return true; // Indicating that sendResponse will be called asynchronously
    }
  
    if (message.action === "getActiveTabInfo") {
      // Get the active tab in the current window
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        sendResponse({
          title: activeTab.title,
          url: activeTab.url
        });
      });
      return true; // Indicating that sendResponse will be called asynchronously
    }
  });
  