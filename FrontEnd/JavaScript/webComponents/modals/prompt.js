const styles = `
  :host {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 400px;
    text-align: center;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: #333;
    margin-bottom: 1rem;
  }

  input {
    width: 100%;
    padding: 0.75rem 0.5rem;
    border: 2px solid #c3dafe;
    border-radius: 12px;
    font-size: 1rem;
    margin-bottom: 1.5rem;
    text-align: center;
    outline: none;
    box-sizing: border-box;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  button {
    padding: 0.5rem 1.25rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
  }

  button.confirm {
    background-color: #7066e0;
    color: white;
  }

  button.cancel {
    background-color: #6c757d;
    color: white;
  }
`;

export class PromptModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('modal');

    this.titleEl = document.createElement('h2');
    this.textEl = document.createElement('p');
    this.inputEl = document.createElement('input');
    this.inputEl.setAttribute('placeholder', 'Introduce un valor');
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.resolve(this.inputEl.value);
        this.hide();
      }
    });
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.resolve(null);
        this.hide();
      }
    });
    const actions = document.createElement('div');
    actions.classList.add('actions');
    const confirmBtn = document.createElement('button');
    confirmBtn.classList.add('confirm');
    confirmBtn.textContent = 'Aceptar';
    confirmBtn.addEventListener('click', () => {
      this.resolve(this.inputEl.value);
      this.hide();
    });
    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('cancel');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.addEventListener('click', () => {
      this.resolve(null);
      this.hide();
    });

    actions.appendChild(confirmBtn);
    actions.appendChild(cancelBtn);

    this.wrapper.appendChild(this.titleEl);
    this.wrapper.appendChild(this.textEl);
    this.wrapper.appendChild(this.inputEl);
    this.wrapper.appendChild(actions);

    this.shadowRoot.append(style, this.wrapper);
  }

  show({ title = '', text = '', placeholder = '' }) {
    this.titleEl.textContent = title;
    this.textEl.textContent = text;
    this.inputEl.placeholder = placeholder;
    this.style.display = 'flex';

    requestAnimationFrame(() => {
      this.inputEl.focus();
    });

    return new Promise(resolve => {
      this.resolve = resolve;
    });
  }

  hide() {
    this.style.display = 'none';
    this.inputEl.value = '';
  }
}

customElements.define('prompt-modal', PromptModal);
