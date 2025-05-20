class SuccessModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const styles = `
          :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            align-items: center;
            justify-content: center;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 1000;
            font-family: Arial, sans-serif;
          }

          .modal {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          }

          h2 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
          }

          .checkmark-circle {
            width: 100px;
            height: 100px;
            background-color: #00a88e;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            margin-bottom: 1.5rem;
          }

          .checkmark {
            color: white;
            font-size: 50px;
          }
        `;

        const style = document.createElement('style');
        style.textContent = styles;

        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('modal');
        this.style.display = 'none';

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        this.titleElement = document.createElement('h2');
        this.titleElement.textContent = 'Action completed';

        const checkmarkCircle = document.createElement('div');
        checkmarkCircle.classList.add('checkmark-circle');

        const checkmark = document.createElement('span');
        checkmark.classList.add('checkmark');
        checkmark.textContent = '✓';

        checkmarkCircle.appendChild(checkmark);
        modalContent.appendChild(this.titleElement);
        modalContent.appendChild(checkmarkCircle);
        this.wrapper.appendChild(modalContent);

        this.shadowRoot.append(style, this.wrapper);
    }


    show(title = '') {
        this.titleElement.textContent = title;
        this.style.display = 'flex';
    }

    hide() {
        this.style.display = 'none';
    }
}

customElements.define('successful-modal', SuccessModal);