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
    return;
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
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
}

export default new addRecipeView();
