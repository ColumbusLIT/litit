<script>
  import { Router, Route, Link, navigate } from "svelte-routing";

  import Header from "./Components/Header.svelte";
  import BetaInfo from "./Components/BetaInfo.svelte";
  import Footer from "./Components/Footer.svelte";

  import Home from "./routes/Home.svelte";
  import Dashboard from "./routes/Dashboard.svelte";
  import Docs from "./routes/Docs.svelte";

</script>

<main>
  <BetaInfo />
  <Header />

  

  <Router>
    <Route path="/" component={Home} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/docs" component={Docs} />
  </Router>

  <Footer />
</main>

<style>
</style>
