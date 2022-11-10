<script>
  import Spinner from "./Spinner.svelte";
</script>

<div class="overlay">
  <Spinner />
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 100000;
    background-color: rgba(0, 0, 0, 0.7);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
