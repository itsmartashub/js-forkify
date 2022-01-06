import View from './View.js';

// import icons from '../img/icons.svg' //! Parcel 1
import icons from 'url:../../img/icons.svg'; //! Parcel 2
// import Fraction from 'fractional'; //* ali posto je Fraction unutar Fraction mozemo koristiti destructuring tj { Fraction }
import { Fraction } from 'fractional';

class RecipeView extends View {
	_parentElement = document.querySelector('.recipe'); // ako svaki od view-a ima ovaj parentElement property, ovo ce biti lagano
	_errorMessage = 'We could not find that recipe. Please try another one!';
	_message = '';

	addHandlerRender(handler) {
		//? PUBLISHER: code that knows when to react

		//! JAKO BITNO STO SMO OVO OVAKO. ALI SAM JA MALO ZBUNJENA STO
		['hashchange', 'load'].forEach(event =>
			window.addEventListener(event, handler)
		);
	}

	addHandlerUpdateServings(handler) {
		this._parentElement.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--update-servings');
			if (!btn) return;

			// const updateTo = +btn.dataset.updateTo; // ovde ne mozemo destructuring tipa const { updateTo } = +btn.dataset, jer konvertujemo u Number ovo +btn.dataset i onda dohvatamo kao updateTo odatle. Ali moze ovako sad:
			const { updateTo } = btn.dataset;
			if (+updateTo > 0) handler(+updateTo); //! da ne bi otislo u minus!!!
		});
	}

	addHandlerAddBookmark(handler) {
		this._parentElement.addEventListener('click', function (e) {
			//* EVENT DELEGATION opet. Vrlo bitno i korisno i u ovom slucaju, jer ne bismo mogli da osluskujemo event bas na btn--bookmark jer to dugme kad se ovo addHandlerAddBookmark() poziva (tamo sa init()) jos uvek ne postoji, i bio bi error. Zato osluskujemo na parentu
			const btn = e.target.closest('.btn--bookmark');
			if (!btn) return;
			handler();
		});
	}

	_generateMarkup() {
		return `
            <figure class="recipe__fig">
                <img src="${this._data.image}"
                    alt="${this._data.title}" class="recipe__img"
                />
                <h1 class="recipe__title">
                    <span>${this._data.title}</span>
                </h1>
            </figure>

            <div class="recipe__details">
                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-clock"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--minutes">${
						this._data.cookingTime
					}</span>
                    <span class="recipe__info-text">minutes</span>
                </div>

                <div class="recipe__info">
                    <svg class="recipe__info-icon">
                        <use href="${icons}#icon-users"></use>
                    </svg>
                    <span class="recipe__info-data recipe__info-data--people">${
						this._data.servings
					}</span>
                    <span class="recipe__info-text">servings</span>

                    <div class="recipe__info-buttons">
                        <button class="btn--tiny btn--update-servings" data-update-to="${
							this._data.servings - 1
						}">
                            <svg>
                                <use href="${icons}#icon-minus-circle"></use>
                            </svg>
                        </button>
                        <button class="btn--tiny btn--update-servings" data-update-to="${
							this._data.servings + 1
						}">
                            <svg>
                                <use href="${icons}#icon-plus-circle"></use>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="recipe__user-generated">
                </div>
                <button class="btn--round btn--bookmark">
                    <svg class="">
                        <use href="${icons}#icon-bookmark${
			this._data.bookmarked ? '-fill' : ''
		}"></use>
                    </svg>
                </button>
            </div>

            <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                <ul class="recipe__ingredient-list">
                    ${this._data.ingredients
						.map(ing => this._generateMarkupIngredients(ing))
						.join('')}
                </ul>
            </div>

            <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__publisher">
                        ${this._data.publisher}
                    </span>. Please check out
                    directions at their website.
                </p>
                <a
                class="btn--small recipe__btn"
                href="${this._data.sourceUrl}"
                target="_blank"
                >
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </a>
            </div>
        `;
	}

	_generateMarkupIngredients(ing) {
		return `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">
                ${ing.quantity ? new Fraction(ing.quantity).toString() : ''}
            </div>
            <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
            ${ing.description}
            </div>
        </li>
        `;
	}
}
export default new RecipeView(); //! da smo exportovali citavu klasu a ne ovako instancu klase, tamo gde pozivamo neki metod iz ove kalse bismo morali da radimo sa: const recipeView = new RecipeView, pa sl linija koda: recipeView.render(model.state.recipe)
