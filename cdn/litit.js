// Compose the URL for your project's endpoint and add the query
let container = document.querySelector("[data-litit]");
let URL = `https://litit.netlify.app/.netlify/functions/latest-note?key=${container.dataset.litit}`;

// fetch the content
fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    if(data.title !== "" || typeof(data.title) !== undefined ){
        console.log(URL, data);
        
        container.classList.add(`litit-preset--${data.preset}`);
        container.classList.add(`litit`);
        
        let title = document.createElement("h2");
        title.classList.add("litit-title");
        title.innerHTML = data.title;
        container.append(title);
        
        let content = document.createElement("p");
        content.classList.add("litit-content");
        content.innerHTML = data.content;
        container.append(content);
        
        let updated = document.createElement("span");
        updated.classList.add(`litit-updated`);
        updated.innerHTML = dayjs(data.updated);
        container.append(updated);
    } else {
        console.log ('no litit notification atm available')
    }
})
  .catch((err) => console.error(err));
