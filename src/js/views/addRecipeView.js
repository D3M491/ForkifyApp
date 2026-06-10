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

  openWindow() {
    this._overlay.classList.remove('hidden');
    this._window.classList.remove('hidden');
  }

  closeWindow() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', () => {
      //Al click mi devi aprire la window
      this.openWindow();
      const window = document.querySelector('.add-recipe-window');
      window.querySelector('.upload').classList.remove('hidden');

      if (window.querySelector('.message'))
        window.querySelector('.message').remove();
    });
  }

  _addHandlerHideWindow() {
    //If user click on x or overlay , the timeout will end
    const closeHandler = () => {
      clearTimeout(this._closeTimeout);
      this.closeWindow();
    };
    this._btnClose.addEventListener('click', closeHandler);
    this._overlay.addEventListener('click', closeHandler);
  }

  //If the user do not click on x or overlay the timeout will run and close automatically the window
  timeoutCloseWindow(sec) {
    this._closeTimeout = setTimeout(this.closeWindow.bind(this), sec * 1000);
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

  renderSuccessMessage(message = this._message) {
    //hide form  , remove spinner
    const window = document.querySelector('.add-recipe-window');
    const form = document.querySelector('.upload');
    const spinner = document.querySelector('.spinner');
    form.classList.add('hidden');
    spinner.remove();

    //Message markup
    const markup = `
      
          <div class="message">
              <div>
                <svg>
                  <use href="#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;

    window.insertAdjacentHTML('beforeend', markup);
  }
}

export default new addRecipeView();
