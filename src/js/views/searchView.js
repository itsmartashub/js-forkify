class SearchView {
	//? ova klasa nece nista da renderuje, nikakav markup,. Ona ce da osluskuje event na btn-u search, i da dohvati vrednost iz search inputa tj query
	_parentEl = document.querySelector('.search');

	getQuery() {
		const query = this._parentEl.querySelector('.search__field').value;
		this._clearInput();
		return query;
	}

	_clearInput() {
		this._parentEl.querySelector('.search__field').value = '';
	}

	//! PUBLISHER-SUBSRIBER OPET: osluskivacemo event ovde u searchView, a onda proslediti ga u controller f-ju tj handler function tj metod koji cemo ovde kreirati WTF
	//! PUBLISHER
	addHandlerSearch(handler) {
		this._parentEl.addEventListener('submit', function (e) {
			//! ovde ne mozemo odmah handler da prosledimo vec posto je submit moramo da preventujemo default
			e.preventDefault();
			handler(); // A oco ce biti controlSearchResults
		});
	}
}
export default new SearchView();
