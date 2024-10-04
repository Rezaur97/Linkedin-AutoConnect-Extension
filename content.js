let isConnecting = false;
let invitationsSent = 0;
let timeoutId = null;

function getRandomDelay() {
  return Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000; // Random delay between 5-10 seconds
}

function clickSendWithoutNote() {
  const sendButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Send without a note');
  if (sendButton) {
    sendButton.click();
    console.log('Clicked "Send without a note" button.');
  }
}

function checkAndSendConnectionRequests() {
  // Ensure we only operate on the first page
  if (window.location.pathname !== '/search/results/people/') {
    console.log('Not on the correct page for connections.');
    stopConnecting();
    return;
  }

  let connectButtons = document.querySelectorAll('button');

  // Filter to find "Connect" buttons and skip "Message" buttons
  let connectButtonList = Array.from(connectButtons).filter(button => button.textContent.trim() === 'Connect');
  let messageButtonList = Array.from(connectButtons).filter(button => button.textContent.trim() === 'Message');

  if (messageButtonList.length > 0) {
    console.log('Skipping profiles with "Message" button.');
    // Skip this profile and move to the next connect button
    return;
  }

  if (connectButtonList.length === 0) {
    console.log('No more Connect buttons found.');
    stopConnecting();
    return;
  }

  // Click the first available Connect button
  let connectButton = connectButtonList[0];
  connectButton.click();
  invitationsSent += 1;

  console.log('Clicked Connect button, total invitations sent:', invitationsSent);

  // Wait for the pop-up to appear before clicking "Send without a note"
  setTimeout(() => {
    clickSendWithoutNote();
    // Send the count back to the popup after sending the invitation
    chrome.runtime.sendMessage({ action: 'invitationsSent', count: invitationsSent });
  }, 1000); // Wait for 1 second for the pop-up to show

  // Set a random timeout before the next request
  timeoutId = setTimeout(checkAndSendConnectionRequests, getRandomDelay());
}

function startConnecting() {
  isConnecting = true;
  invitationsSent = 0;
  checkAndSendConnectionRequests(); // Start the connection process
}

function stopConnecting() {
  isConnecting = false;
  clearTimeout(timeoutId);
  console.log('Connection process stopped.');
}

// Listen for messages from the popup to start/stop connecting
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    startConnecting();
    sendResponse({ status: 'started' });
  } else if (request.action === 'stop') {
    stopConnecting();
    sendResponse({ status: 'stopped' });
  } else {
    sendResponse({ status: 'unknown action' });
  }
});

// Log when content script is loaded
console.log('Content script loaded and ready.');
