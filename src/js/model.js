import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
	recipe: {},
	search: {
		query: '',
		results: [],
		page: 1,
		resultsPerPage: RES_PER_PAGE,
	},
};

export const loadRecipe = async function (id) {
	try {
		const data = await getJSON(`${API_URL}${id}`);
		// let recipe = data.data.recipe //! mozemo destructuring da uradimo
		let { recipe } = data.data;
		state.recipe = {
			id: recipe.id,
			title: recipe.title,
			publisher: recipe.publisher,
			sourceUrl: recipe.source_url,
			image: recipe.image_url,
			servings: recipe.servings,
			cookingTime: recipe.cooking_time,
			ingredients: recipe.ingredients,
		};

		// console.log(state.recipe);
	} catch (error) {
		console.error(`${error} 💥💥💥`);
		throw error;
	}
};

export const loadSearchRecipes = async function (query) {
	try {
		state.search.query = query;
		const data = await getJSON(`${API_URL}?search=${query}`);

		state.search.results = data.data.recipes.map(rec => {
			return {
				id: rec.id,
				title: rec.title,
				publisher: rec.publisher,
				image: rec.image_url,
			};
		});
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
