import View from './View';
import icons from '../../img/icons.svg';

class resultsView extends View {
  _parentElement = document.querySelector('.results');

  // Il getter legge this._query, che viene salvato da takeQuery()
  get _errorMessage() {
    return `We could not find any recipe containing "${this._query}" . Please try another one!`;
  }

  takeQuery(query) {
    this._query = query;
  }

  _generateMarkup() {
    return this._data.map(this._generatMarkupPreview).join('');
  }

  _generatMarkupPreview(result) {
    return `
    <li class="preview">
            <a class="preview__link" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}"/>
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
              </div>
            </a>
          </li>
    
    `;
  }
}

export default new resultsView();
