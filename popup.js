document.getElementById("copyAllButton").addEventListener("click", () => {
    // Send message to background script to get all tab titles and URLs in the current window
    // chrome.runtime.sendMessage({ action: "getTabInfo" }, (tabInfo) => {
    //   const tabText = tabInfo.map(tab => `- [${tab.title}](${tab.url})`).join("\n");
    //   copyToClipboard(tabText);
    // });

    // print all tabs with comments
    chrome.runtime.sendMessage({ action: "getTabInfo" }, (tabs) => {
      var tabText = "";
      for (let i = 0; i < tabs.length; i++){
        tabText += `[${tabs[i].title}](${tabs[i].url})\n`;
        alert(tabs[i].tab_comments);
        if (tabs[i].tab_comments){
          for (let j = 0; j < tabs[i].tab_comments.length; j++){
            tabText += `\t- ${tabs[i].tab_comments[j]}\n`;
          }
        }
      }
      copyToClipboard(tabText);
    });
  });
  
  document.getElementById("copyActiveButton").addEventListener("click", () => {
    // Send message to background script to get the active tab's title and URL
    chrome.runtime.sendMessage({ action: "getActiveTabInfo" }, (tabInfo) => {
      var activeTabText = `[${tabInfo.title}](${tabInfo.url})\n`;
      
      for (let i = 0; i < tabInfo.tab_comments.length; i++){
        activeTabText += `\t- ${tabInfo.tab_comments[i]}\n`;
      }
      copyToClipboard(activeTabText);
    });
  });
  
  document.getElementById("deleteDublicatesButton").addEventListener("click", () => {
    // Send message to background script to get the active tab's title and URL
    chrome.runtime.sendMessage({ action: "getTabInfo" }, (tabs) => {
      deleteDublicates(tabs);
    });
  });


  document.getElementById("openUrlsButton").addEventListener("click", () => {
    const inputText = document.getElementById("urlInputBox").value.trim(); // Get input from textarea
    const urls = extractUrlsFromInput(inputText);  // Extract URLs from the input
    openUrls(urls);  // Open the extracted URLs in new tabs
  });
  

  // Implement a 'addCommentsButton' event listener that when pressed adds comment to storage
  // Comment should be assosiated with the current tab
  document.getElementById("addCommentsButton").addEventListener("click", () => {
    const comment = document.getElementById("commentInputBox").value.trim(); // Get input from textarea
    // Send message to background script to add comment to storage
    // Error I am getting is response undefined

    chrome.runtime.sendMessage({ action: "addComment", comment }, (response) => {
      if (response.success) {
        alert("Comment added successfully!");
      } else {
        alert("Failed to add comment.");
      }
    }
    );

    // get all comments and ste them to the comments box
    chrome.runtime.sendMessage({ action: "getActiveTabInfo" }, (tabInfo) => {
      document.getElementById("commentOutputBox").innerText = list_to_string(tabInfo.tab_comments);
    });
  });


  function list_to_string(list){
    return list.join("\n");
  }

  // Function to extract URLs from input (title - URL format)
  function extractUrlsFromInput(input) {
    const urlPattern = /(https?:\/\/[^\s\)]+)/g;  // Regex to match URLs starting with http:// or https://
    const matches = input.match(urlPattern);  // Extract all matching URLs
    return matches || [];  // Return the URLs (empty array if no matches)
  }
  
  // Function to open all URLs in new tabs
  function openUrls(urls) {
    if (urls.length > 0) {
      urls.forEach(url => {
        // Validate URL format before opening it in a new tab
        if (isValidUrl(url)) {
          chrome.tabs.create({ url: url });
        } else {
          alert(`Invalid URL: ${url}`);
        }
      });
    } else {
      alert("Please enter at least one valid URL.");
    }
  }
  
  // Function to validate URL format
  function isValidUrl(url) {
    const regex = /^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return regex.test(url);
  }
  
  // Function to copy text to clipboard
  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Tab title and URL copied to clipboard!");
  }

  // Delete dublicate tabs
  function deleteDublicates(tabs){

    const seenUrls = new Set();
    const tabsToClose = [];

    tabs.forEach(tab => {
        if (seenUrls.has(tab.url)) {
            tabsToClose.push(tab.id); // Mark this tab to close
        } else {
            seenUrls.add(tab.url); // Add to seen URLs
        }
    });

    if (tabsToClose.length > 0) {
      chrome.tabs.remove(tabsToClose, () => {
          console.log(`Closed ${tabsToClose.length} duplicate tab(s).`);
      });
    } else {
      console.log("No duplicate tabs found to close.");
    } 



  }

  