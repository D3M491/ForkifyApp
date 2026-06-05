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

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    //We are gonna compare this new markup with html existing
    const newDOM = document.createRange().createContextualFragment(newMarkup); //This method convert the string into real dom node
    const newElements = Array.from(newDOM.querySelectorAll('*')); //Elementi presenti ora + il nuovo markup
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); //Elementi presenti ora sulla pagina

    //Looping over both array
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //Controllo quali nodi son uguali e quali no
      // console.log(curEl, newEl.isEqualNode(curEl));

      //Node value permette di verificare se il nodo è di tipo testo o meno. A noi interessa modificare solo dove il contenuto è puro testo . Seleziono prima first child per ottenere il TEXT NODE che è figlio dell' ELEMENT NODE
      //Update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' //Se il dom new element è diverso dal vecchio e se il textcontent del nodo figlio è diverso da ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      //Update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        //Sostitusci i vecchi valori di ATTRIBUTO con i nuovi aggiornati
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value),
        );
      }
    });
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
