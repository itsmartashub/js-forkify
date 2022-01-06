import View from './View.js';
// import icons from 'url:../../img/icons.svg'; //! Parcel 2

class AddRecipeView extends View {
	_parentElement = document.querySelector('.upload');
	_window = document.querySelector('.add-recipe-window');
	_overlay = document.querySelector('.overlay');
	_btnOpen = document.querySelector('.nav__btn--add-recipe');
	_btnClose = document.querySelector('.btn--close-modal');

	constructor() {
		super();
		this._addHandlerShowWindow();
		this._addHandlerHideWindow();
	}

	toggleWindow() {
		this._overlay.classList.toggle('hidden');
		this._window.classList.toggle('hidden');
	}

	_addHandlerShowWindow() {
		//* kada zelimo da se ova f-ja pozove? Cim se stranica ucita, ali ovo sad nemamo u controll.js kao ostali handleri, jer se ovde nista spec. ne desala za sta bi nam i bio potreban controller. Zato cemo ovu f-ju pozvati cim se kreira AddRecipeView klasa, dakle u njenon konstruktoru
		// this._btnOpen.addEventListener('click', function () {
		// 	this._overlay.classList.toggle('hidden');
		// 	this._window.classList.toggle('hidden');
		// 	//! ne moze kao ovo gore zbog klj reci this, koja ukazuje ovde na onaj el. kom je dodat addEventListener, dakle this._btnOpen. Pa cemo ovo ipak u poseban metod koji cemo pozvati ovde, i dodati .bind(this) na njega
		// });

		this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
	}

	_addHandlerHideWindow() {
		this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
		this._overlay.addEventListener('click', this.toggleWindow.bind(this));
	}

	_addHandlerUpload(handler) {
		this._parentElement.addEventListener('submit', function (e) {
			e.preventDefault();
			const dataArr = [...new FormData(this)]; //! ovo je novo prilicno. u new FormData prosledjujemo element koji je forma, u ovom slucaju this keyword jer ovde this ukazuje na _parentElement. Ovo new FormData(this) vraca cudan objekat koji ba i ne mozemo da koristimo pa cemo da ga spread-ujemo u array sa [...] i to onda vraca niz sa svim poljima sa svim svojim vrednostima. U tom nizu su nizovi: prvi clan je uvek ime polja forme (name), i drugi clan je vrednost polja (value), buk entries of form. I sad treba da vidimo sta zelimo sa ovim podacima, a zelimo da ih uploadujemo na API, a ta akcija ucitavanja podataka ce biti jos jedan API call, jelte. A gde se oni vrse? U model.js, tako da treba da ove podatke dostavimo u modal, a kako to radimo? Preko controll.js ofc, tj kreiramo control f-ju koja ce biti handler od ovog eventa.
			//! Inace, recipe data su ugl objekat, a ne array of entries, pa hajde ovaj niz sa nizovima da pretovrimo u objekat. U es2019 sada postoji novi metod koji to radi, tj pretvara entries u object: Object.fromEntries(dataArr)

			const data = Object.fromEntries(dataArr);
			handler(data); // ovo mu dodje controlAddRecipe(newData)
		});
	}

	_generateMarkup() {}
}

export default new AddRecipeView(); //! ali iako ovu klasu ne kor u controll.js (jer je to THE MAIN SCRIPT) ipak je moramo tamo importovati, jer u suprotnom nasa glavna skripta tj kontroler nikad ne bi execute ovaj fajl, tj ovaj objekat nikad ne bi bio kreiran, tako da ni ovi event listeneri ne bi nikad bili dodati
