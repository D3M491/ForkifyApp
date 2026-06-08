import async from 'regenerator-runtime';
import { API_URL } from './config';
import { RES_PER_PAGE } from './config';
import { KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  //Salvo la ricerca nello state creando un nuovo oggetto con query e risultati
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

  //Renomino le proprietà dell'oggetto dell api
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.sourceUrl,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    //Se non c'è una recipe key , non accade nulla , altrimenti me la assegni a key
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    //Controlla se l'id di qualcuno dei bookmark corrisponde all'id della ricetta corrente
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

    //Parto sempre da pagina 1 dopo una nuova ricerca
    state.search.page = 1;

    if (state.search.results.length === 0) throw new Error('err');
  } catch (err) {
    throw err;
  }
};

//Setto pagina 1 di default , definisco un inizio e una fine calcolati dinamicamente
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0 Pagina 0 => 1-1 * 10 = 0
  const end = page * state.search.resultsPerPage; //9 Pagina 0 => 1*10 = 10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  //Per ogni ingrediente aggiorna la quantità da usare secondo la proporzione
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

    //Proporzione
    //New quantity = old quantity  * new serving / old serving
  });

  //Aggiorno nello state
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  //Passo l'oggetto convertito in stringa
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //Aggiungi al bookmark
  state.bookmarks.push(recipe);

  //Marca la ricetta corrente solo se è la stessa che ho marcato come bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarks = true;

  persistBookmarks();
};

//When deleting something we need only the id
export const deleteBookmark = function (id) {
  //Trova l'index dell'id del bookmark da eliminare
  const index = state.bookmarks.findIndex(el => el.id === id);
  //Rimuovi il bookmark
  state.bookmarks.splice(index, 1);
  //Toglie il mark alla ricetta corrente solo se è la stessa che ho marcato come bookmark
  if (id === state.recipe.id) state.recipe.bookmarks = false;
  persistBookmarks();
};

const init = function () {
  //Ottieni la memoria
  const storage = localStorage.getItem('bookmarks');
  //Passa la memoria come oggetto solo se non è vuota
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

//Funzione di debug che permette di eliminare i bookmark in fretta
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
    //Salva nello state
    state.recipe = createRecipeObject(data);
    //Mettila nei bookmark
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }

  // const ingredients = Object.entries(newRecipe).filter(entry => )Object.entries(newRecipe)
};
