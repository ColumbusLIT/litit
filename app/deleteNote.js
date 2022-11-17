/**
 * Delete form
 * @returns void
 */
export const deleteNote = async () => {
  showAnimation();
  let id = formContainer.dataset.noteId;
  if (!id) {
    alert("A new message can not be deleted");
    return;
  }
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
};
