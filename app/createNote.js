/**
 * Takes text value from DOM input
 * and sends it to {@function netlify/functions/create-note} with token
 * If ok calls {@function renderNotes} otherwise alerts error
 * Zeros out DOM input
 */
export const createNote = async () => {
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
      console.log(r);
      if (r.ok) {
        getAndRenderNotes();
        getNote(null, r.data.id);
      }
      if (!r.ok) {
        alert("Something is messed up. You could try logging out and back in.");
      }
    });
  }

  clearForm();
};
