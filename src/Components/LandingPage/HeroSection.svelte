<script></script>

<section class="hero">
  <slot></slot>
</section>

<style>
  .hero {
    display: flex;
    height: 60vh;
    align-items: center;
    gap: 5rem;
    justify-content: center;
  }
  .hero p {
    margin-bottom: 1rem;
  }
  .hero h2,
  .hero h3,
  .hero h1 {
    margin-bottom: 1rem;
  }
</style>
