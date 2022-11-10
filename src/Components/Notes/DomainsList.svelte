<script>
  import {
    hideLoadingOverlay,
    showLoadingOverlay,
  } from "../../stores/loadingOverlayQueue";
  import { onDestroy, onMount } from "svelte";
  import { user } from "../../stores/user.js";
  import { notes } from "../../stores/notes";
  import { FUNCTIONS } from "../../utilities/client";
  import { ERRORS } from "../../utilities/errors";
  import promiser from "../../utilities/promiser";
  import { domains } from "../../stores/domains";

  let destroyed = false;
  let loading = false

  let domainsValue;
  domains.subscribe((value) => {
    domainsValue = value;
  });
  let count = 0;

  async function getDomains() {
    await fetch(`${FUNCTIONS}/domains`, {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
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
          domains.set(data);
        }
        console.log(data)
      })
      .catch((error) => {
        if (error === ERRORS.SessionExpired) {
          alert("Your session expired. Please, login again.");
        }
        if (error === ERRORS.UnknownError) {
          alert(
            "Unknown Error. Try reloading the page or login out and in again."
          );
        }
      })
      .finally(() => {
        console.log('all done')
      });
  }

  onMount(() => {
    promiser(getDomains(),status => loading = status);
    // getNotes();
  });

  onDestroy(() => {
    destroyed = true;
  });
</script>

<div class="domains">
  {#if domainsValue}
    {#each domainsValue as domain}
      {JSON.stringify(domain)}
    {/each}
  {/if}
</div>

<style>
  .domains {
    margin: 0;
  }
</style>
