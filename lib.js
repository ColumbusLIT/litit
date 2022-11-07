let titleField, contentField, presetField, statusField, notesContainer;
let DOMAIN;
window.addEventListener("DOMContentLoaded", (event) => {
  titleField = document.getElementById("title");
  contentField = document.getElementById("content");
  presetField = document.getElementById("preset");
  statusField = document.getElementById("status");
  domainContainer = document.getElementById("domain");
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

  notes.forEach((obj) => {
    let newItem = document.createElement("li");
    newItem.id = obj.id;

    let deleteButton = document.createElement("button");
    deleteButton.addEventListener("click", deleteNote);
    deleteButton.innerHTML = "Delete";
    deleteButton.setAttribute("data-delete-id", obj.id);
    newItem.appendChild(deleteButton);

    let editButton = document.createElement("button");
    editButton.addEventListener("click", getNote);
    editButton.innerHTML = "Edit";
    editButton.setAttribute("data-edit-id", obj.id);
    newItem.appendChild(editButton);

    newItem.appendChild(document.createTextNode(obj.title));

    notesContainer.appendChild(newItem);
  });
}

/**
 * Takes text value from DOM input
 * and sends it to {@function netlify/functions/create-note} with token
 * If ok calls {@function renderNotes} otherwise alerts error
 * Zeros out DOM input
 */
async function createNote() {
  showAnimation();

  let params = {
    title: titleField.value.replace(/[^\w\s!?]/g, ""),
    content: contentField.value.replace(/[^\w\s!?]/g, ""),
    domain: "litit-demo.netlify.app",
    preset: "default",
    status: "published",
  };

  var queryString = Object.keys(params)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");

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

  titleField.value = "";
  contentField.value = "";
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
}

async function deleteNote(e) {
  showAnimation(e);

  const id = e.target.dataset.deleteId;

  if (netlifyIdentity.currentUser() !== null) {
    await fetch(`${FUNCTIONS}/delete-note?id=${id}`, {
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
}

async function getNote(e) {
  showAnimation(e);

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

async function updateNote(e) {
  showAnimation(e);

  const id = e.target.dataset.deleteId;

  if (netlifyIdentity.currentUser() !== null) {
    // TODO: Add data
    await fetch(`${FUNCTIONS}/update-note?id=${id}`, {
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
  showAnimation(e);

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
        domainContainer.innerHTML = domain;
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
  getAndRenderNotes(); // TODO only show after domain is set
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
