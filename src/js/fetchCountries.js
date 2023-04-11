import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(name) {
  const searchParams = new URLSearchParams({
    fields: ['name', 'capital', 'population', 'flags', 'languages'],
  });
  const url = `https://restcountries.com/v3.1/name/${name}?${searchParams}`;

  return fetch(url).then(response => {
    if (!response.ok) {
      Notify.failure('Oops, there is no country with that name');
    }
    return response.json();
  });
}
