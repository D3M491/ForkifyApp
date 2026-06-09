//Import everything from the model
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

//Polyfill tool — core-js adds ES6 methods and features to old browsers
import 'core-js/stable'; //Importing only the stable version
//Regenerator runtime makes async/await work
import 'regenerator-runtime/runtime'; //Importing only the runtime

//This is not JS but comes from Parcel
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    //Getting the URL from the search bar this way
    const id = window.location.hash.slice(1);

    if (!id) return;
    //For the spinner, simply insert it before the fetch. Then the fetch content will replace the spinner
    recipeView.renderSpinner();

    //Also show results when opening the recipe
    resultsView.update(model.getSearchResultPage());

    //Update bookmarks
    bookmarksView.update(model.state.bookmarks);

    //Loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //Call the render method of recipeView passing the recipe
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
    //Render initial pagination buttons. Passing state data with page info etc.
    paginationView.render(model.state.search);
  } catch (err) {
    //If an error occurs, render it
    resultsView.renderError();
    //And reset the buttons
    paginationView._clear();
  }
};

//New controller for pages
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
  //If not bookmarked yet, add it
  if (!model.state.recipe.bookmarks) model.addBookmark(model.state.recipe);
  //If already bookmarked, remove it
  else {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);

  //Show bookmarks
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

    //Render the recipe
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

const newFeature = function () {
  console.log('Welcome to newfeature branch');
};

//Calling the handler function in the view passing my subscriber functions
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandleAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();
