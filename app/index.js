import { getQueryString, initChangeDetection } from "./util.js";
let titleField,
  contentField,
  presetField,
  statusField,
  domainField,
  domainLink,
  messageContainer,
  formContainer;

const ERRORS = {
  SessionExpired: "SesssionExpired",
  UnknownError: "UnknownError",
  Unauthorized: "Unauthorized",
  AccessDenied: "AccessDenied",
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
  formContainer.dataset.noteStatus = note.status;
  initChangeDetection(formContainer)
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
        if (response.status === 200) {
          return response.json();
        }
        /* Errors */
        if (response.status === 403) {
          throw new Error(ERRORS.AccessDenied);
        }
        if (response.status === 401) {
          throw new Error(ERRORS.Unauthorized);
        } else {
          console.error(JSON.stringify(response));
          throw new Error(ERRORS.UnknownError);
        }
      })
      .then((data) => {
        console.log(data);
        if (data) {
          fillForm(data);
          document.querySelector("body").classList.remove("no-note");
        } else {
          document.querySelector("body").classList.add("no-note");
          messageContainer.innerHTML = `<p>Please contact our <a href="mailto:support@lit-it.at">support team</a> to verify your account. Or try to reload this page.</p><img src="images/illustration-contact-us.svg" alt="contact us" />`;
        }
      })
      .catch((error) => {
        document.querySelector("body").classList.add("litit--no-notes");
        if (
          error.message === ERRORS.SessionExpired ||
          error.message === ERRORS.Unauthorized
        ) {
          messageContainer.innerHTML = `<h2>Session expired.</h2> <p>Login again, please.</p><img src="images/illustration-sunset.svg" alt="logout" />`;
          setTimeout(() => window.netlifyIdentity.logout(), 2000);
        }
        if (error.message === ERRORS.UnknownError) {
          messageContainer.innerHTML = `<h2>An unknown occured.</h2> <p>Try reloading the page or login out and in again.</p><img src="images/illustration-massage.svg" alt="Unknown error." />`;
          alert(
            "Unknown Error. Try reloading the page or login out and in again."
          );
        }
      })
      .finally(() => {
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
  messageContainer = document.getElementById("message");

  if (theUserId()) {
    console.log("user is logged in");
    document.querySelector("body").classList.add("logged-in");
    getNote();
    formContainer.addEventListener("submit", updateNote);
  } else {
    console.log("user is logged out");
    document.querySelector("body").classList.remove("logged-in");
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
