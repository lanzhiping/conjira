class View {
    constructor(props) {
        this.elements = {};

        this.initElements(props.elements);
        this.setupListeners(props.listeners);
    }

    initElements(elements) {
        Object.entries(elements).forEach(this.initElement.bind(this));
    }

    initElement([name, selector]) {
        this.elements[name] = document.querySelector(selector);
    }

    setupListeners(listeners) {
        Object.entries(listeners).forEach(this.setupListener.bind(this));
    }

    setupListener([key, listener]) {
        const [action, elementName] = key.split('@');
        const target = this.elements[elementName];

        if (target) {
            target.addEventListener(action, (event) => listener(event, target, this.elements));
        } else {
            throw `No element found named ${elementName}`;
        }
    }

    didMount(callback) {
        callback(this.elements);
    }
}

module.exports = View;