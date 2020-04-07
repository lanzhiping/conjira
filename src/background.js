const { onInstalled, onPageChanged } = require('./common/chromeService');
const { saveSecrets } = require('./common/storageService');

onInstalled(() => {
    saveSecrets([]);
    onPageChanged([
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ["input[type='password']"]
        })
    ], [
        new chrome.declarativeContent.ShowPageAction()
    ]);
});
