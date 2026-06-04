//Import tutto dal model
import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

//Tool di polyfill , core-js inserisce metodi e funzionalita es6 in old browsers
import 'core-js/stable'; //Importo solo la versione stable
//Regenerator runtime fa funzionare async await
import 'regenerator-runtime/runtime'; //Importo solo il runtime7s

//Questo non è js ma viene da parcel
// if (module.hot) {
//   module.hot.accept();
// }

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

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Saving query for better error handling
    resultsView.takeQuery(query);

    //Load search results
    await model.loadSearchResults(query);

    if (!model.state.search.results || model.state.search.results.length < 1)
      return;

    console.log(model.state.search.results);

    //Render results
    resultsView.render(model.getSearchResultPage());
    //Render inital pagination buttons . Passo i dati dello state con pagina ecc
    paginationView.render(model.state.search);
  } catch (err) {
    //Se vai in errore renderizzalo
    resultsView.renderError();
    //E resetta i pulsanti
    paginationView._clear();
  }
};

//Nuovo controller per le pagine
const controlPagination = function (goToPage) {
  //Render new results
  resultsView.render(model.getSearchResultPage(goToPage));
  //Render new pagination buttons
  paginationView.render(model.state.search);
};

//Chiamo la funzione handler nel view passando le mie funzioni subscriber
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
