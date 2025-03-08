class AddNoteForm extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.render();
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        width: 100%;
        max-width: 600px;
        border-radius: 1rem;
        border: 2px solid var(--bgcolor) !important;
        padding: 1.5rem !important;
        margin: 0 auto !important;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15), 0 2px 0 rgba(0, 0, 0, 0.1);
      }

      input, textarea, select, button {
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        font-family: "Inter", sans-serif;
        border: 0;
      }
      
      input, textarea, select {
        border-radius: 1rem;
        padding: 1rem;
        margin: .5rem 0;
      }

      select {
        margin: 0;
        text-align: center;
        cursor: pointer;
      }

      input, textarea {
        font-size: 1.25rem;
        font-family: 'Inter', sans-serif;
      }

      textarea {
        resize: vertical;
      }

      input:focus-visible, textarea:focus-visible, select:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px var(--accentcolor);
        transition: all 150ms linear;
      }

      label:has(+ input:focus-visible, + textarea:focus-visible) {
        font-weight: 700;
      }

      input:focus-visible + .form-control-hint, textarea:focus-visible + .form-control-hint {
        font-style: italic;
      }

      input:invalid + .form-control-hint, textarea:invalid + .form-control-hint {
        color: var(--rednote);
      }

      .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
      }

      .add-note__btn {
        display: block;
        background-color: var(--fontcolor);
        color: var(--bgcolor);
        font-size: 1rem;
        padding: 1rem 2rem;
        border-radius: .8rem;
        width: 100%;
        cursor: pointer;
        white-space: nowrap;
        margin-top: 3rem;
        transition: all 150ms linear;
      }

      .add-note__btn:hover {
        scale: 1.1;
        box-shadow: 0 0.25rem .8rem rgba(0, 0, 0, 0.15);
      }

      .add-note__btn:active {
        scale: 1.005;
      }

      .yellow {
        background-color: var(--yellownote);
      }

      .red {
        background-color: var(--rednote);
      }

      .blue {
        background-color: var(--bluenote);
      }

      @media screen and (min-width: 576px) {
        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 3rem;
        }

        .form-footer .form-group {
          width: max-content;
          margin: 0;
        }

        .add-note__btn {
          margin: 0;
          width: fit-content;
        }

        select {
          text-align: left;
        }
      }
    `;
  }

  connectedCallback() {
    this._shadowRoot
      .querySelector("#item-bgcolor")
      .addEventListener("change", (event) => this._onBgColorChange(event));

    const inputElements = this._shadowRoot.querySelectorAll(".add-note__input");
    inputElements.forEach((inputElement) => {
      inputElement.addEventListener("change", (event) =>
        this._handleInputEvent(event),
      );
      inputElement.addEventListener("input", (event) =>
        this._handleInputEvent(event),
      );
      inputElement.addEventListener("invalid", (event) =>
        this._handleInputEvent(event),
      );
      inputElement.addEventListener("blur", (event) =>
        this._handleInputEvent(event),
      );
    });

    this._shadowRoot
      .querySelector("form")
      .addEventListener("submit", (event) => this._onFormSubmit(event, this));
    this.addEventListener("submit", this._onAddNote);
  }

  disconnectedCallback() {
    this._shadowRoot
      .querySelector("#item-bgcolor")
      .removeEventListener("change", (event) => this._onBgColorChange(event));

    const inputElements = this._shadowRoot.querySelectorAll(".add-note__input");
    inputElements.forEach((inputElement) => {
      inputElement.removeEventListener("change", (event) =>
        this._handleInputEvent(event),
      );
      inputElement.removeEventListener("input", (event) =>
        this._handleInputEvent(event),
      );
      inputElement.removeEventListener("invalid", (event) =>
        this._handleInputEvent(event),
      );
      inputElement.removeEventListener("blur", (event) =>
        this._handleInputEvent(event),
      );
    });

    this._shadowRoot
      .querySelector("form")
      .removeEventListener("submit", (event) =>
        this._onFormSubmit(event, this),
      );
    this.removeEventListener("submit", this._onAddNote);
  }

  _handleInputEvent(event) {
    event.target.setCustomValidity("");
    const hintElementId = event.target.getAttribute("aria-describedby");
    const hintElement = hintElementId
      ? this._shadowRoot.querySelector(`#${hintElementId} b`)
      : null;

    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity("Tidak boleh kosong.");

      const errorMessage = event.target.validationMessage;
      if (hintElement) {
        hintElement.innerText = errorMessage ?? "";
      }

      return;
    }

    if (event.target.validity.tooShort) {
      event.target.setCustomValidity(
        `Isi dengan minimal ${event.target.getAttribute("minlength")} huruf.`,
      );

      const errorMessage = event.target.validationMessage;
      if (hintElement) {
        hintElement.innerText = errorMessage ?? "";
      }

      return;
    }

    if (event.target.validity.valid && hintElement) {
      hintElement.innerText = "";
    }
  }

  _onBgColorChange(event) {
    const selectedColor = event.target.value || "yellow";
    event.target.setAttribute("class", selectedColor);
  }

  _onFormSubmit(event, formInstance) {
    formInstance.dispatchEvent(new CustomEvent("submit"));
    event.preventDefault();
  }

  _onAddNote() {
    const noteTitle = this._shadowRoot.querySelector("#title").value;
    const noteBody = this._shadowRoot.querySelector("#note").value;
    const bgColor =
      this._shadowRoot.querySelector("#item-bgcolor").value ?? "yellow";

    if (!noteTitle || !noteBody) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent("addnote", {
        detail: {
          title: noteTitle,
          body: noteBody,
          bgColor: bgColor,
        },
        bubbles: true,
      }),
    );

    this._shadowRoot.querySelector("#title").value = "";
    this._shadowRoot.querySelector("#note").value = "";
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <form class="add-note__form">
        <div class="form-group">
          <label for="title">Judul</label>
          <input id="title" type="text" name="title" class="add-note__input" minlength="3" autocomplete="off" required aria-describedby="title-hint"/>
          <span id="title-hint" class="form-control-hint">Judul catatan baru, minimal 3 huruf. <b></b></span>
        </div>
        <div class="form-group">
          <label for="note">Catatan</label>
          <textarea id="note" name="note" class="add-note__input" minlength="7" autocomplete="off" required aria-describedby="content-hint"></textarea>
          <span id="content-hint" class="form-control-hint">Isi catatan, minimal 7 huruf. <b></b></span>
        </div>
        <div class="form-footer">
          <div class="form-group">
            <select name="item-bgcolor" id="item-bgcolor" class="yellow">
              <option value="yellow" class="yellow" selected>Background Kuning</option>
              <option value="blue" class="blue">Background Biru</option>
              <option value="red" class="red">Background Merah</option>
            </select>
          </div>
          <button type="submit" class="add-note__btn">Tambah Catatan</button>
        </div>
      </form>
    `;
  }
}

customElements.define("add-note-form", AddNoteForm);
