//Import tutto dal model
import * as model from './model.js';
import recipeView from './views/recipeView';

//Tool di polyfill , core-js inserisce metodi e funzionalita es6 in old browsers
import 'core-js/stable'; //Importo solo la versione stable
//Regenerator runtime fa funzionare async await
import 'regenerator-runtime/runtime'; //Importo solo il runtime7s

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //Ottengo l'url della barra di ricerca così
    const id = window.location.hash.slice(1);

    if (!id) return;
    //Per lo spinner semplicemente lo inserisco prima del fetch . Poi il contenuto del fetch sostituirà lo spinner
    recipeView.renderSpinner();

    //Loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //Chiama il metodo render della classe recipeView passando la ricetta
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

//Chiamo la funzione handler nel view passando la mia funzione subscriber
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};

init();
