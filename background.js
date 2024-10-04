chrome.action.onClicked.addListener((tab) => {
  // Check if the current tab's URL is for LinkedIn
  if (tab.url && tab.url.includes("https://www.linkedin.com/")) {
    chrome.action.setPopup({ popup: 'popup.html' });
  } else {
    chrome.action.setPopup({ popup: '' });
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/icon-128.png',
      title: 'LinkedIn Auto Connector',
      message: 'This extension works only on LinkedIn!',
      priority: 2
    });
  }
});
