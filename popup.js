document.getElementById("copyAllButton").addEventListener("click", () => {
    // Send message to background script to get all tab titles and URLs in the current window
    chrome.runtime.sendMessage({ action: "getTabInfo" }, (tabInfo) => {
      const tabText = tabInfo.map(tab => `- [${tab.title}](${tab.url})`).join("\n");
      copyToClipboard(tabText);
    });
  });
  
  document.getElementById("copyActiveButton").addEventListener("click", () => {
    // Send message to background script to get the active tab's title and URL
    chrome.runtime.sendMessage({ action: "getActiveTabInfo" }, (tabInfo) => {
      const activeTabText = `[${tabInfo.title}](${tabInfo.url})`;
      copyToClipboard(activeTabText);
    });
  });
  
  document.getElementById("openUrlsButton").addEventListener("click", () => {
    const inputText = document.getElementById("urlInputBox").value.trim(); // Get input from textarea
    const urls = extractUrlsFromInput(inputText);  // Extract URLs from the input
    openUrls(urls);  // Open the extracted URLs in new tabs
  });
  
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