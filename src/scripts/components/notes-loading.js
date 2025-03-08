class NotesLoading extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
      }

      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
      }

      .loading::after {
        content: "Mengambil catatan...";
        margin-top: 1rem;
      }

      .loading::before {
        content: "";
        display: block;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: 4px solid;
        border-color: var(--accentcolor) rgba(0, 0, 0, 0);
        animation: rotate-loading 1.5s linear 0s infinite normal;
      }

      @keyframes rotate-loading {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
        <div class="loading"></div>
      `;
  }
}

customElements.define("notes-loading", NotesLoading);
