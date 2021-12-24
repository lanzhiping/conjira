const { onInstalled, onPageChanged } = require("./common/chromeService");

onInstalled(() => {
  onPageChanged(
    [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { schemes: ["https"] },
      }),
    ],
    [new chrome.declarativeContent.ShowPageAction()]
  );
});
