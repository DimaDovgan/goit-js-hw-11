import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import imgCards from '../templates/gallery__img.hbs'



export class FetchClass{
    constructor() {
        this.url = "https://pixabay.com/api/?key=25723997-fd962a98215c24b806b0808d5&image_type=photo&orientation=horizontal&safesearch=true";
        this.per_page = 40;
        this.page = 1;
        this.SearchText = "";
        this.totalHits = 0;
        this.lastPageHits = 40;
        this.intervalId;
        this.gallery = new SimpleLightbox('.gallery a', { captionDelay: "250" });

    }

    async makeFetch() {
        try {
        const fetchConst = await fetch(`${this.url}&per_page=${this.per_page}&page=${this.page}&q=${this.SearchText}`);
        const thenJsonConst = await fetchConst.json();
        return  thenJsonConst;
            
        }catch(error){console.log(error.message)}
        
    }

    fetchFilter = (promise) => {
        return promise.then(promise => {

        return promise.hits.map((img) => {
            return {
                webformatURL: img.webformatURL,
                largeImageURL: img.largeImageURL,
                tags: img.tags,
                likes: img.likes,
                views: img.views,
                comments: img.comments,
                downloads:img.downloads,
                }
            })
        })
    }
    writeTotalHits(promise) {
        promise.then(promise => {
            this.totalHits = promise.totalHits;
            console.log("this.totalHits", this.totalHits);
        });
    }

    checkLastPage() {
        if (this.page * this.per_page > this.totalHits) {
            clearInterval(this.intervalId);
            Notify.failure("We're sorry, but you've reached the end of search results.");

            return false;
        }
        return true;
    }

    writeSearchText(text) {
        this.SearchText = text;
    }

    addPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
    scrollLoad(listGallery) {
        this.intervalId = setInterval(() => {
        let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
        if (windowRelativeBottom < document.documentElement.clientHeight + 1000) {
            this.addPage();
            if (this.checkLastPage()) {
                this.fetchFilter(this.makeFetch()).then(arr => {
            
                    listGallery.insertAdjacentHTML("beforeend", imgCards(arr));
                    this.galleryRefresh();
            })
            }
        }
    }, 500);
    }
    galleryRefresh() {
        this.gallery.refresh();
    }
    
}
