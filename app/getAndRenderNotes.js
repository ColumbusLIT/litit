/**
 * Orders the getting and rendering
 * of the users notes by calling
 * {@function netlify/functions/notes} and
 * passes result to {@function renderNotes}
 */
export const getAndRenderNotes = async () => {
  showAnimation();
  document.querySelector("body").classList.add("litit--no-notes");

  if (netlifyIdentity.currentUser() !== null) {
    await fetch(`${FUNCTIONS}/notes`, {
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
        } else {
          console.log(JSON.stringify(response));
          throw new Error(ERRORS.UnknownError);
        }
      })
      .then((data) => {
        if (data.length !== 0) {
          state.setNotes(data);
          persistState();
          renderNotes();
          document.querySelector("body").classList.remove("litit--no-notes");
        } else {
          countBadge.innerText = 0;
        }
      })
      .catch((error) => {
        document.querySelector("body").classList.add("litit--no-notes");
        if (error === ERRORS.SessionExpired) {
          alert("Your session expired. Please, login again.");
          window.netlifyIdentity.logout();
        }
        if (error === ERRORS.UnknownError) {
          alert(
            "Unknown Error. Try reloading the page or login out and in again."
          );
        }
      })
      .finally(() => {
        getNote();
        removeAnimation();
      });
  }
};
