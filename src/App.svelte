<script>
  import { Router, Route, Link, navigate } from "svelte-routing";

  import LoadingOverlay from "./components/LoadingOverlay.svelte";
  import { isLoadingOverlayShown } from "./stores/loadingOverlayQueue.js";

  import Header from "./components/Header.svelte";
  import BetaInfo from "./components/BetaInfo.svelte";
  import Footer from "./components/Footer.svelte";

  import Home from "./routes/Home.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import Docs from "./routes/Docs.svelte";
</script>

<main>
  <BetaInfo />
  <Header />
  <Router>
    <Route path="/"><Home /></Route>
    <Route path="/dashboard" component={Dashboard}/>
    <Route path="/docs"><Docs /></Route>
  </Router>

  <Footer />
  {#if $isLoadingOverlayShown}
    <LoadingOverlay />
  {/if}
</main>

<style>
</style>
