const { onInstalled, onPageChanged } = require('./common/chromeService');

onInstalled(() => {
    onPageChanged([
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ['input[type=password]']
        }),
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ['input[type=text][name=userName]']
        }),
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ['input[type=text][name=username]']
        }),
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ['input[type=text][name=login]']
        }),
    ], [
        new chrome.declarativeContent.ShowPageAction()
    ]);
});
