import View from './View.js';
import previewView from './previewView.js';
// import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
	_parentElement = document.querySelector('.bookmarks__list');
	_errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
	_message = '';

	addHandlerRender(handler) {
		window.addEventListener('load', handler);
	}

	_generateMarkup() {
		// console.log(this._data);
		return this._data
			.map(bookmark => previewView.render(bookmark, false))
			.join(''); //! iz _generateMarkup() treba da vratimo STRING jer treba da insertujemo taj markup u DOM (to radimo tamo u View.js u render pa onaj deo: this._parentElement.insertAdjacentHTML('afterbegin', markup);)
		//! medjutim, ovde koristimo i previewView.render(bookmark) metod koji isto renderuje neki markup te ovo ovako nece raditi. Pa moramo da u View.js dodamo drugi parametar u render() metodu koji ce po difoltu biti setovan na true. A ovde saljemo da bude false
		//! nakon map metoda dobijamo niz sa stringovima markup-a, a posto nam treba jedan veliki string sa svim tim, a ne niz, onda join-ujemo
	}
}

export default new BookmarksView();
