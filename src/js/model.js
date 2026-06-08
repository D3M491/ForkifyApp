import async from 'regenerator-runtime';
import { API_URL } from './config';
import { RES_PER_PAGE } from './config';
import { KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  //Saving the search in state by creating a new object with query and results
  search: {
    query: '',
    results: [],
    page: 1, //Default
    resultsPerPage: RES_PER_PAGE, //Default
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  //Renaming the API object properties
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.sourceUrl,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //If there is no recipe key, nothing happens; otherwise assign it to key
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    //Check if any bookmark's id matches the current recipe's id
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarks = true;
    else state.recipe.bookmarks = false;
  } catch (err) {
    // console.error(`${err} 🔥🔥`);
    throw err;
  }
};

//The controller will call this function
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
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

    //Always start from page 1 after a new search
    state.search.page = 1;

    if (state.search.results.length === 0) throw new Error('err');
  } catch (err) {
    throw err;
  }
};

//Setting page 1 as default, defining a dynamically calculated start and end
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0 Pagina 0 => 1-1 * 10 = 0
  const end = page * state.search.resultsPerPage; //9 Pagina 0 => 1*10 = 10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  //For each ingredient, update the quantity according to the proportion
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

    //Proporzione
    //New quantity = old quantity  * new serving / old serving
  });

  //Update in state
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  //Passing the object converted to a string
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Add to bookmarks
  state.bookmarks.push(recipe);

  //Mark the current recipe only if it's the same one being bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarks = true;

  persistBookmarks();
};

//When deleting something we need only the id
export const deleteBookmark = function (id) {
  //Find the index of the bookmark id to delete
  const index = state.bookmarks.findIndex(el => el.id === id);
  //Remove the bookmark
  state.bookmarks.splice(index, 1);
  //Unmark the current recipe only if it's the same one that was bookmarked
  if (id === state.recipe.id) state.recipe.bookmarks = false;
  persistBookmarks();
};

const init = function () {
  //Get the stored data
  const storage = localStorage.getItem('bookmarks');
  //Parse the stored data as an object only if it's not empty
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

//Debug function that allows quickly clearing all bookmarks
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format , please use the correct format',
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    //Save in state
    state.recipe = createRecipeObject(data);
    //Add it to bookmarks
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }

  // const ingredients = Object.entries(newRecipe).filter(entry => )Object.entries(newRecipe)
};
