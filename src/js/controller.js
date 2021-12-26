import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		// console.log(id);

		if (!id) return; //! GUARD CLAUSES. Ako nema id-a, nemoj brate ni da executiras sledeci kod. Ovo je modern way. Stari nacin je if-else blabla, a to je samo nesting block

		recipeView.renderSpinner();
		//? 1. LOADING RECIPE
		await model.loadRecipe(id); //* a ovo je async function, dakle vratice Promise. Zato ovde treba da await-ujemo ovaj Promise pre nego sto predjemo na sledeci korak.

		//? 2. RENDERING RECIPE
		recipeView.render(model.state.recipe);
	} catch (error) {
		console.error(error);
	}
};
controlRecipes();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
//! Zamisli da imamo milion ovih eventa na kojima se poziva ista f-ja, to je ponavljanje koda. Zato lepo te evente u niz pa lupujemo kroz niz i dodajemo na window event listener
['hashchange', 'load'].forEach(event =>
	window.addEventListener(event, controlRecipes)
);
