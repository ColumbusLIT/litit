// Compose the URL for your project's endpoint and add the query
let container = document.querySelector("[data-litit]");
let URL = `https://litit.netlify.app/.netlify/functions/latest-notes?key=${container.dataset.litit}`;

function renderNote (data){
  let newNote = document.createElement('div')
  newNote.classList.add(`litit-preset--${data.preset}`);
  newNote.classList.add(`litit`);
  
  let title = document.createElement("h2");
  title.classList.add("litit-title");
  title.innerHTML = data.title;
  newNote.append(title);
  
  let content = document.createElement("p");
  content.classList.add("litit-content");
  content.innerHTML = data.content;
  newNote.append(content);
  
  let updated = document.createElement("span");
  updated.classList.add(`litit-updated`);
  updated.innerHTML = dayjs(data.updated);
  newNote.append(updated);
  container.appendChild(newNote);
}

// fetch the content
fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    if(data.length > 0){  
      data.forEach((note)=>renderNote(note))        
    } else {
        console.log ('good. nothing to update atm.')
    }
})
  .catch((err) => console.error(err));
