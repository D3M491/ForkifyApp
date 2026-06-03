import icons from 'url:../../img/icons.svg'; //Parcel 2

//View comune
export default class View {
  _query;
  _data;
  get _errorMessage() {
    return 'We could not find any recipe. Please try another one!';
  }
  _message = '';
  //Metodo pubblico

  //Inserisce il markup generato
  render(data) {
    this._data = data;

    //Markup ora è ciò che _ ritorna
    const markup = this._generateMarkup();
    //Pulsci ricetta
    this._clear();
    //inserisci markup nel parentelement
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = ` 
         <div class ="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
         </div>
            `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Pulisce il campo ricetta
  _clear() {
    this._parentElement.innerHTML = '';
  }

  //Di default metto il messaggio custom
  renderError(message = this._errorMessage) {
    const markup = `
      
          <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Messaggio normale che inseriremo piu avanti
  renderMessage(message = this._message) {
    const markup = `
      
          <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
