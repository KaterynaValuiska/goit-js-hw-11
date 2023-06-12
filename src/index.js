import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const API_KEY = '37154434-e108fb93a0dd643270de780f1';

searchForm.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onLoadMore)


let inputValue = '';
let currentPage = 1;

async function onSubmit(evt) {

  evt.preventDefault();

  gallery.innerHTML = '';
  inputValue = evt.currentTarget.elements.searchQuery.value;
  try {

    const { hits, totalHits } = await fetchRequest(inputValue, page=1);
    if (hits.length === 0) {
      gallery.innerHTML = '';
      loadMore.hidden = true;
      errorShow();
      return;
    }
    console.log(hits);
    gallery.insertAdjacentHTML('beforeend', renderCards(hits));
    if (totalHits !== page) {
      loadMore.hidden = false;
    }
  } catch (error) {
    console.error(error);
    errorShow()
  } 
    
}

async function onLoadMore() {
  currentPage += 1;
  try {
    const { hits } = await fetchRequest(inputValue, currentPage);
    console.log(hits);
    gallery.insertAdjacentHTML('beforeend', renderCards(hits));
    loadMore.classList.remove('hide');
  } catch (error) {
    console.error(error);
    errorShow()
  } 
}

async function fetchRequest(inputValue, page=1) {
    try {
      const {data} = await axios.get('https://pixabay.com/api/', {
        params: {
          key: API_KEY,
          q: inputValue,
          image_type: "photo",
          orientation: "horizontal",
          safesearch: true,
          per_page: 40,
          page: page,
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
    .map(({tags, webformatURL, likes, views, comments, downloads}) => {
      return `
      <div class="photo-card">
  <img src="${webformatURL}" alt=${tags} loading="lazy" class="photo"/>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes} </b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>
      `;
    })
    .join("");
}

function errorShow() {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

