const { loadSecretBySearch, removeSecret, updateSecret, loadSecretById, addSecret } = require('../common/storageService');
const View = require('../common/View');

const showSecrets = async ({ list, search }) => {
    loadSecretBySearch(search.value)
        .then((secrets) => renderList(list, secrets))
}

const renderList = (listElement, secrets) => {
    const secretElements = secrets.map(({ _id, name, account }) => {
        return `
            <div id="item" data-id="${_id}">
                <span>${name}</span>
                <span>${account}</span>
                <span id="item-password">******</span>
                <button id="item-update" disabled>Update</button>
                <button id="item-delete">Delete</button>
            </div>
        `;
    }).join('')

    listElement.innerHTML = secretElements;
};

const revealPassword = async (passwordElement) => {
    const secretId = passwordElement.parentElement.getAttribute('data-id');
    const secret = await loadSecretById(secretId);
    const { password } = secret;

    const inputElement = document.createElement('input');
    inputElement.setAttribute('id', 'item-password');
    inputElement.value = password;

    passwordElement.replaceWith(inputElement)
};

const updatePassword = async (passwordInput) => {
    const secretId = passwordInput.parentElement.getAttribute('data-id');
    const secret = await loadSecretById(secretId);
    const updatedSecret = { ...secret, password: passwordInput.value };

    updateSecret(updatedSecret);
}

const disclosedPassword = async (passwordInput) => {
    const passwordElement = document.createElement('span');
    passwordElement.setAttribute('id', 'item-password');
    passwordElement.innerText = '******';

    passwordInput.replaceWith(passwordElement);
}

const enableUpdate = async (passwordElement) => {
    passwordElement.nextElementSibling.disabled = false;
};

const disableUpdate = async (updateButton) => {
    updateButton.disabled = true;
};

const onSearchInput = async (_event, target, elements) => {
    showSecrets(elements);
}

const onListClick = async (event, target, elements) => {
    const targetId = event.target.getAttribute('id');

    if (targetId === 'item-password' && event.target.localName === 'span') {
        enableUpdate(event.target);
        revealPassword(event.target, elements);
    }

    if (targetId === 'item-update') {
        const passwordInput = event.target.previousElementSibling;

        updatePassword(passwordInput);
        disableUpdate(event.target);
        disclosedPassword(passwordInput);
    }

    if (targetId === 'item-delete') {
        const secretId = event.target.parentElement.getAttribute('data-id');

        removeSecret({ _id: secretId }).then(() => showSecrets(elements));
    }
}

const onAddNewClick = async (event, target, elements) => {
    if (event.target.localName !== 'button') {
        return;
    }

    const inputElements = [...target.children].filter(el => el.localName === 'input');
    const newSecret = inputElements.reduce((secret, input) => ({
        ...secret,
        [input.getAttribute('data-type')]: input.value,
    }), {});

    return addSecret(newSecret)
        .then(() => showSecrets(elements))
        .then(() => inputElements.forEach(input => input.value = ''));
};

const onAddInput = (event, target, elements) => {
    const isAllHasValue = [...target.children].every(input => {
        return input.localName === 'input' ? !!input.value : true;
    });

    elements.addButton.disabled = !isAllHasValue;
}

const options = new View({
    elements: {
        list: '#list',
        search: '#secret-search',
        add: '#add',
        addButton: '#add-button'
    },
    listeners: {
        'input@search': onSearchInput,
        'click@list': onListClick,
        'input@add': onAddInput,
        'click@add': onAddNewClick
    }
});

options.didMount(showSecrets);
