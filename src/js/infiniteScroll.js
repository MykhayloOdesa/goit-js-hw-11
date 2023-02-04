// formInput.lastElementChild.addEventListener('click', () => {
//   formInput.lastElementChild.classList.toggle('is-active');
//   loadMoreButton.classList.toggle('is-hidden');
// });

if (loadMoreButton) {
} else {
  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 1.0,
  };

  const callback = function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(entry.target);
        observer.unobserve(entry.target);
        imagesApiService.incrementPage();
        imagesApiService
          .fetchImages()
          .then(({ totalHits, total, hits }) => {
            const markup = createMarkup(hits);

            markupContainer.insertAdjacentHTML('beforeend', markup);

            const hasMore = imagesApiService.hasMorePhotos();
            if (hasMore) {
              const item = document.querySelector('.photo-card:last-child');
              observer.observe(item);
            }
          })
          .catch(error => console.log(error));
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  formInput.addEventListener('submit', onSearch);

  const imagesApiService = new ImagesApiService();

  function onSearch(event) {
    event.preventDefault();

    const value = event.currentTarget.elements.searchQuery.value;

    if (!value) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    markupContainer.innerHTML = '';
    imagesApiService.resetPage();
    imagesApiService.query = value;

    imagesApiService
      .fetchImages()
      .then(({ totalHits, total, hits }) => {
        if (hits.length === 0) {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }

        const markup = createMarkup(hits);

        markupContainer.insertAdjacentHTML('beforeend', markup);
        imagesApiService.setTotalPhotos(totalHits);
        const hasMore = imagesApiService.hasMorePhotos();

        if (hasMore) {
          const item = document.querySelector('.photo-card:last-child');
          observer.observe(item);
        }
      })
      .catch(err => console.log(err));
  }
}
