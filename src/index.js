import { errorShow, renderCards, fetchRequest, perPage  } from "./api-render";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');


searchForm.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onLoadMore)


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
  try {
    const { hits, totalHits } = await fetchRequest(inputValue, currentPage);
    if (hits.length === 0) {
      gallery.innerHTML = '';
      loadMore.hidden = true;
      errorShow();
      return;
    }
    
    gallery.insertAdjacentHTML('beforeend', renderCards(hits));
    lightbox.refresh();
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`, {timeout: 2000,},);
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
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
    
    const { hits, totalHits } = await fetchRequest(inputValue, currentPage);
   
    gallery.insertAdjacentHTML('beforeend', renderCards(hits));
    lightbox.refresh();
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});

    const allPage = totalHits / perPage;
    
    if (currentPage >= allPage) {
      loadMore.hidden = true;
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    
  } catch (error) {
    console.error(error);
    
  } 
}



