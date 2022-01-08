import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		page: 1,
		resultsPerPage: RES_PER_PAGE,
	},
	bookmarks: [],
};

const createRecipeObject = function (data) {
	let { recipe } = data.data;
	return {
		id: recipe.id,
		title: recipe.title,
		publisher: recipe.publisher,
		sourceUrl: recipe.source_url,
		image: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		...(recipe.key && { key: recipe.key }), //? ako postoji recipe.key, kreira se novi property key sa vrednoscu recipe.key i dodaje se ovom objektu sa spread-om. Ako ne postoji tj ako je recipe.key falsy, onda nista
	};
};

export const loadRecipe = async function (id) {
	try {
		// const data = await getJSON(`${API_URL}${id}`);
		const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
		// let recipe = data.data.recipe //! mozemo destructuring da uradimo

		state.recipe = createRecipeObject(data);

		if (state.bookmarks.some(bookmark => bookmark.id === id))
			state.recipe.bookmarked = true;
		else state.recipe.bookmarked = false;
	} catch (error) {
		console.error(`${error} 💥💥💥`);
		throw error;
	}
};

export const loadSearchRecipes = async function (query) {
	try {
		state.search.query = query;
		// const data = await getJSON(`${API_URL}?search=${query}`);
		const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

		state.search.results = data.data.recipes.map(rec => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
				...(rec.key && { key: rec.key }),
			};
		});

		state.search.page = 1;
	} catch (error) {
		throw error;
	}
};

export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;

	const start = (page - 1) * state.search.resultsPerPage; // 0. //? ako je page 1, a state.search.resultsPerPage je 10, onda 1-1 je 0, a 0*10 je 0
	const end = page * state.search.resultsPerPage; // 9 //? ist ako je page 1, 1*10 je 10

	return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
	// reachuje svaki state, tj recipe ingredients, ionda promeniti quantity svakog ingredienta

	state.recipe.ingredients?.forEach(ing => {
		ing.quantity = (ing.quantity * newServings) / state.recipe.servings; // newQt = oldQt * newServings / oldServings ----> 2 * 8 / 4 --> 2 * 2 --> 4
	});

	state.recipe.servings = newServings;
};

const persistBookmarks = function () {
	localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
	// Add bookmark
	state.bookmarks.push(recipe);

	// Mark current recipe as bookmark
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

	persistBookmarks();
};

export const deleteBookmark = function (id) {
	// Delete bookmark
	const index = state.bookmarks.findIndex(el => el.id === id);
	state.bookmarks.splice(index, 1);

	// Mark current recipe as NOT bookmark
	if (id === state.recipe.id) state.recipe.bookmarked = false;

	persistBookmarks();
};

const init = function () {
	const storage = localStorage.getItem('bookmarks');
	if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
	localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
	// prv osto treba da uradimo jeste da prikupljene podatke formatiramo u iste kao one koje dobijamo iz API-a ({ id: .., title: .., image: ..., ingredients: [{quantity: .., unit: '', description: '...'} ..., ]})  itd

	// console.log(Object.entries(newRecipe)); // i newRecipe sada ponovo postaje kao dataArr u addRecipeView.js u _addHandlerUpload(), dakle tj niz sa nizovima tj: (12) --> [Array(2), Array(2), Array(2), Array(2), Array(2), ....] gde je Array(2): ["title", "neki naslov polja"] ili ["sourceUrl", "source url koji smo stavili u to polje"] itd.

	try {
		const ingredients = Object.entries(newRecipe)
			.filter(
				entry => entry[0].startsWith('ingredient') && entry[1] !== ''
			)
			.map(ing => {
				const ingArr = ing[1].split(',').map(el => el.trim());

				if (ingArr.length !== 3)
					// dakle ako nemamo dva zareza tj tri clana tj kolicinu, jedinicu i opis:
					throw new Error(
						'Wrong ingredient format! Please use the correct format : )'
					); // treba da renderujemo ovaj error u view. Idemo u controller.js u controlAddRecipe i kreiramo try-catch, i u catch stavimo addRecipeView.renderError(err.message), ovo err.message je ova poruka ovde throw Error. Ovo rejectuje Promise posto smo mi u async-await f-ji, moramo i ovo u try-catch

				const [quantity, unit, description] = ingArr;

				return {
					quantity: quantity ? +quantity : null,
					unit,
					description,
				};
			});

		// creiramo object koji treba da bude uploadovan
		const recipe = {
			title: newRecipe.title,
			source_url: newRecipe.sourceUrl,
			image_url: newRecipe.image,
			publisher: newRecipe.publisher,
			cooking_time: +newRecipe.cookingTime,
			servings: +newRecipe.servings,
			ingredients,
		};
		console.log(recipe);
		// sad su podaci spremni za slanje na API. Imamo kreiran metod za getJSON, a sad treba da kreiramo sa slanje JSON-a
		// const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
		const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
		state.recipe = createRecipeObject(data);
		addBookmark(state.recipe);
	} catch (error) {
		throw error;
	}
};
