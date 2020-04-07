const runOnCurrentTab = (callback) => new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0] || tabs[0].url.startsWith('chrome://')) {
            return;
        }

        chrome.tabs.executeScript(
            tabs[0].id,
            {code: `eval("${callback.replace(/\n/g, '').replace(/\s\s+/g, '')};")`}
        )
        resolve();
    });
});

const onInstalled = (listener) => {
    chrome.runtime.onInstalled.addListener(listener);
};

const onPageChanged = (conditions, actions) => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            { conditions, actions }
        ]);
    });
};

module.exports = {
    runOnCurrentTab,
    onInstalled,
    onPageChanged
};
