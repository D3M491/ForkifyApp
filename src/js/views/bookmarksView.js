import View from './View';
import previewView from './previewView';

class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks');

  get _errorMessage() {
    return `No bookmarks yet . Find a nice recipe and bookmark it `;
  }

  takeQuery(query) {
    this._query = query;
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new bookmarksView();
