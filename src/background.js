const { onInstalled, onPageChanged } = require('./common/chromeService');

onInstalled(() => {
    onPageChanged([
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ['input[type=\'password\']']
        })
    ], [
        new chrome.declarativeContent.ShowPageAction()
    ]);
});
