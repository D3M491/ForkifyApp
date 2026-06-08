//Import tutto dal model
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

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

    //Mostrami i risultati anche quando apro la ricetta
    resultsView.update(model.getSearchResultPage());

    //Aggiorna i bookmark
    bookmarksView.update(model.state.bookmarks);

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

const controlServings = function (newServings) {
  //Update recipe servings in state
  //Update view
  model.updateServings(newServings);
  //Better version :
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //Se non è tra i bookmark me la aggiungi
  if (!model.state.recipe.bookmarks) model.addBookmark(model.state.recipe);
  //Se è già tra i bookmark me la togli
  else {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);

  //Mostra i bookmark
  bookmarksView.render(model.state.bookmarks);
  if (model.state.bookmarks.length < 1) bookmarksView.renderError();
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    //Show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //Renderizza la ricetta
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //Change id in the url . pushState allow to change url without reloading
    window.history.pushState(null, '', `#${model.state.recipe.id}`); //3 arg , 1) state , 2) title , 3) url

    //Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

//Chiamo la funzione handler nel view passando le mie funzioni subscriber
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandleAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
