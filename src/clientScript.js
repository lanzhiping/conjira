const clientScript = (salt, encrypted) => `
    (() => {
        const decipher = (salt) => {
            const textToChars = text => text.split('').map(c => c.charCodeAt(0));
            const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
            return encoded => encoded.match(/.{1,2}/g)
                .map(hex => parseInt(hex, 16))
                .map(applySaltToChar)
                .map(charCode => String.fromCharCode(charCode))
                .join('');
        };
        const getInputs = () => {
            const username = [...document.querySelectorAll('input[type=text]')]
                .find(e => /(user[Nn]ame|login)/.test(e.getAttribute('name')));
            const pwd = [...document.querySelectorAll('input[type=password]')]
                .find(e => /password/.test(e.getAttribute('name')));
            return { username, pwd };
        };
        const { username, pwd } = getInputs();
        if (username && pwd) {
            username.value = JSON.parse(decipher('${salt}')('${encrypted}')).account;
            pwd.value = JSON.parse(decipher('${salt}')('${encrypted}')).password;
        }
    })()
`;

module.exports = clientScript;
