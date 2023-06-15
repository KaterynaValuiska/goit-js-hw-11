import axios from 'axios';

const API_KEY = '37154434-e108fb93a0dd643270de780f1';
const perPage = 40;


async function fetchRequest(inputValue, currentPage) {
    try {
      const {data} = await axios.get('https://pixabay.com/api/', {
        params: {
          key: API_KEY,
          q: inputValue,
          image_type: "photo",
          orientation: "horizontal",
          safesearch: true,
          per_page: perPage,
          page: currentPage,
        }
      });
      return data;
   
  } catch (error) {
      console.error(error);
      errorShow()
  }
}

function renderCards(cards) {
  return cards
    .map(({largeImageURL, tags, webformatURL, likes, views, comments, downloads}) => {
      return `
      <div class="photo-card">
 <a href=${largeImageURL}>
  <img src="${webformatURL}" alt= "${tags}" loading="lazy" class="photo"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes  </b>
      <span class="info-values">${likes} </span>
    </p>
    <p class="info-item">
      <b>Views </b>
      <span class="info-values">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments </b>
      <span class="info-values">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads </b>
      <span class="info-values">${downloads}</span>
    </p>
  </div>
</div>
      `;
    })
    .join("");
}



export { renderCards, fetchRequest, perPage };