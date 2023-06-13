import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const API_KEY = '37154434-e108fb93a0dd643270de780f1';

searchForm.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onLoadMore)

const perPage = 40;
let inputValue = '';
let currentPage = 1;



async function onSubmit(evt) {

  evt.preventDefault();

  gallery.innerHTML = '';
  inputValue = evt.currentTarget.elements.searchQuery.value;
  try {
    const { hits, totalHits } = await fetchRequest(inputValue, currentPage);
    if (hits.length === 0) {
      gallery.innerHTML = '';
      loadMore.hidden = true;
      errorShow();
      return;
    }
    
    gallery.insertAdjacentHTML('beforeend', renderCards(hits));
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    if (totalHits !== perPage) {
      loadMore.hidden = false;
    }
  } catch (error) {
    console.error(error);
  } 
    
}

async function onLoadMore() {
  currentPage += 1;

  try {
    refresh();
    const { hits, totalHits } = await fetchRequest(inputValue, currentPage);
   
    gallery.insertAdjacentHTML('beforeend', renderCards(hits));

    const allPage = totalHits / perPage;
    
    if (currentPage >= allPage) {
      loadMore.hidden = true;
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    
  } catch (error) {
    console.error(error);
    
  } 
}

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
 <a class="gallery__link" href=${largeImageURL}>
  <img src="${webformatURL}" alt=${tags} loading="lazy" class="photo gallery__image"/>
  </a>
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

lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
  captionDelay: 250,
   disableScroll: false,
});