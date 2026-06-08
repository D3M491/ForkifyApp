import View from './View';
import previewView from './previewView';

class resultsView extends View {
  _parentElement = document.querySelector('.results');

  // The getter reads this._query, which is saved by takeQuery()
  get _errorMessage() {
    return `We could not find any recipe containing "${this._query}" . Please try another one!`;
  }

  takeQuery(query) {
    this._query = query;
  }

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultsView();
