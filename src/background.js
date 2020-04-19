const { onInstalled, onPageChanged } = require('./common/chromeService');

onInstalled(() => {
    onPageChanged([
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https'] },
            css: [
                'input[type=password]',
                'input[type=text][name=userName]',
                'input[type=text][name=username]',
                'input[type=text][name=login]'
            ]
        })
    ], [
        new chrome.declarativeContent.ShowPageAction()
    ]);
});
