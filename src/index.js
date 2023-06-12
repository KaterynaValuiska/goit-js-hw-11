import axios from 'axios';

const input = document.querySelector('[name="searchQuery"]');
const btnSubmit = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');


input.addEventListener('change', onInput);
btnSubmit.addEventListener('click', onSubmit);

let inputValue = '';

function onInput(evt) {
    inputValue = evt.target.value;
}

function onSubmit(evt) {
    evt.preventDefault();
  fetchRequest(inputValue)
    .then((cards) => {
      console.log(cards);
      renderCards(cards); 
      
   })
    .catch((error) => console.log(error));
}


const API_KEY = '37154434-e108fb93a0dd643270de780f1';

async function fetchRequest(inputValue) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: API_KEY,
          q: inputValue,
          image_type: "photo",
          orientation: "horizontal",
          safesearch: true,
          per_page: 40,
        }
      });
   console.log(response);
  } catch (error) {
    console.error(error);
  }
}

function renderCards(cards) {
  const markup = cards
    .map(({tags, webformatURL}) => {
      return `
      <div class="photo-card">
  <img src="${webformatURL}" alt=${tags} loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>
      `;
    })
    .join("");
  
  gallery.innerHTML = markup;
}

