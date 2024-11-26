chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTabInfo") {
      // Get all tabs in the current window
      chrome.tabs.query({ currentWindow: true }, (tabs) => {
        // Get the comments from local storage
        chrome.storage.local.get("comments", (data) => {
          const comments = data.comments || {};
          const tabInfo = tabs.map((tab) => ({
            title: tab.title,
            url: tab.url,
            id: tab.id,
            tab_comments: comments[tab.id] || [],
          }));
          sendResponse(tabInfo);
        }
        );

      });
      return true; // Indicating that sendResponse will be called asynchronously
    }
  
    if (message.action === "getActiveTabInfo") {
      // Get the active tab in the current window
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        // get comments from local storage
        chrome.storage.local.get("comments", (data) => {
          const comments = data.comments || {};
          const comment = comments[activeTab.id] || "";
          sendResponse({
            title: activeTab.title,
            url: activeTab.url,
            id: activeTab.id,
            tab_comments: comment,
          });
        });

      });
      return true; // Indicating that sendResponse will be called asynchronously
    }

    if (message.action === "addComment") {
      // Get the active tab in the current window
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        // get comments from local storage
        chrome.storage.local.get("comments", (data) => {
          const comments = data.comments || {};
          comments[activeTab.id] = comments[activeTab.id] || [];
          if (!comments[activeTab.id]){
            // Create an empty list
            comments[activeTab.id] = [];
          }
          else{
            // Add the comment to the list
            comments[activeTab.id].push(message.comment);
          }
          chrome.storage.local.set({ comments }, () => {
            sendResponse({ success: true });
          });
        });
      });
      return true; // Indicating that sendResponse will be called asynchronously
    }
  });


  
  