const { saveSecrets } = require('./storageService');

const addListenerOnInstalled = (chrome, listener) => {
    chrome.runtime.onInstalled.addListener(listener);
};

addListenerOnInstalled(chrome, () => {
    saveSecrets([])

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                  pageUrl: { schemes: ['https'] },
                  css: ["input[type='password']"]
                }),
              ],
              actions: [
                new chrome.declarativeContent.RequestContentScript({
                    js: ["./conjiraInject.js"]
                }),
                new chrome.declarativeContent.ShowPageAction()
            ]
        }]);
    });
});
