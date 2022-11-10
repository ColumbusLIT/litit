<script>
  import { Router, Route, Link, navigate } from "svelte-routing";
  import netlifyIdentity from "netlify-identity-widget";

  import Header from "./Components/Header.svelte";
  import BetaInfo from "./Components/BetaInfo.svelte";
  import Footer from "./Components/Footer.svelte";

  import Home from "./routes/Home.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import Docs from "./routes/Docs.svelte";
  import { user, redirectURL } from "./stores/userStore.js";

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

<main>
  <BetaInfo />
  <Header />

  {#if isLoggedIn}
    <div class="center">
      <p>Hello {username}</p>
      <div>
        <button on:click={() => handleUserAction("logout")}>Log Out</button>
      </div>
    </div>
  {:else}
    <div class="center">
      <p>You are not logged in.</p>
      <div>
        <button on:click={() => handleUserAction("login")}>Log In</button>
        <button on:click={() => handleUserAction("signup")}>Sign Up</button>
      </div>
    </div>
  {/if}

  <Router>
    <Route path="/" component={Home} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/docs" component={Docs} />
  </Router>

  <Footer />
</main>

<style>
</style>
