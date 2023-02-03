import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '32696912-4a05c8f7f735a3dd0164dcd85';
const URL = `https://pixabay.com/api/`;
export const perPage = 40;

export class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const axiosParams = {
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: perPage,
      page: this.page,
    };

    try {
      const response = await axios.get(URL, {
        params: axiosParams,
      });
      this.incrementPage();
      return { hits: response.data.hits, totalHits: response.data.totalHits };
    } catch (error) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
