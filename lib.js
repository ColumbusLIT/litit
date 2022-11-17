import { state, clearState, loadState, persistState } from "./app/state.js";
console.log(state);
const App = () => {
  let {notes,primaryDomain,setNotes,setPrimaryDomain, setSelectedNote} = state;

  persistState();
  let titleField,
    contentField,
    presetField,
    statusField,
    countBadge,
    notesContainer,
    domainField,
    domainLink,
    formContainer;
  let PRIMARY_DOMAIN; // Unused
  let noteElements;

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
   * Renders notes in the DOM.
   * @param {Array} arr  array of note objects
   * promised by fetch in {@function netlify/functions/notes}
   */
  function renderNotes() {
    notesContainer.innerHTML = "";

    // TODO: remove data check. dev only
    if (!Array.isArray(state.notes)) {
      alert("Faulty data.");
      return;
    }
    let notes = state.notes.filter((n) => n.title.length > 0);

    let count = {
      draft: 0,
      published: 0,
      archived: 0,
    };

    // Sort by date
    notes.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    state.notes.forEach((n) => {
      if (state.domains.find((d) => d !== n.domain))
        state.domains.push(n.domain);

      switch (n.status) {
        case NOTE_STATUS.PUBLISHED:
          count.published++;
          break;
        case NOTE_STATUS.DRAFT:
          count.draft++;
          break;
        case NOTE_STATUS.ARCHIVED:
          count.archived++;
          break;
      }

      html = `<a class="notes status--${n.status}" onclick="getNote(null,${n.id})" data-edit-id="${n.id}" id="${id}">
        <div class="note-meta">
          <span class="note-title">${n.title}</span>
          <span class="note-domain">${n.domain}</span>
        </div>
        <span class="status status--${n.status}"></span>
      </a>
    `;
      notesContainer.insertAdjacentHTML("beforeend", html);
    });
    noteElements = notesContainer.querySelectorAll(".note");

    countBadge.innerText = state.notes.length;
  }

  const clearForm = () => {
    titleField.value = "";
    contentField.value = "";
    presetField.value = "default";
    domainField.value = "";
    statusField.value = "draft";
    formContainer.dataset.noteId = "";
  };

  /**
   * Catch submit form and delegate update or creation of note
   */
  const updateOrCreateNote = (e) => {
    e.preventDefault();
    const id = formContainer.dataset.noteId;
    if (id !== "") {
      updateNote();
    } else {
      createNote();
    }
  };

  /**
   * Get api request params for url
   * @param {*} params
   * @returns
   */
  const getQueryString = (params) => {
    return Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
      })
      .join("&");
  };

  /**
   * get params from form
   * @returns {NoteForm}
   */
  const getParams = () => {
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
    formContainer.dataset.noteId = note.id;
  };

  /**
   * Get note for the user logged in
   */
  const getNote = async () => {
    showAnimation();

    // active
    if (id) {
      noteElements.forEach((note) => {
        note.classList.remove("active");
      });
      e.target.classList.add("active");
    }

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
          fillForm(data);
          setSelectedNote(data);
          removeAnimation();
        });
    }
  };

  /**
   * 
   */
  const updateNote = async ()=> {
    showAnimation();

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
          getAndRenderNotes();
        }
        if (!r.ok) {
          alert(
            "Something is messed up. You could try logging out and back in."
          );
        }
      });
    }
  }

  /**
   * Get netlify user id
   * @returns {string} userId
   */
  const theUserId =() => {
    if (netlifyIdentity.currentUser() !== null) {
      const localUser = JSON.parse(localStorage.getItem("gotrue.user"));
      return localUser.id;
    } else {
      return false;
    }
  }

  /**
   * 
   */
  const getPrimaryDomain = async () => {
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
          // localStorage.setItem("litit",JSON.stringify({primaryDomain:data}));
          state.primaryDomain = data;
          persistState();
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

  function applyBodyClass(str) {
    document.querySelector("body").className = "";
    document.querySelector("body").classList.add(str);
  }

  // Initialisation
  window.addEventListener("DOMContentLoaded", (event) => {
    console.log("Initialize litit app");

    if (theUserId()) {
      console.log("user is logged in");
      applyBodyClass("logged-in");
      getAndRenderNotes();
      getPrimaryDomain();
      formContainer.addEventListener("submit", updateNote);
    } else {
      console.log("user is logged out");
      applyBodyClass("logged-out");
    }

    removeAnimation();

    titleField = document.getElementById("title");
    contentField = document.getElementById("content");
    presetField = document.getElementById("preset");
    statusField = document.getElementById("status");
    countBadge = document.getElementById("count");
    domainField = document.getElementById("domain");
    domainLink = document.getElementById("domain-link");
    formContainer = document.getElementById("form");
    notesContainer = document.getElementById("notes");

    window.netlifyIdentity.on("init", () => {
      console.log(
        "checking netlifyIdentity",
        window.netlifyIdentity.currentUser(),
        theUserId()
      );
    });

    window.netlifyIdentity.on("login", () => {
      console.log("user logged in");
      applyBodyClass("logged-in");
      getNote();
      getPrimaryDomain();
      formContainer.addEventListener("submit", updateNote);
    });

    window.netlifyIdentity.on("logout", () => {
      console.log("user logged out");
      getPrimaryDomain();
      applyBodyClass("logged-out");
    });
  });
};

// attach app to global scope
App()
window.litit = App;
