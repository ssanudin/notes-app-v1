import NotesManager from "./scripts/NotesManager.js";
import Utils from "./scripts/Utils.js";
import "./scripts/components/index.js";
import "animate.css";
import "./styles/styles.css";

document.addEventListener("DOMContentLoaded", async () => {
  let currentDisplayNotes = "non-archived";
  const myNotes = new NotesManager(currentDisplayNotes);
  await myNotes.displayNotes();

  document
    .querySelector("add-note-form")
    .addEventListener("addnote", async (event) => {
      event.preventDefault();
      const { title, body, bgColor } = event.detail;

      const newNote = await myNotes.createNewNote(title, body, bgColor);
      if (newNote) {
        await myNotes.displayNotes(true);
      }
    });

  document
    .querySelector("sidebar-menu")
    .addEventListener("menuclicked", async (event) => {
      event.preventDefault();
      const menu = event.detail;
      const addNoteContainer = document.querySelector(".add-note-container");
      const notesContainer = document.querySelector(".notes-container");
      let updateData = true;

      switch (menu) {
        case "add-note":
          Utils.scrollTo("top");
          Utils.showElement(addNoteContainer);
          Utils.animateCss(addNoteContainer, "fadeInDown");
          if (myNotes.currentDisplay === "archived") {
            myNotes.currentDisplay = "non-archived";
          } else {
            updateData = false;
          }
          break;
        case "notes":
          Utils.scrollTo(notesContainer);
          myNotes.currentDisplay = "non-archived";
          break;
        case "archived":
          Utils.hideElement(addNoteContainer);
          myNotes.currentDisplay = "archived";
          break;
        default:
          myNotes.currentDisplay = "non-archived";
          break;
      }

      await myNotes.displayNotes(updateData);
    });

  document
    .querySelector(".close-add-note-form")
    .addEventListener("click", async (event) => {
      const addNoteContainer = document.querySelector(".add-note-container");
      await Utils.animateCss(addNoteContainer, "fadeOutUp");
      Utils.hideElement(addNoteContainer);
    });
});
