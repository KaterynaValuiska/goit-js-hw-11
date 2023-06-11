import axios from 'axios';

const input = document.querySelector('[name="searchQuery"]');
const btnSubmit = document.querySelector('[type="submit"]');


input.addEventListener('change', onInput);
btnSubmit.addEventListener('click', onSubmit);

let inputValue = '';

function onInput(evt) {
    inputValue = evt.target.value;
    console.log(inputValue);
  fetchRequest(inputValue)
}

function onSubmit(evt) {
    evt.preventDefault();
    console.log(inputValue); 
}


const API_KEY = '37154434-e108fb93a0dd643270de780f1';
const baseURL = 'https://pixabay.com/api/';

// const instance = axios.create({
//     baseURL: 'https://pixabay.com/api/', 
//   headers: {
//     'x-api-key': API_KEY,
//   },
// });

async function fetchRequest(inputValue) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          API_KEY: API_KEY,
          q: inputValue,
          image_type: "photo",
          orientation: "horizontal",
          safesearch: true,
        }
      });
   console.log(response);
  } catch (error) {
    console.error(error);
  }
}

