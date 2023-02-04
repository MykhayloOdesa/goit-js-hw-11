import axios from 'axios';
import Notiflix from 'notiflix';

export class ImagesApiService {
  #BASE_URL = 'https://pixabay.com/api/';
  #KEY = '32696912-4a05c8f7f735a3dd0164dcd85';
  #query = '';
  #page = 1;
  #per_page = 40;
  #totalHits = 0;

  async fetchImages() {
    const axiosParams = {
      key: this.#KEY,
      q: this.#query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.#per_page,
      page: this.#page,
    };

    try {
      const response = await axios.get(this.#BASE_URL, {
        params: axiosParams,
      });
      this.incrementPage();
      return { hits, totalHits, total };
    } catch (error) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }

  hasMorePhotos() {
    return this.#page < Math.ceil(this.#totalHits / this.#per_page);
  }

  setTotalPhotos(totalHits) {
    this.#totalHits = totalHits;
  }

  incrementPage() {
    this.#page += 1;
  }

  resetPage() {
    this.#page = 1;
  }

  get query() {
    return this.#query;
  }
  set query(newQuery) {
    this.#query = newQuery;
  }
}
