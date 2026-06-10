import View from './View';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    //Delegation
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    //Calculate the total number of pages
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );

    //Page 1 and there are other pages
    if (currentPage === 1 && numPages > 1)
      return `

          <button class="btn--inline pagination__btn--center">
            <span>Page ${numPages}</span>
          </button>

          <button data-goto = "${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="#icon-arrow-right"></use>
            </svg>
          </button>`;
    //Page 1 and there are not other pages
    if (currentPage === 1 && numPages <= 1) return ``;

    //Last page
    if (currentPage === numPages && numPages > 1)
      return `
          
          <button class="btn--inline pagination__btn--center">
            <span>Page ${numPages}</span>
          </button>

          <button data-goto = "${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>`;
    //Other pages
    if (currentPage < numPages)
      return `
          
         <button class="btn--inline pagination__btn--center">
            <span>Page ${numPages}</span>
         </button>

         <button data-goto = "${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>

          <button data-goto = "${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="#icon-arrow-right"></use>
            </svg>
          </button>`;
  }
}

export default new paginationView();
