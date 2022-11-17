import { getQueryString } from "./app/util.js";
let titleField,
  contentField,
  presetField,
  statusField,
  domainField,
  domainLink,
  formContainer;

const ERRORS = {
  SessionExpired: "SesssionExpired",
  UnknownError: "UnknownError",
};

const NOTE_STATUS = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
};

const FUNCTIONS = "/.netlify/functions";

/**
 * get params from form
 * @returns {NoteForm}
 */
export const getParams = () => {
  return {
    title: titleField.value.replace(/[^\w\s!?]/g, ""),
    content: contentField.value.replace(/[^\w\s!?]/g, ""),
    domain: domainField.value,
    preset: presetField.value,
    status: statusField.value,
  };
};

/**
 * Fill form with data
 * @param {NoteForm} note
 */
const fillForm = (note) => {
  titleField.value = note.title;
  contentField.value = note.content;
  presetField.value = note.preset;
  domainField.value = note.domain;
  domainLink.href = `https://${note.domain}`;
  statusField.value = note.status;
  formContainer.dataset.noteId = note._id;
};

/**
 * Get note for the user logged in
 */
const getNote = async () => {
  showAnimation();

  // load note to form
  if (netlifyIdentity.currentUser() !== null) {
    await fetch(`${FUNCTIONS}/note`, {
      headers: {
        Authorization: `Bearer ${theToken()}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          fillForm(data);
          document.querySelector("body").classList.remove("no-note");
        } else {
          document.querySelector("body").classList.add("no-note");
          alert("Please contact your administrator to verify your account. Reload page to see result");
        }
        removeAnimation();
      });
  }
};

/**
 *
 */
const updateNote = async (e) => {
  showAnimation();
  e.preventDefault();

  const params = getParams();
  params.id = formContainer.dataset.noteId;
  const queryString = getQueryString(params);

  if (netlifyIdentity.currentUser() !== null) {
    // TODO: Add data
    await fetch(`${FUNCTIONS}/update?${queryString}`, {
      headers: {
        Authorization: `Bearer ${theToken()}`,
      },
    }).then((r) => {
      removeAnimation();

      if (r.ok) {
        // TODO: Clear
        getNote();
      }
      if (!r.ok) {
        alert("Something is messed up. You could try logging out and back in.");
      }
    });
  }
};

/**
 * Get netlify user id
 * @returns {string} userId
 */
const theUserId = () => {
  if (netlifyIdentity.currentUser() !== null) {
    const localUser = JSON.parse(localStorage.getItem("gotrue.user"));
    return localUser.id;
  } else {
    return false;
  }
};

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

function toggleBodyClass(str) {
  document.querySelector("body").classList.toggle(str);
}

// Initialisation
window.addEventListener("DOMContentLoaded", (event) => {
  console.log("Initialize litit app");
  titleField = document.getElementById("title");
  contentField = document.getElementById("content");
  presetField = document.getElementById("preset");
  statusField = document.getElementById("status");
  domainField = document.getElementById("domain");
  domainLink = document.getElementById("domain-link");
  formContainer = document.getElementById("form");

  if (theUserId()) {
    console.log("user is logged in");
    toggleBodyClass("logged-in");
    getNote();
    formContainer.addEventListener("submit", updateNote);
  } else {
    console.log("user is logged out");
    toggleBodyClass("logged-in");
  }

  removeAnimation();

  window.netlifyIdentity.on("init", () => {
    console.log(
      "checking netlifyIdentity",
      window.netlifyIdentity.currentUser(),
      theUserId()
    );
  });

  window.netlifyIdentity.on("login", () => {
    console.log("user logged in");
    toggleBodyClass("logged-in");
    getNote();
    formContainer.addEventListener("submit", updateNote);
    removeAnimation();
  });

  window.netlifyIdentity.on("logout", () => {
    console.log("user logged out");
    toggleBodyClass("logged-in");
    removeAnimation();
    location.reload(); // clear state
  });
});
