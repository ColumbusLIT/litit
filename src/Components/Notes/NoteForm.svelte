<script>
  import { hideLoadingOverlay, showLoadingOverlay } from "../../stores/loadingOverlayQueue";
 
  import { selectedNote } from "../../stores/notes";
  
  import { onMount } from "svelte";

  let selectedNoteValue;


        selectedNote.subscribe((value) => {
        selectedNoteValue = value;
        });


  function clearForm() {
    alert("clear");
  }

  function deleteNote() {
    const id = showLoadingOverlay();
    setTimeout(() => {
      hideLoadingOverlay(id);
    }, 5000);
  }
</script>

<form class="form">
{#if selectedNoteValue}
{@debug selectedNoteValue}
  <label>
    <span class="label-name">Domain</span><a
      class="label-description"
      href=""
      target="_blank"
      rel="noreferrer"
      id="domain-link">Visit {selectedNoteValue.domain}</a
    >
    <input
      type="text"
      id="domain"
      name="domain"
      minlength="5"
      maxlength="50"
      value=""
      required
      placeholder="acme.com"
    />
  </label>
  <label>
    <span class="label-name">Title</span>
    <input
      type="text"
      id="title"
      name="title"
      maxlength="40"
      value=""
      required
      placeholder="Title"
    />
  </label>
  <label>
    <span class="label-name">Content</span>
    <textarea id="content" rows="6" required></textarea>
  </label>
  <label class="select" for="preset">
    <span class="label-name">Preset</span>
    <select id="preset">
      <option value="default">Default</option>
      <option value="unstyled">Unstyled</option>
    </select>
  </label>
  <label>
    <span class="label-name">Status</span>
    <select id="status">
      <option value="published" selected>Published</option>
      <option value="draft">Draft</option>
      <option value="archived">Archived</option>
    </select>
  </label>
  <button type="submit" class="button--save"> SAVE </button>
  <button on:click={() => deleteNote()} class="button--delete">DELETE</button>
  {/if}
</form>

<style></style>
