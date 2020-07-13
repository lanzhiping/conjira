const cryptoRandomString = require('crypto-random-string');
const clientScript = require('../common/clientScript');
const encrypt = require('../common/encrypt');
const View = require('../common/View');
const { loadSecretBySearch, loadSecretById } = require('../common/storageService');
const { runOnCurrentTab } = require('../common/chromeService');

const renderSecrets = async ({ list, search }) => {
    const secrets = await loadSecretBySearch(search.value);

    if (secrets.length === 0) {
        list.innerText = 'No secret yet.'
    }
    renderList(list, secrets);
}

const renderList = (listElement, secrets) => {
    const secretElements = secrets.map(({ _id, name }) => {
        return `
            <div id="item" data-id="${_id}">
                <span id="item-name">${name}</span>
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
    const seed = cryptoRandomString({ length: 20 });

    runOnCurrentTab(clientScript(seed, encrypt(seed)(JSON.stringify(secret))));
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
