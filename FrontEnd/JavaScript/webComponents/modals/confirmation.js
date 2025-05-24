const styles = `
  .backdrop {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1500;
    font-family: Arial, sans-serif;
  }

  .modal {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    max-width: 320px;
    width: 90%;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  }

  .modal h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
  }

  .cancel {
    background-color: #6c757d;
    color: white;
  }

  .confirm {
    background-color: #6f42c1;
    color: white;
  }

  .hidden {
    display: none !important;
  }
`;

class ConfirmationModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        const wrapper = document.createElement('div');
        wrapper.className = 'backdrop';
        wrapper.classList.add('hidden');
        this.wrapper = wrapper;

        const style = document.createElement('style');
        style.textContent = styles;

        const modal = document.createElement('div');
        modal.className = 'modal';

        const title = document.createElement('h3');
        this.titleEl = title;

        const buttons = document.createElement('div');
        buttons.className = 'modal-buttons';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => {
            if (typeof this.cancelCallback === 'function') {
                this.cancelCallback();
            }
        };

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'confirm';
        confirmBtn.textContent = 'Confirm';
        confirmBtn.onclick = () => {
            if (typeof this.confirmCallback === 'function') {
                this.confirmCallback();
            }
        };

        buttons.appendChild(cancelBtn);
        buttons.appendChild(confirmBtn);

        modal.appendChild(title);
        modal.appendChild(buttons);

        wrapper.appendChild(modal);
        this.shadowRoot.append(style, wrapper);
    }

    show(title = 'Are you sure?') {
        this.wrapper.classList.remove('hidden');
        return new Promise((resolve, reject) => {
            this.titleEl.textContent = title;

            this.confirmCallback = () => {
                resolve();
                this.cleanup();
            };
            this.cancelCallback = () => {
                reject();
                this.cleanup();
            };

            if (!document.body.contains(this)) {
                document.body.appendChild(this);
            }
        });
    }

    cleanup() {
        this.confirmCallback = null;
        this.cancelCallback = null;
        this.wrapper.classList.add('hidden');
    }
}

customElements.define('confirmation-modal', ConfirmationModal);