class AppHeader extends HTMLElement {
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

      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
      }

      div {
        display: flex;
        justify-content: center;
      }

      img {
        width: 2.3rem;
      }

      @media screen and (min-width: 576px) {
        h1 {
          font-size: 1.7rem;
        }

        img {
          width: 2.4rem;
        }
      }

      @media screen and (min-width: 768px) {
        h1 {
          font-size: 2rem;
        }

        img {
          width: 3rem;
        }

        div {
          justify-content: flex-start;
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
      <div>
        <img src="./images/note.svg" alt="NotesApp"/>
        <h1>NotesApp</h1>
      </div>
    `;
  }
}

customElements.define("app-header", AppHeader);
