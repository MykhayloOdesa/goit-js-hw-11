function createMarkup(object) {
  return object
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        // У розмітці необхідно буде обгорнути кожну картку зображення у посилання, як зазначено в документації.
        return `<div class="photo-card">
                    <a href="${largeImageURL}">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="250" height="250" />
                    </a>
                    <div class="info">
                        <p class="info-item">
                        <b>Likes: ${likes}</b>
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
                </div>`;
      }
    )
    .join('');
}

export { createMarkup };
