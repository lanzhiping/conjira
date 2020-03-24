const cryptoRandomString = require('crypto-random-string');
const View = require('./View');
const clientScript = require('./clientScript');
const { loadSecrets, loadSecretById } = require('./storageService')

const cipher = salt => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a,b) => a ^ b, code);

    return text => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');
}

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

const renderSecrets = async ({ list, search }) => {
    const secrets = await loadSecrets(search.value);

    console.log('secrets: ', secrets)
    if (secrets.length === 0) {
        list.innerText = 'No secret yet.'
    }
    renderList(list, secrets);
}

const renderList = (listElement, secrets) => {
    const secretElements = secrets.map(({ _id, name, account }) => {
        return `
            <div id="item" data-id="${_id}">
                <span id="item-name">${name}</span>
                <span id="item-account">(${account})</span>
            </div>
        `;
    }).join('')

    listElement.innerHTML = secretElements;
};

const onSearchInput = (event, target, elements) => {
    renderSecrets(elements);
}

const onSecretClick = async (event) => {
    const targetId = event.target.getAttribute('id')
    let secretId

    if (targetId === 'item') {
        secretId = event.target.getAttribute('data-id');
    }
    if (targetId === 'item-account' || targetId === 'item-name') {
        secretId = event.target.parentElement.getAttribute('data-id');
    }

    const secret = await loadSecretById(secretId);
    const shortId = cryptoRandomString({ length: 20 });

    runOnCurrentTab(clientScript(shortId, cipher(shortId)(JSON.stringify(secret))));
}

const popup = new View({
    elements: {
        container: '#container',
        search: '#secret-search',
        list: '#secret-list'
    },
    listeners: {
        'input@search': onSearchInput,
        'click@list': onSecretClick,
    }
});

popup.didMount(renderSecrets);
