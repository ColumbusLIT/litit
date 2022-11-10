import { writable } from "svelte/store";

function createDomains() {
  const local = JSON.parse(localStorage.getItem("domains"));

  let d = null;
  if (local) {
    d = local;
  }
  const { subscribe, set } = writable(d);

  return {
    subscribe,
    set(d) {
      set(d);
    },
    clear() {
      set([]);
    },
  };
}
function createSelectedDomain() {
  const local = JSON.parse(localStorage.getItem("selectedDomain"));

  let d = null;
  if (local) {
    d = local;
  }
  const { subscribe, set } = writable(d);

  return {
    subscribe,
    set(d) {
      set(d);
    },
    clear() {
      set(null);
    },
  };
}

export const domains = createDomains();
export const selectedDomains = createSelectedDomain();
