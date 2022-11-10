<script>
  import { navigate } from "svelte-routing";
  import { user, redirectURL } from "./../stores/userStore.js";

  export let location;

  function handlePrivateRoute() {
    redirectURL.setRedirectURL(location.href);
    navigate("/", { replace: true });
    alert("login please");
  }
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

{#if $user && $user.username}
  <h1>Dashboard</h1>
{:else}{handlePrivateRoute()}{/if}
