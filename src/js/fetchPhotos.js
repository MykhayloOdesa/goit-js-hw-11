import axios from 'axios';

const url = 'https://pixabay.com/api/?';
const KEY_ACCESS = '32696912-4a05c8f7f735a3dd0164dcd85';

async function fetchPhotos(value, page) {
  const response = await axios(url, {
    params: {
      key: KEY_ACCESS,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      // Зроби так, щоб в кожній відповіді приходило 40 об'єктів (за замовчуванням 20).
      per_page: 40,
      page: `${page}`,
      q: `${value.searchQuery.value}`,
    },
  });
  const result = await response.data;
  return result;
}

export { fetchPhotos };
