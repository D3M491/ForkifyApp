//Common/shared base view
export default class View {
  _query;
  _data;
  get _errorMessage() {
    return 'We could not find any recipe. Please try another one!';
  }
  _message = '';

  /** JS Docs documentation
   * Render the received object to the dom
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render= true] If false create markup string instead of rendering to dom
   * @returns {undefined | string } A markup is returned if renderfalse
   * @this {Object} View instance
   * @author Manuel
   * @todo Finish implementation
   */

  //Inserts the generated markup
  render(data, render = true) {
    this._data = data;

    //Markup is now what _generateMarkup returns
    const markup = this._generateMarkup();

    if (!render) return markup;
    //Clear recipe
    this._clear();
    //Insert markup in the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    //We are gonna compare this new markup with html existing
    const newDOM = document.createRange().createContextualFragment(newMarkup); //This method convert the string into real dom node
    const newElements = Array.from(newDOM.querySelectorAll('*')); //Current elements + the new markup
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); //Elements currently on the page

    //Looping over both array
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      //Checking which nodes are equal and which are not
      // console.log(curEl, newEl.isEqualNode(curEl));

      //nodeValue checks whether the node is a text node. We only update where content is pure text. We select firstChild to get the TEXT NODE which is a child of the ELEMENT NODE
      //Update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== '' //Se il dom new element è diverso dal vecchio e se il textcontent del nodo figlio è diverso da ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      //Update changed attributes
      if (!newEl.isEqualNode(curEl)) {
        //Replace old ATTRIBUTE values with the updated new ones
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
              <use href="#icon-loader"></use>
            </svg>
         </div>
            `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Clears the recipe field
  _clear() {
    this._parentElement.innerHTML = '';
  }

  //By default uses the custom error message
  renderError(message = this._errorMessage) {
    const markup = `
      
          <div class="error">
              <div>
                <svg>
                  <use href="#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //Standard success message
  renderMessage(message = this._message) {
    const markup = `
      
          <div class="message">
              <div>
                <svg>
                  <use href="#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}

//TODO Sistema bug del messaggio di conferma ricetta

//Display number of pages between the pagination buttons
//ability to sort search result by duration or number of ingredients
//perform ingredient validation in view before submitting the form
// Improve recipe ingredient input separate in multiple fields and allow more of than 6 ing

//HARD
//Shopping list feature : Button on recipe to add ingredients to a list
//Weekly meal plannning feature : assign recipes to the next 7 days and show on a weekly calendar
//Get nutrition data on each ingredient from spoonacular API https://spoonacular.com/food-api and calculate total calories of recipe
