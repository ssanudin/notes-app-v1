class SidebarMenu extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
        padding-top: 0 !important;
      }

      aside {
        position: sticky;
        top: 0;
        margin-bottom: 1rem;
      }

      nav ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: space-around;
      }
        
      .menu {
        text-decoration: none;
        color: var(--fontcolor);
        padding: 1rem;
        font-size: .8rem;
        text-align: center;
        position: relative;
        border-radius: 2rem;

        display: flex;
        justify-content: center;
        align-items:center;
        flex-direction: column;

        transition: all 150ms linear;
        opacity: 0.7;
      }

      .menu::after {
        content: attr(tooltip);
        font-size: .7rem;
        font-weight: 400;
        position: absolute;
        bottom: -40%;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--fontcolor);
        color: #fff;
        padding: .5rem;
        border-radius: .25rem;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
      }

      .menu img {
        width: 1.8rem;
        margin-bottom: .25rem;
      }

      .menu:hover {
        background-color: var(--bluenote);
        font-size: 1rem;
        font-weight: 600;
        opacity: 1;
      }

      .menu:active {
        font-size: .7rem;
      }

      .menu:hover::after {
        opacity: 1;
      }

      .menu:hover img {
        scale: 1.2;
      }

      .menu:active img {
        scale: .9;
      }

      @media screen and (min-width: 768px) {
        nav ul {
          flex-direction: column;
        }
          
        .menu {
          justify-content: center;
          align-items:center;
          flex-direction: column;
        }

        .menu::after {
          bottom: 110%;
        }

        .menu img {
          width: 2rem;
          margin-bottom: .25rem;
        }
      }
    `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  connectedCallback() {
    const menuElements = this._shadowRoot.querySelectorAll(".menu");
    menuElements.forEach((menuElement) => {
      menuElement.addEventListener("click", (event) =>
        this._onMenuBtnClicked(event),
      );
    });
  }

  disconnectedCallback() {
    const menuElements = this._shadowRoot.querySelectorAll(".menu");
    menuElements.forEach((menuElement) => {
      menuElement.removeEventListener("click", (event) =>
        this._onMenuBtnClicked(event),
      );
    });
  }

  _onMenuBtnClicked(event) {
    this.dispatchEvent(
      new CustomEvent("menuclicked", {
        detail: event.currentTarget.id,
        bubbles: true,
      }),
    );
    event.preventDefault();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <aside>
        <nav>
            <ul>
                <li><a href="#add-note" id="add-note" class="menu" tooltip="Tambah catatan baru">
                  <img src="./images/add.svg" alt="Buat catatan baru"/>Tambah catatan
                </a></li>
                <li><a href="#notes" id="notes" class="menu" tooltip="Daftar catatan saya">
                  <img src="./images/note.svg" alt="Daftar catatan"/>Catatan saya
                </a></li>
                <li><a href="#archived" id="archived" class="menu" tooltip="Catatan yang diarsipkan">
                  <img src="./images/archived.svg" alt="Arsip catatan"/>Arsip catatan
                </a></li>
            </ul>
        </nav>
      </aside>
    `;
  }
}

customElements.define("sidebar-menu", SidebarMenu);
