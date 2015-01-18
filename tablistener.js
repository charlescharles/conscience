chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url.indexOf('amazon') > -1) {
        // chrome.tabs.executeScript({
        //     code: 'document.body.style.backgroundColor="red"'
        // });
    };
})
