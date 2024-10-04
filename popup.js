document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleButton');
    let isConnecting = false;

    toggleButton.addEventListener('click', () => {
        isConnecting = !isConnecting;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url && tabs[0].url.includes("https://www.linkedin.com/")) {
                // Ensure the content script is injected
                chrome.tabs.sendMessage(tabs[0].id, { action: isConnecting ? 'start' : 'stop' }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                        alert('Could not establish connection. Ensure the content script is running on LinkedIn.');
                        // Reset the button state if an error occurs
                        isConnecting = !isConnecting; // Revert the toggle state
                        toggleButton.textContent = isConnecting ? 'START CONNECTING' : 'STOP CONNECTING';
                        toggleButton.classList.toggle('start-btn', !isConnecting);
                        toggleButton.classList.toggle('stop-btn', isConnecting);
                    } else {
                        toggleButton.textContent = isConnecting ? 'STOP CONNECTING' : 'START CONNECTING';
                        toggleButton.classList.toggle('start-btn', !isConnecting);
                        toggleButton.classList.toggle('stop-btn', isConnecting);
                    }
                });
            } else {
                alert('This extension works only on LinkedIn!');
            }
        });
    });

    // Update this function to handle the invitations sent count
    function updateCounter(count) {
        const counterElement = document.querySelector('.counter');
        if (counterElement) {
            counterElement.textContent = count;
        }
    }

    // Modify the content script listener to send the invitations sent count
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'invitationsSent') {
            updateCounter(request.count);
            sendResponse({ status: 'updated' });
        }
    });

    // Log when popup script is loaded
    console.log('Popup script loaded and ready.');
});
