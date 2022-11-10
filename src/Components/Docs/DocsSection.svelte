<script>
</script>

<section class="shade1">
  <div>
    <a name="HowItWorks" />
    <h2>How it works</h2>
    <h3>1. Choose a plan</h3>
    <p>Get started at <a href="https://litit.netlify.app">here</a>.</p>
    <h3>2. Add widget to page</h3>
    <p>Than copy and paste this widget code anywhere on your page.</p>
    <pre><code
        >&lt;div data-litit=&quot;litit-demo.netlify.app&quot;>&lt;/div&gt;
&lt;script src=&quot;https://litit.netlify.app/cdn/litit.js&quot;>&lt;/script&gt;</code
      ></pre>
    <p>
      Make sure you replace the <code>data-litit</code> attribute with your
      <code>DOMAIN_KEY</code>.
    </p>
    <p>
      If you want to use our presets, copy the stylesheet to your HTML header
      (optional):
    </p>
    <pre><code
        >&lt;link rel=&quot;stylesheet&quot; href=&quot;https://litit.netlify.app/cdn/litit.css&quot;&gt;</code
      ></pre>
    <h3>Custom Styling</h3>
    <p>We provide three CSS classes for styling.</p>
    <ul>
      <li>
        <code>.litit-title</code> - the notes header
      </li>
      <li>
        <code>.litit-content</code> - the content paragraph
      </li>
      <li>
        <code>.litit-updated</code> - the last updates timestamp
      </li>
    </ul>
  </div>
</section>

<style>
  section {
    width: 100vw;
  }
  section.shade1 {
    background-color: var(--light-300);
    padding: 1rem 0;
  }
  section.shade2 {
    background-color: var(--tertiary-300);
    padding: 1rem 0;
  }
  section.shade3 {
    background-color: var(--secondary-300);
    padding: 1rem 0;
  }
  section > div {
    margin: 0 auto;
    padding: 0 1rem;
    width: calc(var(--content-width) - 2rem);
  }
  :global(code) {
  font-family: var(--source);
  background-color: var(--tertiary-200);
}
:global(pre) {
  padding: 1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: justify;
  background-color: var(--tertiary-200);
}
</style>
