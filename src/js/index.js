import '../sass/main.scss';
import{ FetchClass} from "./fetch.js"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import imgCards from '../templates/gallery__img.hbs'
const refs = {
    form: document.querySelector(".search-form"),
    listGallery: document.querySelector(".gallery"),
    loadMoreBtn:document.querySelector(".load-more"),
}



const submitForm = (event) => {
    event.preventDefault();
    let searchQueryValue = event.target.elements.searchQuery.value;
    
    refs.listGallery.innerHTML = "";
    foo.resetPage();
    foo.writeSearchText(searchQueryValue);
    foo.fetchFilter(foo.makeFetch()).then(arr => {
        if (arr.length > 0) {
            refs.listGallery.insertAdjacentHTML("beforeend", imgCards(arr));
            foo.writeTotalHits(foo.makeFetch());
            foo.galleryRefresh();
            foo.scrollLoad(refs.listGallery);
            setTimeout(() => {
                Notify.info(`Hooray! We found ${foo.totalHits} images.`);
            }, 1000);
            return;
        }
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");

    });

}


refs.form.addEventListener("submit", submitForm);


const foo = new FetchClass();
