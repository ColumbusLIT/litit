/**
 * Renders notes in the DOM.
 * @param {Array} arr  array of note objects
 * promised by fetch in {@function netlify/functions/notes}
 */
export function renderNotes() {
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
    if (state.domains.find((d) => d !== n.domain)) state.domains.push(n.domain);

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
