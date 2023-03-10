import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkup } from './js/createMarkup';
import { fetchPhotos } from './js/fetchPhotos';
// import { ImagesApiService } from './js/infiniteFetch';

const formInput = document.querySelector('#search-form');
const markupContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
// const sentinel = document.querySelector('#sentinel');
// В початковому стані кнопка повинна бути прихована.
loadMoreButton.style.display = 'none';

// Додати відображення великої версії зображення з бібліотекою SimpleLightbox для повноцінної галереї.
let lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
});

formInput.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', onLoadMoreButton);

// Початкове значення параметра page повинно бути 1.
let currentPage = 1;

async function onSubmit(event) {
  event.preventDefault();

  // Під час пошуку за новим ключовим словом необхідно повністю очищати вміст галереї, щоб не змішувати результати.
  clearPage();
  // У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового,
  // оскільки буде пагінація по новій колекції зображень.
  currentPage = 1;
  const feedback = await fetchPhotos(formInput, currentPage);

  const totalHits = feedback.hits.length;

  if (!totalHits) {
    // Якщо бекенд повертає порожній масив, значить нічого підходящого не було знайдено.
    // У такому разі показуй повідомлення з текстом "Sorry, there are no images matching your search query. Please try again.".
    // Для повідомлень використовуй бібліотеку notiflix.
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreButton.style.display = 'none';
    return;
    // Після першого запиту з кожним новим пошуком отримувати повідомлення,
    // в якому буде написано, скільки всього знайшли зображень (властивість totalHits).
    // Текст повідомлення - "Hooray! We found totalHits images."
  } else {
    Notiflix.Notify.info(`Hooray! We found ${feedback.totalHits} images.`);
  }

  console.log(feedback);

  const markup = createMarkup(feedback.hits);
  markupContainer.insertAdjacentHTML('beforeend', markup);
  // Бібліотека містить метод refresh(), який обов'язково потрібно викликати щоразу після додавання нової групи карток зображень.
  lightbox.refresh();

  // Зробити плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень.
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  checkLoadMoreButton(totalHits, feedback);
}

function clearPage() {
  markupContainer.innerHTML = '';
}

async function onLoadMoreButton() {
  // З кожним наступним запитом, його необхідно збільшити на 1.
  // HTML документ вже містить розмітку кнопки, по кліку на яку,
  // необхідно виконувати запит за наступною групою зображень і додавати розмітку до вже існуючих елементів галереї.
  currentPage += 1;
  const feedback = await fetchPhotos(formInput, currentPage);
  const markup = createMarkup(feedback.hits);
  markupContainer.insertAdjacentHTML('beforeend', markup);
  // Бібліотека містить метод refresh(), який обов'язково потрібно викликати щоразу після додавання нової групи карток зображень.
  lightbox.refresh();

  totalHits += feedback.hits.length;

  checkLoadMoreButton(totalHits, feedback);

  // Зробити плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень.
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function checkLoadMoreButton(iterator, value) {
  // У відповіді бекенд повертає властивість totalHits - загальна кількість зображень,
  // які відповідають критерію пошуку (для безкоштовного акаунту).
  // Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом
  // "We're sorry, but you've reached the end of search results.".
  if (`${iterator}` === `${value.totalHits}`) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    // Після першого запиту кнопка з'являється в інтерфейсі під галереєю.
  } else {
    loadMoreButton.style.display = 'block';
  }
}

// Критерії приймання
// Створено репозиторій goit-js-hw-11.
// Домашня робота містить два посилання: на вихідні файли і робочу сторінку на GitHub Pages.
// В консолі відсутні помилки і попередження під час відкриття живої сторінки завдання.
// Проект зібраний за допомогою parcel-project-template.
// Для HTTP-запитів використана бібліотека axios.
// Використовується синтаксис async/await.
// Для повідомлень використана бібліотека notiflix.
// Код відформатований за допомогою Prettier.

// Завдання - пошук зображень
// Створи фронтенд частину застосунку пошуку і перегляду зображень за ключовим словом.
// Додай оформлення елементів інтерфейсу.
// Подивись демо - відео роботи застосунку.

// Форма пошуку
// Форма спочатку міститься в HTML-документі. Користувач буде вводити рядок для пошуку у текстове поле,
// а по сабміту форми необхідно виконувати HTTP-запит.

// <form class="search-form" id="search-form">
//   <input
//     type="text"
//     name="searchQuery"
//     autocomplete="off"
//     placeholder="Search images..."
//   />
//   <button type="submit">Search</button>
// </form>

// HTTP-запити
// Для бекенду використовуй публічний API сервісу Pixabay.
// Зареєструйся, отримай свій унікальний ключ доступу і ознайомся з документацією.

// Список параметрів рядка запиту, які тобі обов'язково необхідно вказати:

// key - твій унікальний ключ доступу до API.
// q - термін для пошуку. Те, що буде вводити користувач.
// image_type - тип зображення. На потрібні тільки фотографії, тому постав значення photo.
// orientation - орієнтація фотографії. Постав значення horizontal.
// safesearch - фільтр за віком. Постав значення true.

// У відповіді буде масив зображень, що задовольнили критерії параметрів запиту.

// Кожне зображення описується об'єктом, з якого тобі цікаві тільки наступні властивості:
// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.

// Якщо бекенд повертає порожній масив, значить нічого підходящого не було знайдено.
// У такому разі показуй повідомлення з текстом "Sorry, there are no images matching your search query. Please try again.".
// Для повідомлень використовуй бібліотеку notiflix.

// Галерея і картка зображення
// Елемент div.gallery спочатку міститься в HTML документі, і в нього необхідно рендерити розмітку карток зображень.
// Під час пошуку за новим ключовим словом необхідно повністю очищати вміст галереї, щоб не змішувати результати.

// <div class="gallery">
//   <!-- Картки зображень -->
// </div>

// Шаблон розмітки картки одного зображення для галереї.

// <div class="photo-card">
//   <img src="" alt="" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//     </p>
//   </div>
// </div>

// Пагінація
// Pixabay API підтримує пагінацію і надає параметри page і per_page.
// Зроби так, щоб в кожній відповіді приходило 40 об'єктів (за замовчуванням 20).

// Початкове значення параметра page повинно бути 1.
// З кожним наступним запитом, його необхідно збільшити на 1.
// У разі пошуку за новим ключовим словом, значення page потрібно повернути до початкового,
// оскільки буде пагінація по новій колекції зображень.
// HTML документ вже містить розмітку кнопки, по кліку на яку,
// необхідно виконувати запит за наступною групою зображень і додавати розмітку до вже існуючих елементів галереї.

// <button type="button" class="load-more">Load more</button>

// В початковому стані кнопка повинна бути прихована.
// Після першого запиту кнопка з'являється в інтерфейсі під галереєю.
// При повторному сабміті форми кнопка спочатку ховається, а після запиту знову відображається.

// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень,
// які відповідають критерію пошуку (для безкоштовного акаунту).
// Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом
// "We're sorry, but you've reached the end of search results.".

// Додатково
// УВАГА
// Наступний функціонал не обов'язковий для здавання завдання, але буде хорошою додатковою практикою.

// Повідомлення
// Після першого запиту з кожним новим пошуком отримувати повідомлення,
// в якому буде написано, скільки всього знайшли зображень (властивість totalHits).
// Текст повідомлення - "Hooray! We found totalHits images."

// Бібліотека SimpleLightbox
// Додати відображення великої версії зображення з бібліотекою SimpleLightbox для повноцінної галереї.

// У розмітці необхідно буде обгорнути кожну картку зображення у посилання, як зазначено в документації.
// Бібліотека містить метод refresh(), який обов'язково потрібно викликати щоразу після додавання нової групи карток зображень.

// Для того щоб підключити CSS код бібліотеки в проект, необхідно додати ще один імпорт, крім того, що описаний в документації.
// // Описаний в документації
// import SimpleLightbox from "simplelightbox";
// // Додатковий імпорт стилів
// import "simplelightbox/dist/simple-lightbox.min.css";

// Прокручування сторінки
// Зробити плавне прокручування сторінки після запиту і відтворення кожної наступної групи зображень.
// Ось тобі код - підказка, але розберися у ньому самостійно.

// const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });

// Нескінченний скрол
// Замість кнопки «Load more», можна зробити нескінченне завантаження зображень під час прокручування сторінки.
// Ми надаємо тобі повну свободу дій в реалізації, можеш використовувати будь - які бібліотеки.
