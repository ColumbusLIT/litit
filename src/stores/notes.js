import { writable } from "svelte/store";

export const NOTE_STATUS = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
};

function createNotes() {
  const local = JSON.parse(localStorage.getItem("notes"));

  let n = null;
  if (local) {
    n = local;
  }
  const { subscribe, set } = writable(n);

  return {
    subscribe,
    set(n) {
      set(n);
    },
    clear() {
      set([{}]);
    },
  };
}
function createSelectedNote() {
  const local = JSON.parse(localStorage.getItem("selectedNote"));

  let n = null;
  if (local) {
    n = local;
  }
  const { subscribe, set } = writable(n);

  return {
    subscribe,
    set(n) {
      set(n);
    },
    clear() {
      set(null);
    },
  };
}

export const notes = createNotes();
export const selectedNote = createSelectedNote();
