import { renderCards, fetchRequest, perPage  } from "./api-render";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
// const targetEl = document.querySelector('.js-guard');

searchForm.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onLoadMore);
// document.addEventListener('scroll', onScroll);

// let options = {
//   root: null,
//   rootMargin: "300px",
//   threshold: 1.0,
// };

// let observer = new IntersectionObserver(onScroll, options);

// function onScroll(evt) {
//   console.log(evt);
// }


let inputValue = '';
let currentPage = 1;

let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
  captionDelay: 250,
   disableScroll: false,
});

async function onSubmit(evt) {

  evt.preventDefault();

  gallery.innerHTML = '';
  inputValue = evt.currentTarget.elements.searchQuery.value;
  currentPage = 1;
  loadMore.hidden = true;
  try {
    const { hits, totalHits } = await fetchRequest(inputValue, currentPage);
    console.log(hits);
    if (hits.length === 0) {
      gallery.innerHTML = '';
      loadMore.hidden = true;
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    
    gallery.insertAdjacentHTML('beforeend', renderCards(hits));
    
    lightbox.refresh();
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, {timeout: 2000,},);
    scrollSmooth();
    if (totalHits <= perPage) {
      loadMore.hidden = true;
      return;
    }

    loadMore.hidden = false;
    
  } catch (error) {
    console.error(error);
  } 
    
}

async function onLoadMore() {
  currentPage += 1;
  try {
    
    const { hits, totalHits } = await fetchRequest(inputValue, currentPage);
   
    gallery.insertAdjacentHTML('beforeend', renderCards(hits));
    lightbox.refresh();
    scrollSmooth();

    const allPage = totalHits / perPage;
    
    if (currentPage >= allPage) {
      loadMore.hidden = true;
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    
  } catch (error) {
    console.error(error);
    
  } 
}

function scrollSmooth() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}


