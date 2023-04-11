import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.getElementById('search-box'),
  ulEl: document.querySelector('.country-list'),
  divEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const name = e.target.value.trim();

  if (name === '') {
    return;
  }

  fetchCountries(name)
    .then(countries => {
      refs.ulEl.innerHTML = '';
      refs.divEl.innerHTML = '';

      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        renderCountries(countries);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function renderCountries(countries) {
  if (countries.length > 1 && countries.length <= 10) {
    const markup = countries.reduce((markup, country) => {
      const {
        name: { official },
        flags: { svg, alt },
      } = country;

      return (
        markup +
        `<li class="country-list-item"><img src="${svg}", alt="${alt}", width="40" class="flag-img"/>${official}</li>`
      );
    }, '');

    refs.ulEl.insertAdjacentHTML('beforeend', markup);
  }

  if (countries.length === 1) {
    const {
      name: { official },
      capital,
      population,
      flags: { svg, alt },
      languages,
    } = countries[0];

    const markup = `<div><img src="${svg}" alt="${alt}" width="40" class="flag-img"/><span class="country-info-name">${official}</span></div>
    <ul><li class="country-info-list-item"><span class="country-property">Capital: </span>${capital}</li>
    <li class="country-info-list-item"><span class="country-property">Populations: </span>${population}</li>
    <li class="country-info-list-item"><span class="country-property">Languages: </span>${Object.values(
      languages
    )}</li></ul>`;

    refs.divEl.innerHTML = markup;
  }
}
