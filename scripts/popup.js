let start = document.getElementById('start-record').addEventListener("click", sendMessageToWebPage)


function sendMessageToWebPage(message) {
  console.log('Thông điệp nhận từ giao diện web:', message);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('Thông điệp nhận từ giao diện web:', message);
});