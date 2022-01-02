import icons from 'url:../../img/icons.svg';

export default class View {
	//* ovde ne exportujemo instancu vec bas klasu, jer cemo je koristiti kao parent klasu ostalim child view-ima
	_data;

	render(data) {
		// ovde je data recipe iz modal.state
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError(); // ovo radi samo ako je array tj data undefined ili null. a sta ako je [] tj empty

		this._data = data;
		const markup = this._generateMarkup();
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	update(data) {
		this._data = data;
		const newMarkup = this._generateMarkup();
		const newDOM = document
			.createRange()
			.createContextualFragment(newMarkup);
		const newElements = Array.from(newDOM.querySelectorAll('*')); // Ovo je NodeList, pa moramo da pertvorimo u niz sa Array.from()
		const curElements = Array.from(
			this._parentElement.querySelectorAll('*')
		);

		newElements.forEach((newEl, i) => {
			const curEl = curElements[i]; //? zelimo da lupujemo kroz oba niza (i newElements i curElements) te nam je zato potreban index
			// console.log(curEl, newEl.isEqualNode(curEl));

			//* isEqualNode() poredi CONTENT od newEl i curEl da li je isto ili ne (true ili false)
			//? Update change TEXT
			if (
				!newEl.isEqualNode(curEl) &&
				newEl.firstChild?.nodeValue.trim() !== ''
			) {
				// console.log(newEl.firstChild.nodeValue.trim());
				curEl.textContent = newEl.textContent;
			}
			//kada gose se content elementa promeni, zelimo da promenimo i atribut
			//? Update change ATTRIBUTES
			if (!newEl.isEqualNode(curEl))
				Array.from(newEl.attributes).forEach(attr =>
					curEl.setAttribute(attr.name, attr.value)
				);
		});
	}

	_clear() {
		this._parentElement.innerHTML = '';
	}

	renderSpinner() {
		const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;

		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	renderError(message = this._errorMessage) {
		const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}

	renderMessage(message = this._message) {
		const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;
		this._clear();
		this._parentElement.insertAdjacentHTML('afterbegin', markup);
	}
}
