import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime';

// if (module.hot) {
// 	module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
	//? SUBSCRIBER - code that wants to react
	try {
		const id = window.location.hash.slice(1);
		// console.log(id);

		if (!id) return; //! GUARD CLAUSES. Ako nema id-a, nemoj brate ni da executiras sledeci kod. Ovo je modern way. Stari nacin je if-else blabla, a to je samo nesting block
		recipeView.renderSpinner();

		//? 0. UPDATE RESULT VIEW TO MARK SELECTED SEARCH RESULT
		resultsView.update(model.getSearchResultsPage());
		// resultsView.render(model.getSearchResultsPage()); // sa render se opet sve zivo renderuje iz pocetka, pa se i slike ponovo ucitavaju, a sa ovim ovde update samo delovi koji su se promenili te nema flicker-a sa slikama

		//? 1. LOADING RECIPE
		await model.loadRecipe(id); //* a ovo je async function, dakle vratice Promise. Zato ovde treba da await-ujemo ovaj Promise pre nego sto predjemo na sledeci korak.

		//? 2. RENDERING RECIPE
		recipeView.render(model.state.recipe);

		// debugger;
		//? 3. UPDATING BOOKMARKS VIEW
		bookmarksView.update(model.state.bookmarks);
	} catch (err) {
		// recipeView.renderError(`💥💥💥 ${error} 💥💥💥`); //! u recipeView sad imamo pristup istoj ovoj greski u constolRecipe i catchu, zbog error propagacije koju vrsimo sa throw err. JAKO KONFUZNO
		recipeView.renderError(); //? dodali smo u recipeView.js gore #errorMessage i posle prosledili u renderError da bude defaultna vrednost argumenta u slucaju da nemamo ni jedan, kao ovde
		console.error(err);
	}
};
controlRecipes();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
//! Zamisli da imamo milion ovih eventa na kojima se poziva ista f-ja, to je ponavljanje koda. Zato lepo te evente u niz pa lupujemo kroz niz i dodajemo na window event listener
//? A OVO CEMO SAD SA PUBLISHER-SUBSCRIBER PATTERNOM
// ['hashchange', 'load'].forEach(event =>
// 	window.addEventListener(event, controlRecipes)
// );

//! SUBSCRIBER
const controlSearchResults = async function () {
	try {
		//? 1) Get search query
		const query = searchView.getQuery();
		if (!query) return;

		resultsView.renderSpinner();

		//? 2) Load search results
		await model.loadSearchRecipes(query); // ovo takodje ne vraca nista. Samo manipulise sa stejtom (state)

		//? 3) Render results
		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPage());

		//? 4) Render initial pagination buttons
		paginationView.render(model.state.search);
	} catch (error) {
		console.log(error);
	}
};
controlSearchResults();

const controlPagination = function (goToPage) {
	//* a ovo goToPage je +btn.dataset.goto iz PaginationView addHandlerClick() metoda u kom imamo ovu controLPagination() f-ju, koju prosledjujemo kao argument ovim addHandlerClick() metodom
	//? 1) Render NEW results
	resultsView.render(model.getSearchResultsPage(goToPage)); //! render ce da overwrituje markup koji je bio previously. to je zbog onog clear() metoda. DAkle pre mnego sto se neki html insertuje u elementu, prvo se obrise svaki prethodni

	//? 2) Render NEW initial pagination buttons
	paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
	//? UPDATE THE RECIPE SERVINGS (IN STATE)
	model.updateServings(newServings);

	//? UPDATE THE RECIPE VIEW
	// recipeView.render(model.state.recipe); // jbg, jeste da smo promenili samo servings a to znaci kolicinu ingredienta to quantity, ali da ne bismo sad to ponaosob menjali i pisali novi kod, ponovo cemo da renderujemo citav recept sa apdejtovanim podacima
	recipeView.update(model.state.recipe); // ovde ipak idemo sa update, razlika izmedju render i update sto ce se update-om promeniti samo elementi koji se menjaju jelte, ugl tekst, ne recimo slika itd.
};

const controlAddBookmark = function () {
	// kada zelimo da dodamo bookmark? Pa kada recept nije bookmarked
	// 1. ALL/REMOVE BOOKMARK
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// console.log(model.state.recipe);
	// 2. UPDATE RECIPE VIEW
	recipeView.update(model.state.recipe);

	// 3. RENDER BOOKMARKS
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		// Show loading spinner
		addRecipeView.renderSpinner();

		// Upload the new recipe data
		await model.uploadRecipe(newRecipe);
		console.log(model.state.recipe);

		// Render recipe
		recipeView.render(model.state.recipe);

		// Da prikazemo success poruku. Za to vec imamo kreiran renderMessage()
		addRecipeView.renderMessage();

		// Render bookmark view
		bookmarksView.render(model.state.bookmarks);

		// Change ID in URL - koristiemo history api
		window.history.pushState(null, '', `#${model.state.recipe.id}`); // menjamo url bez reloadovanja stranice. pushState() ima 3 argumenta, prvi je state koji i nije bitan, drugi je title, pa mozemo da  stavimo prazan string, a treci je url

		// Close form window
		setTimeout(() => addRecipeView.toggleWindow(), MODAL_CLOSE_SEC * 1000);
	} catch (err) {
		console.error('💥', err);
		addRecipeView.renderError(err.message);
	}
};

const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
