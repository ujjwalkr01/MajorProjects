import View from "./View.js";
import icons from "url:../../img/icons.svg";

class Pagination extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      // console.log(btn);

      if (!btn) {
        return;
      }
      const goToPage = Number(btn.dataset.goto);
      //console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // console.log(numPages);

    //if we are on page 1 and there are other pages...
    if (currPage === 1 && numPages > 1) {
      //console.log(this._generateMarkupNextBtn(currPage));
      return this._generateMarkupNextBtn(currPage);
    }

    //if we are on last page...
    if (currPage === numPages && numPages > 1) {
      //console.log(this._generateMarkupPrevBtn(currPage));
      return this._generateMarkupPrevBtn(currPage);
    }

    //if  we are on other page.....
    if (currPage < numPages) {
      return [
        this._generateMarkupPrevBtn(currPage),
        this._generateMarkupNextBtn(currPage),
      ];
    }
    //if we are on page 1 and there are no other pages...
    return "";
  }
  _generateMarkupPrevBtn(currPage) {
    console.log(currPage);
    return `<button data-goto="${
      currPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>`;
  }

  _generateMarkupNextBtn(currPage) {
    return `      
    <button data-goto="${
      currPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
      `;
  }
}

export default new Pagination();
