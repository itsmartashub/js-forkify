import View from './View.js';
import icons from 'url:../../img/icons.svg'; //! Parcel 2

class PaginationView extends View {
	_parentElement = document.querySelector('.pagination');

	addHandlerClick(handler) {
		//* ovo handler je controlPagination() f-ja iz controller.js
		// posto imamo dva buttona, radicemo sa event delegation, ondnosno event listener cemo metnuti na parenta njihovog, a to je .pagination
		this._parentElement.addEventListener('click', function (e) {
			const btn = e.target.closest('.btn--inline');
			if (!btn) return; //! dako se ne klikne na button, tj na neka od ova dva, da odmah vrati i ne nastavja kod jer budu errori

			const goToPage = +btn.dataset.goto; //! sa plusem konvertujemo ovaj string (posto je iz html-a) u number

			handler(goToPage); //* ovo handler je controlPagination() f-ja iz controller.js
		});
	}

	_generateMarkup() {
		// console.log(this._data); // i ovde je sad ovo _data citav taj search objekat koji smo prosledili iz controller.js paginationView.render()
		const curPage = this._data.page;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);
		// console.log(numPages);

		//? Page 1, and there r other pages
		if (curPage === 1 && numPages > 1) {
			return `
                <button data-goto="${
					curPage + 1
				}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
		}

		//? Last page
		if (curPage === numPages && numPages > 1) {
			return `
                <button data-goto="${
					curPage - 1
				}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
            `;
		}
		//? Other page
		if (curPage < numPages) {
			return `
                <button data-goto="${
					curPage - 1
				}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
                <button data-goto="${
					curPage + 1
				}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
		}

		//? Page 1, and there are NO other pages
		return '';
	}
}

export default new PaginationView();
