const styles = `
  :host {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1500;
    font-family: Arial, sans-serif;
  }

  .modal {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  }

  .modal h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
  }

  .modal p {
    color: #444;
    margin-bottom: 1rem;
  }

  input {
    width: 90%;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
    display: block;
    padding: 12px;
    margin-top: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  button {
    padding: 10px 20px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
  }

  .confirm {
    background-color: #7c5dfa;
    color: white;
  }

  .confirm:hover {
    background-color: #6849da;
  }

  .cancel {
    background-color: #6c757d;
    color: white;
  }

  .cancel:hover {
    background-color: #5a6268;
  }
`;

class ChangePasswordModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const style = document.createElement('style');
        style.textContent = styles;

        const container = document.createElement('div');
        container.className = 'modal';
        container.innerHTML = `
      <h3>Confirm your new password</h3>
      <p>Enter and repeat your new password</p>
      <input id="input1" type="password" placeholder="New password" />
      <input id="input2" type="password" placeholder="Repeat password" />
      <div class="button-group">
        <button class="confirm" id="confirm">Confirm</button>
        <button class="cancel" id="cancel">Cancel</button>
      </div>
    `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);

        this.input1 = this.shadowRoot.querySelector('#input1');
        this.input2 = this.shadowRoot.querySelector('#input2');
        this.confirmButton = this.shadowRoot.querySelector('#confirm');

        this.confirmButton.addEventListener('click', () => {
            const val1 = this.input1.value.trim();
            const val2 = this.input2.value.trim();

            if (val1 === '' || val2 === '') {
                this._reject('empty');
            } else if (val1.length < 8 || val2.length < 8) {
                this._reject('too_short');
            } else if (val1 !== val2) {
                this._reject('mismatch');
            } else {
                this.hide();
                this._resolve(val1);
            }
        });

        this.cancelButton = this.shadowRoot.querySelector('#cancel');
        this.cancelButton.addEventListener('click', () => {
            this.hide();
            this._reject('cancel');
        });
    }

    show() {
        this.style.display = 'flex';
        this.input1.value = '';
        this.input2.value = '';

        requestAnimationFrame(() => {
            this.input1.focus();
        });

        const handleKeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.confirmButton.click();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.cancelButton.click();
            }
        };

        this.input1.addEventListener('keydown', handleKeydown);
        this.input2.addEventListener('keydown', handleKeydown);

        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('change-password-modal', ChangePasswordModal);