const shortid = require('shortid');
const encrypt = require('./encrypt');
const decode = require('./decode');

const STORAGE_ID = 'conjira_secrets';
const CONJIRA_SECRETS = [];

const invalidSecretCache = async () => {
    CONJIRA_SECRETS.length = 0;
};

const loadSecrets = () => new Promise((resolve) => {
    if (CONJIRA_SECRETS.length > 0) {
        return resolve(CONJIRA_SECRETS);
    }

    chrome.storage.sync.get(STORAGE_ID, data => {
        if (data[STORAGE_ID]) {
            const secrets = JSON.parse(decode(STORAGE_ID)(data[STORAGE_ID]));

            CONJIRA_SECRETS.push(...secrets);
        }
        return resolve(CONJIRA_SECRETS)
    });
});

const saveSecrets = (secrets) => new Promise((resolve) => {
    const payload = {
        [STORAGE_ID]: encrypt(STORAGE_ID)(JSON.stringify(secrets))
    };

    chrome.storage.sync.set(payload, () => {
        invalidSecretCache();
        resolve(loadSecrets());
    })
});

const removeSecret = async (secretToRemoved) => {
    const secrets = await loadSecrets();
    const updatedSecrets = secrets.filter(s => s._id !== secretToRemoved._id);

    return saveSecrets(updatedSecrets);
};

const updateSecret = async (updatedSecret) => {
    const secrets = await loadSecrets();
    const updatedSecrets = secrets.map(s => s._id === updatedSecret._id ? updatedSecret : s);

    return saveSecrets(updatedSecrets);
};

const addSecret = async (newSecret) => {
    const secrets = await loadSecrets();
    newSecret._id = shortid.generate();

    return saveSecrets(secrets.concat([newSecret]));
};

const loadSecretBySearch = async (searchText) => {
    const secrets = await loadSecrets();
    const regex = new RegExp(searchText.split('')
        .map(c => `[${c.toLowerCase()}${c.toUpperCase()}]`)
        .join('')
    );

    return secrets.filter(({ name }) => regex.test(name));
};

const loadSecretById = async (id) => {
    const secrets = await loadSecrets();

    return secrets.find(s => s._id === id);
};

module.exports = {
    loadSecrets,
    saveSecrets,
    removeSecret,
    updateSecret,
    addSecret,
    loadSecretById,
    loadSecretBySearch
};