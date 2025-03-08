class AppFooter extends HTMLElement {
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

      p {
        font-size: .7rem;
        text-align: center;
        margin: 0;
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
      <div>
        <p>Notes App &copy; ${new Date().getFullYear()}</p>
        <p>Made with ❤️ by Sanudin</p>
      </div>
    `;
  }
}

customElements.define("app-footer", AppFooter);
