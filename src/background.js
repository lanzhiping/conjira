const { onInstalled, onPageChanged } = require('./common/chromeService');

onInstalled(() => {
    onPageChanged([
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ['input[type=password]']
        }),
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ['input[type=text][name=userName],input[type=email][name=userName]']
        }),
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ['input[type=text][name=username],input[type=email][name=username]']
        }),
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: ['input[type=text][name=login],input[type=email][name=login]']
        }),
    ], [
        new chrome.declarativeContent.ShowPageAction()
    ]);
});
