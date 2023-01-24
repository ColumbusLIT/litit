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
  updated.innerHTML = dayjs(data.updated).format("D. MMMM YYYY, HH:mm Uhr");
  newNote.append(updated);
  container.appendChild(newNote);
  
  let author = document.createElement("span");
  author.classList.add(`litit-updated`);
  author.innerHTML = " by " + data.belongsTo.fullName;
  newNote.append(author);
  container.appendChild(newNote);
}

const app = () => {
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
}


  const loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to 
    //insert the <script> element

    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

loadJS('https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.6/dayjs.min.js', app, document.body);