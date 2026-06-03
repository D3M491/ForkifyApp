//Import tutto dal model
import * as model from './model.js';
import recipeView from './views/recipeView';

//Tool di polyfill , core-js inserisce metodi e funzionalita es6 in old browsers
import 'core-js/stable'; //Importo solo la versione stable
//Regenerator runtime fa funzionare async await
import 'regenerator-runtime/runtime'; //Importo solo il runtime7s

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //Ottengo l'url della barra di ricerca così
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    //Per lo spinner semplicemente lo inserisco prima del fetch . Poi il contenuto del fetch sostituirà lo spinner
    recipeView.renderSpinner();

    //Loading recipe
    await model.loadRecipe(id);
    console.log(model.state);
    const { recipe } = model.state;
    console.log(recipe);

    //Chiama il metodo render della classe recipeView passando la ricetta
    recipeView.render(model.state.recipe);
  } catch (err) {
    alert(err);
  }
};

controlRecipes();

//Ascoltando il cambio di hash nella barra di ricerca e il load , poi chiamo la funzione
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipes));
