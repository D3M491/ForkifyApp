import async from 'regenerator-runtime';
import { API_URL } from './config';
import { RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  //Salvo la ricerca nello state creando un nuovo oggetto con query e risultati
  search: {
    query: '',
    results: [],
    page: 1, //Default
    resultsPerPage: RES_PER_PAGE, //Default
  },
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);
    //creating copy of object
    const { recipe } = data.data;

    //Renomino le proprietà dell'oggetto dell api
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.sourceUrl,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    // console.error(`${err} 🔥🔥`);
    throw err;
  }
};

//The controller will call this function
export const loadSearchResults = async function (query) {
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
