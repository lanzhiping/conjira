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
            const username = [...document.querySelectorAll('input[type=text],input[type=email]')]
                .find(e => /([Uu]ser[Nn]ame|[Ll]ogin)/.test(e.getAttribute('name')));
            const pwd = [...document.querySelectorAll('input[type=password]')]
                .find(e => /[Pp]assword/.test(e.getAttribute('name')));
            return { username, pwd };
        };
        const triggerInputEvent = (element) => {
            const inputEvent = new Event('input', { bubbles: true, cancelable: true });
            const changeEvent = new Event('change', { bubbles: true, cancelable: true });
            element.dispatchEvent(inputEvent);
            element.dispatchEvent(changeEvent);
        };
        const { username, pwd } = getInputs();
        if (username) {
            username.value = '';
            setTimeout(() => {
                username.value = JSON.parse(decipher('${salt}')('${encrypted}')).account;
                triggerInputEvent(username);
            }, 200);
        }
        if (pwd) {
            pwd.value = '';
            setTimeout(() => {
                pwd.value = JSON.parse(decipher('${salt}')('${encrypted}')).password;
                triggerInputEvent(pwd);
            }, 200);
        }
    })();
`;

module.exports = clientScript;
