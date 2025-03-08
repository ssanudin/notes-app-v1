import Swal from "sweetalert2";
import Utils from "./Utils";

class NotesManager {
  _BASEURL = "https://notes-api.dicoding.dev/v2";
  _notifResult = Swal.mixin({
    showConfirmButton: false,
    showCloseButton: true,
    timer: 2500,
    timerProgressBar: true,
    didOpen: () => {
      Swal.hideLoading();
    },
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
    },
  });
  _actionLoading = Swal.mixin({
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
    },
  });

  constructor(currentDisplay) {
    this._notes = [];
    this._bgColors = {};
    this._currentDisplay = currentDisplay;
    this._errorGetNotes = false;
  }

  set currentDisplay(value) {
    this._currentDisplay = value;
  }

  get currentDisplay() {
    return this._currentDisplay;
  }

  set notes(value) {
    this._notes = value;
  }

  get notes() {
    return this._notes;
  }

  async getNotes() {
    try {
      Utils.showLoading();
      const response = await fetch(
        `${this._BASEURL}/notes${this.currentDisplay === "archived" ? "/archived" : ""}`,
      );
      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        this._errorGetNotes = true;
        throw responseJson.message;
      }

      this._errorGetNotes = false;
      this.notes = responseJson.data;
    } catch (error) {
      console.error(`Error getting notes: ${error}`);

      this._notifResult.fire({
        icon: "error",
        title: "Error getting notes",
        text: error,
      });
    } finally {
      Utils.hideLoading();
    }
  }

  async getNoteById(id) {
    try {
      if (!id) {
        throw "Invalid ID";
      }

      const response = await fetch(`${this._BASEURL}/notes/${id}`);
      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw responseJson.message;
      }

      return responseJson.data;
    } catch (error) {
      console.error(`Error getting note: ${error}`);
      return null;
    }
  }

  async createNewNote(title, body, bgColor) {
    try {
      this._actionLoading.fire({
        html: `<img src="./images/add.svg" class="icon-loading" alt="Membuat catatan"/><br>Membuat catatan baru...`,
      });

      if (!title || !body) {
        throw "Judul dan isi catatan harus diisi";
      }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      };

      const response = await fetch(`${this._BASEURL}/notes`, options);
      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw `Error creating note: ${responseJson.message}`;
      }

      this._notifResult.fire({
        icon: "success",
        title: "Catatan berhasil dibuat",
      });
      this._bgColors[responseJson.data.id] = bgColor;

      return responseJson.data;
    } catch (error) {
      console.error(error);

      this._notifResult.fire({
        icon: "error",
        title: error,
      });

      return null;
    }
  }

  async toggleArchiveStatus(noteId, currentArchiveStatus) {
    try {
      if (!noteId) {
        throw "Invalid ID";
      }
      if (![false, true].includes(currentArchiveStatus)) {
        throw "Invalid archive status";
      }

      const response = await fetch(
        `${this._BASEURL}/notes/${noteId}/${currentArchiveStatus ? "unarchive" : "archive"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw `Error updating note: ${responseJson.message}`;
      }

      return responseJson;
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: error,
      };
    }
  }

  async deleteNote(noteId) {
    try {
      if (!noteId) {
        throw "Invalid ID";
      }

      const response = await fetch(`${this._BASEURL}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseJson = await response.json();

      if (responseJson.status !== "success") {
        throw `Error deleting note: ${responseJson.message}`;
      }

      return responseJson.message;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async displayNotes(updateData = false) {
    const notesListElement = document.querySelector("note-list");
    Utils.emptyElement(notesListElement);
    notesListElement.setAttribute("display", this.currentDisplay);

    if (this.notes.length === 0 || updateData) {
      await this.getNotes();
    }

    let noteItemsElements = this.notes.map((note) => {
      const noteItemElement = document.createElement("note-item");
      noteItemElement.setAttribute(
        "bgcolor",
        this._bgColors[note.id] ?? "yellow",
      );
      noteItemElement.note = note;

      noteItemElement.removeEventListener("deletenote", (event) => {
        this.#handleDeleteNote(event);
      });
      noteItemElement.addEventListener("deletenote", (event) => {
        this.#handleDeleteNote(event);
      });
      noteItemElement.removeEventListener("togglearchive", (event) => {
        this.#handleArchiveStatus(event);
      });
      noteItemElement.addEventListener("togglearchive", (event) => {
        this.#handleArchiveStatus(event);
      });

      return noteItemElement;
    });

    if (noteItemsElements.length <= 0) {
      const noNotesElement = document.createElement("no-notes");
      if (this._errorGetNotes) {
        noNotesElement.textContent = "-No notes: Gagal mengambil catatan.-";
      }
      noteItemsElements = [noNotesElement];
    }

    notesListElement.append(...noteItemsElements);
  }

  async #handleDeleteNote(event) {
    const note = event.detail;

    let confirmDelete = await Swal.fire({
      title: `Hapus catatan "${note.title}"?`,
      text: "Catatan yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus!",
      cancelButtonText: "Batal",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
      },
    });

    if (!confirmDelete.isConfirmed) {
      return;
    }

    this._actionLoading.fire({
      html: `<img src="./images/delete.svg" class="icon-loading" alt="Menghapus catatan"/><br>Menghapus catatan "${note.title}"...`,
    });

    const deleteNoteResult = await this.deleteNote(note.id);
    if (deleteNoteResult === null) {
      this._notifResult.fire({
        icon: "error",
        title: "Gagal menghapus catatan",
      });
      return;
    }

    if (this._bgColors[note.id]) {
      delete this._bgColors[note.id];
    }
    this.displayNotes(true);

    this._notifResult.fire({
      icon: "success",
      title: "Catatan berhasil dihapus",
    });
  }

  async #handleArchiveStatus(event) {
    const note = event.detail;

    let archivedText = note.archived ? "Membuka arsip" : "Mengarsipkan";
    let archivedIcon = note.archived ? "unarchive.svg" : "archive.svg";

    this._actionLoading.fire({
      html: `<img src="./images/${archivedIcon}" class="icon-loading" alt="Status arsip catatan"/><br>${archivedText} catatan "${note.title}"...`,
    });

    const archiveNoteResult = await this.toggleArchiveStatus(
      note.id,
      note.archived,
    );

    if (archiveNoteResult.status === "error") {
      this._notifResult.fire({
        icon: "error",
        title: `Gagal ${note.archived ? "membuka arsip" : "mengarsipkan"} catatan\n${archiveNoteResult.message}`,
      });
    }

    this.displayNotes(true);

    this._notifResult.fire({
      icon: "success",
      title: `Catatan berhasil di${note.archived ? "buka dari arsip" : "arsipkan"}`,
    });
  }
}

export default NotesManager;
