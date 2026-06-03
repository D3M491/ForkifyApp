class searchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  //Publisher . Mi esegui la funzione ottenuta tramite arg al submit del parent el form
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      //Preventing page reload
      e.preventDefault();
      handler();
    });
  }
}

export default new searchView();
