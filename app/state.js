/* State Machine */
export let state = {
  notes: [],
  setNotes: (notes) => {
    state.notes = notes;
  },
  selectedNote: null,
  domains: [],
  setDomains: (domains) => {
    state.domains = domains;
  },
  selectedDomain: null,
  setSelectedDomain: (domain) => {
    state.selectedDomain = domain;
  },
  primaryDomain: null,
  setPrimaryDomain: (domain) => {
    state.primaryDomain = domain;
  },
};

export const persistState = () => {
  localStorage.setItem("litit", JSON.stringify(state));
};

export const loadState = () => {
  const newState = JSON.parse(localStorage.getItem("litit"));
  if (newState) {
    setAllValues(newState);
  } else {
    throw new Error("no state persisted in local storage");
  }
};

const initialState = {
  notes: [],
  selectedNote: null,
  domain: [],
  selectedDomain: null,
  primaryDomain: null,
};

export const clearState = (newState) => {
  setAllValues(initialState);
};

const setAllValues = (newState) => {
  state.notes = newState.notes;
  state.selectedNote = newState.selectedNote;
  state.domain = newState.domain;
  state.selectedDomain = newState.selectedDomain;
  primaryDomain = newState.primaryDomain;
};
