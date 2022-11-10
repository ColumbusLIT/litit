<script>
  import { Router, Link, navigate } from "svelte-routing";
  import logo from "./../assets/images/litit.png";

  import netlifyIdentity from "netlify-identity-widget";
  import { user, redirectURL } from "./../stores/userStore.js";

  netlifyIdentity.init();

  $: isLoggedIn = !!$user;
  $: username = $user !== null ? $user.username : " there!";

  function handleUserAction(action) {
    if (action === "login" || action === "signup") {
      netlifyIdentity.open(action);
      netlifyIdentity.on("login", (u) => {
        user.login(u);
        netlifyIdentity.close();
        if ($redirectURL !== "") {
          navigate($redirectURL);
          redirectURL.clearRedirectURL();
        }
      });
    } else if (action === "logout") {
      navigate("/");
      user.logout();
      netlifyIdentity.logout();
    }
  }
</script>

<header>
  <div>
    <Router>
      <Link class="page-title" to="/"
        ><img class="logo" src={logo} alt="litit" /></Link
      >
      <nav class="hide-md">
        <Link class="link" to="/docs">Docs</Link>
        <a class="link" href="https://litit-demo.netlify.app">Demo</a>
        <Link class="link" to="/dashboard">Dashboard</Link>
      </nav>
      <div class="account-menu">
        {#if isLoggedIn}
          <div>
            <Link to="/dashboard">Hello {username}</Link>
              <a on:click={() => handleUserAction("logout")}
                >Log Out</a
              >
          </div>
        {:else}
          <div>
              <button on:click={() => handleUserAction("login")}>Log In</button>
              <button on:click={() => handleUserAction("signup")}
                >Sign Up</button
              >
          </div>
        {/if}
          </div>
    </Router>
  </div>
</header>

<style>
  .page-title {
    font-size: 2rem;
    padding: 0 1rem;
    display: flex;
    font-family: var(--headlines);
    justify-content: center;
    align-items: center;
  }
  .logo {
    will-change: filter;
    height: 0.8rem;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  header {
    font-family: var(--copy);
    font-size: 1rem;
    border-bottom: 1px solid var(--grey-200);
    position: sticky;
    top: 0;
    background-color: var(--light-200);
  }
  header > div {
    display: flex;
    margin: 0 auto;
    gap: 2rem;
    align-items: stretch;
    width: var(--content-width);
  }

  nav {
    flex: 1;
    padding: 1rem;
    padding-left: 3rem;
    border-left: 1px solid var(--grey-200);
    display: flex;
    align-items: center;
  }
  .account-menu {
    display: flex;
    align-items: center;
    padding: 0 1rem;
  }
  .link {
    margin-right: 4rem;
  }
  .active {
    margin-right: 4rem;
    color: var(--second);
  }
</style>
