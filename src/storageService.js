const shortid = require('shortid');

const STORAGE_ID = 'conjira_secrets';
const CONJIRA_SECRETS = [];

const loadSecrets = (searchText) => new Promise((resolve) => {
    if (CONJIRA_SECRETS.length > 0) {
        if (searchText) {
            const regex = searchText.split('')
                .filter(c => !!c)
                .map(c => `[${c.toLowerCase()}${c.toUpperCase()}]`)
                .join('');
            const filtered = CONJIRA_SECRETS
                .filter(({ name }) => new RegExp(regex).test(name));
            return resolve(filtered);
        }

        return resolve(CONJIRA_SECRETS);
    }

    chrome.storage.sync.get(STORAGE_ID, data => {
        if (data[STORAGE_ID].length > 0) {
            data[STORAGE_ID].forEach(secret => CONJIRA_SECRETS.push(secret))
        }
        return resolve(CONJIRA_SECRETS)
    });
});

const invalidSecretCache = async () => {
    CONJIRA_SECRETS.length = 0;
}

const saveSecrets = (secrets) => new Promise((resolve) => {
    console.log('save: ', secrets)
    chrome.storage.sync.set({ [STORAGE_ID]: secrets }, () => {
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
}

const addSecret = async (newSecret) => {
    const secrets = await loadSecrets();
    newSecret._id = shortid.generate();

    return saveSecrets(secrets.concat([newSecret]));
}

const loadSecretById = async (id) => {
    const secrets = await loadSecrets();

    return secrets.find(s => s._id === id);
}

module.exports = {
    loadSecrets,
    saveSecrets,
    removeSecret,
    updateSecret,
    addSecret,
    loadSecretById
};