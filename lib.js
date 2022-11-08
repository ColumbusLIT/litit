let titleField,
  contentField,
  presetField,
  statusField,
  notesContainer,
  domainLink,
  formContainer;
let DOMAIN;
window.addEventListener("DOMContentLoaded", (event) => {
  titleField = document.getElementById("title");
  contentField = document.getElementById("content");
  presetField = document.getElementById("preset");
  statusField = document.getElementById("status");
  domainLink = document.getElementById("domain");
  formContainer = document.getElementById("form");
  notesContainer = document.getElementById("notes");
});

const FUNCTIONS = "/.netlify/functions";

/**
 * Renders notes in the DOM.
 * @param {Array} arr  array of note objects
 * promised by fetch in {@function netlify/functions/notes}
 */
function renderNotes(arr) {
  notesContainer.innerHTML = "";

  let notes = arr.filter((n) => n.title.length > 0);

  notes.forEach((n) => {
    let newItem = document.createElement("a");
    newItem.id = n.id;
    newItem.classList.add(`status--${n.status}`);
    newItem.setAttribute("data-edit-id", n.id);
    newItem.appendChild(document.createTextNode(n.title));
    newItem.addEventListener("click", getNote);

    notesContainer.appendChild(newItem);
  });
}

function clearForm() {
  titleField.value = "";
  contentField.value = "";
  presetField.value = "default";
  statusField.value = "draft";
  formContainer.dataset.noteId = "";
}

/**
 * Delegate
 */
function updateOrCreateNote() {
  const id = formContainer.dataset.noteId;
  if (id !== "") {
    updateNote();
  } else {
    createNote();
  }
}

function getQueryString(params) {
  return Object.keys(params)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
}

function getParams() {
  return {
    title: titleField.value.replace(/[^\w\s!?]/g, ""),
    content: contentField.value.replace(/[^\w\s!?]/g, ""),
    domain: DOMAIN,
    preset: presetField.value,
    status: statusField.value,
  };
}

/**
 * Takes text value from DOM input
 * and sends it to {@function netlify/functions/create-note} with token
 * If ok calls {@function renderNotes} otherwise alerts error
 * Zeros out DOM input
 */
async function createNote() {
  showAnimation();

  let params = getParams();
  var queryString = getQueryString(params);

  if (netlifyIdentity.currentUser() !== null) {
    await fetch(`${FUNCTIONS}/create-note?${queryString}`, {
      headers: {
        Authorization: `Bearer ${theToken()}`,
      },
    }).then((r) => {
      removeAnimation();

      if (r.ok) {
        getAndRenderNotes();
      }
      if (!r.ok) {
        alert("Something is messed up. You could try logging out and back in.");
      }
    });
  }

  clearForm();
}

/**
 * Orders the getting and rendering
 * of the users notes by calling
 * {@function netlify/functions/notes} and
 * passes result to {@function renderNotes}
 */
async function getAndRenderNotes() {
  if (netlifyIdentity.currentUser() !== null) {
    await fetch(`${FUNCTIONS}/notes`, {
      headers: {
        Authorization: `Bearer ${theToken()}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log(data)
        renderNotes(data);
      });
  }
}

function fillForm(note) {
  titleField.value = note.title;
  contentField.value = note.content;
  presetField.value = note.preset;
  statusField.value = note.status;
  formContainer.dataset.noteId = note.id;
}

async function deleteNote() {
  showAnimation();

  const id = formContainer.dataset.noteId;

  if (netlifyIdentity.currentUser() !== null) {
    await fetch(`${FUNCTIONS}/delete-note?id=${id}`, {
      headers: {
        Authorization: `Bearer ${theToken()}`,
      },
    }).then((r) => {
      removeAnimation();

      if (r.ok) {
        clearForm();
        getAndRenderNotes();
      }
      if (!r.ok) {
        alert("Something is messed up. You could try logging out and back in.");
      }
    });
  }
}

async function getNote(e) {
  showAnimation();

  const id = e.target.dataset.editId;

  if (netlifyIdentity.currentUser() !== null) {
    await fetch(`${FUNCTIONS}/note?id=${id}`, {
      headers: {
        Authorization: `Bearer ${theToken()}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        fillForm(data);
        removeAnimation();
      });
  }
}

async function updateNote() {
  showAnimation();

  const id = formContainer.dataset.noteId;
  const params = getParams();
  const queryString = getQueryString(params);
  alert(queryString)

  if (netlifyIdentity.currentUser() !== null) {
    // TODO: Add data
    await fetch(`${FUNCTIONS}/update-note?id=${encodeURIComponent(id)}&${queryString}`, {
      headers: {
        Authorization: `Bearer ${theToken()}`,
      },
    }).then((r) => {
      removeAnimation();

      if (r.ok) {
        // TODO: Clear
        getAndRenderNotes();
      }
      if (!r.ok) {
        alert("Something is messed up. You could try logging out and back in.");
      }
    });
  }
}

function theUserId() {
  if (netlifyIdentity.currentUser() !== null) {
    const localUser = JSON.parse(localStorage.getItem("gotrue.user"));
    return localUser.id;
  } else {
    return false;
  }
}

async function setDomain() {
  showAnimation();

  const id = theUserId();

  if (netlifyIdentity.currentUser() !== null) {
    await fetch(`${FUNCTIONS}/domain?id=${id}`, {
      headers: {
        Authorization: `Bearer ${theToken()}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        DOMAIN = data;
        domainLink.innerHTML = DOMAIN;
        domainLink.href = `https://${DOMAIN}`;
        getAndRenderNotes();
        removeAnimation();
      });
  }
}

function theToken() {
  if (netlifyIdentity.currentUser() !== null) {
    const localUser = JSON.parse(localStorage.getItem("gotrue.user"));
    return localUser.token.access_token;
  } else {
    return false;
  }
}

function showAnimation() {
  document.getElementById("animation").style.display = "grid";
}

function removeAnimation() {
  document.getElementById("animation").style.display = "none";
}

window.netlifyIdentity.on("init", () => {
  console.log("netlifyIdentity local object ready");
});

window.netlifyIdentity.on("login", (u) => {
  console.log("logging in a user, giving them a token, here they are: ");
  console.log(u);
  applyBodyClass("logged-in");
  setDomain();
});

window.netlifyIdentity.on("logout", () => {
  console.log("user logged out");
  applyBodyClass("logged-out");
});

applyBodyClass = (str) => {
  document.querySelector("body").className = "";
  document.querySelector("body").classList.add(str);
};

window.addEventListener("DOMContentLoaded", (event) => {
  removeAnimation();
});
