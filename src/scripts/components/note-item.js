class NoteItem extends HTMLElement {
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };
  _days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  static observedAttributes = ["bgcolor"];

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._bgColor = this.getAttribute("bgcolor");
    this._template = document
      .querySelector("template#noteItem")
      .content.cloneNode(true);
  }

  _setNoteData(template, { id, title, body, createdAt, archived }) {
    const dateCreated = new Date(createdAt);
    template.querySelector(".note-item").dataset.noteid = id;
    template
      .querySelector(".note-item")
      .classList.add(this._bgColor || "yellow");
    template.querySelector(".note-item__date-created span").textContent =
      `${dateCreated.getDate()}/${(dateCreated.getMonth() + 1).toString().padStart(2, "0")}/${dateCreated.getFullYear()}`;
    template.querySelector(".toggle-archive-status img").src =
      `./images/${archived ? "unarchive" : "archive"}.svg`;
    template.querySelector(".note-item__title").textContent = title;
    template.querySelector(".note-item__body").textContent = body;
    template.querySelector(".time").textContent =
      `${dateCreated.getHours().toString().padStart(2, "0")}:${dateCreated.getMinutes().toString().padStart(2, "0")}`;
    template.querySelector(".day").textContent =
      this._days[dateCreated.getDay()];
  }

  set note(value) {
    this._note = value;

    this.render();
  }

  get note() {
    return this._note;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "bgcolor") {
      this._bgColor = newValue;
    }
  }

  connectedCallback() {
    this._shadowRoot
      .querySelector(".delete-note")
      .addEventListener("click", (event) => this._onDeleteBtnClicked(event));
    this._shadowRoot
      .querySelector(".toggle-archive-status")
      .addEventListener("click", (event) => this._onToggleArchiveStatus(event));
  }

  disconnectedCallback() {
    this._shadowRoot
      .querySelector(".delete-note")
      .removeEventListener("click", (event) => this._onDeleteBtnClicked(event));
  }

  _onDeleteBtnClicked(event) {
    this.dispatchEvent(
      new CustomEvent("deletenote", {
        detail: this.note,
        bubbles: true,
      }),
    );
    event.preventDefault();
  }

  _onToggleArchiveStatus(event) {
    this.dispatchEvent(
      new CustomEvent("togglearchive", {
        detail: this.note,
        bubbles: true,
      }),
    );
    event.preventDefault();
  }

  render() {
    this._setNoteData(this._template, this.note);
    this._shadowRoot.appendChild(this._template);
  }
}

customElements.define("note-item", NoteItem);
