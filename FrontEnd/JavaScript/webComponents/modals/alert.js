const styles = `
  :host {
    position: fixed;
    top: 20px;
    right: 20px;
    display: none;
    z-index: 2000;
    max-width: 300px;
  }

  .alert-container {
    background-color: white;
    border-radius: 12px;
    padding: 24px 32px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
    color: #333;
    max-width: 90%;
    text-align: center;
    border-left: 6px solid var(--accent-color, #007bff);
  }

  .alert-container.success {
    --accent-color: #28a745;
  }

  .alert-container.error {
    --accent-color: #dc3545;
  }

  .alert-message {
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }

  .close-button {
    margin-top: 1rem;
    padding: 8px 16px;
    border: none;
    background-color: var(--accent-color, #007bff);
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
`;

export class AlertMessage extends HTMLElement {
    static get observedAttributes() {
        return ['type'];
    }

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        const style = document.createElement('style');
        style.textContent = styles;
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'alert-container';
        this.messageElement = document.createElement('div');
        this.messageElement.className = 'alert-message';
        this.messageElement.textContent = this.textContent.trim() || 'Mensaje';
        this.wrapper.appendChild(this.messageElement);
        shadow.appendChild(style);
        shadow.appendChild(this.wrapper);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'type' && this.wrapper) {
            this.wrapper.classList.remove('success', 'error');
            if (newValue) {
                this.wrapper.classList.add(newValue);
            }
        }
    }

    setMessage(msg) {
        this.messageElement.innerHTML = msg;
    }

    show(message = 'Alert', duration = 3000) {
        this.setMessage(message);
        this.style.display = 'flex';
        setTimeout(() => this.hide(), duration);
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('alert-message', AlertMessage);