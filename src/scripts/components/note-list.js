class NoteList extends HTMLElement {
  _displayText = {
    "non-archived": "Catatan saya",
    archived: "Arsip catatan",
  };

  static observedAttributes = ["display", "loading"];

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._display = "non-archived";
    this._loading = "show";
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
      }

      .list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.2rem;
      }

      .section-note-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin:  0 0 2rem;
        padding-bottom: 1rem;
        text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
        border-bottom: 1px dashed var(--fontcolor);
      }

      @media screen and (min-width: 576px) {
        .list {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
        .section-note-title {
          font-size: 1.8rem;
        }
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "display") {
      this._display = newValue;
    } else if (name === "loading") {
      this._loading = newValue;
    }

    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    const displayText = this._displayText[this._display];

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <h2 class="section-note-title">${displayText} <img src="./images/${this._display === "archived" ? "archived" : "note"}.svg" alt="${displayText}"/></h2>
      ${this._loading === "show" ? `<notes-loading></notes-loading>` : ""}
      <div class="list">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define("note-list", NoteList);
