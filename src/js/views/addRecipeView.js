import View from './View';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _closeTimeout = null; //Save for clearing timeout

  //Not called in the controller but directly here in the constructor
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', () => {
      //Al click mi devi aprire la window
      this.toggleWindow();
      this._generateMarkup();
    });
  }

  _addHandlerHideWindow() {
    //If user click on x or overlay , the timeout will end
    const closeHandler = () => {
      clearTimeout(this._closeTimeout);
      this.toggleWindow();
    };
    this._btnClose.addEventListener('click', closeHandler);
    this._overlay.addEventListener('click', closeHandler);
  }

  //If the user do not click on x or overlay the timeout will run and close automatically the window
  timeoutCloseWindow(sec) {
    this._closeTimeout = setTimeout(this.toggleWindow.bind(this), sec * 1000);
  }

  //TODO after adding new recipe , i should be able to add another one and not see the previous success message

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      //Modern api
      const dataArr = [...new FormData(this)];
      //New feature that converts entries into object
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  //Recreate form
  _generateMarkup() {
    this._clear();
    const markup = `
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input value="TEST23" required name="title" type="text" />
          <label>URL</label>
          <input value="TEST23" required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input value="TEST23" required name="image" type="text" />
          <label>Publisher</label>
          <input value="TEST23" required name="publisher" type="text" />
          <label>Prep time</label>
          <input value="23" required name="cookingTime" type="number" />
          <label>Servings</label>
          <input value="23" required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <label>Ingredient 1</label>
          <input
            value="0.5,kg,Rice"
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
      `;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

export default new addRecipeView();
