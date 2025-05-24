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
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 1000;
  }

  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 1px solid #ccc;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    color: #333;
  }

  .spinner {
    margin-right: 10px;
    width: 24px;
    height: 24px;
    border: 3px solid #ccc;
    border-top: 3px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export class loading extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        const style = document.createElement('style');
        style.textContent = styles;
        this.style.display = 'none';
        const wrapper = document.createElement('div');
        wrapper.classList.add('loader-container');
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        const text = document.createElement('span');
        text.textContent = this.textContent.trim() || "Cargando su solicitud...";
        wrapper.appendChild(spinner);
        wrapper.appendChild(text);
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }

    show(message = "Cargando su solicitud...") {
        this.shadowRoot.querySelector('span').textContent = message;
        this.style.display = 'flex';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('loading-modal', loading);