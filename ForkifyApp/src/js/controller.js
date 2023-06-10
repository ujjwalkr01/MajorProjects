//Note--> whenever we use import then in html file we have to use in <script type="module">
import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";


//for pollyfilling
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

//this is coming from the parcel
// if(module.hot){
//   module.hot.accept();
// }

//we are fetching the data....
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    //  console.log(id);

    if (!id) {
      return;
    }
    recipeView.renderSpinner();

    //update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //updating the bookmarks view...
    bookmarksView.update(model.state.bookmarks);

    //1 Loading the recipe data...
    await model.loadRecipe(id);

    //console.log(await model.loadRecipe(id))

    //2 Rendering the recipe data
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    // console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //console.log(resultsView);

    //get search query
    const query = searchView.getQuery();
    if (!query) {
      return;
    }

    //load search results
    await model.loadSearchResults(query);

    //render the results
    //console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //render the intial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {}
};

const controlPagination = function (goToPage) {
  // console.log(typeof goToPage);
  //render the results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render the intial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newSevings) {
  //updating the recipe servings (in state)...
  model.updateServings(newSevings);

  //update the recipe view....
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add/remove the bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //console.log(model.state.recipe);

  //updating the recipe view....
  recipeView.update(model.state.recipe);

  //render bookmarks...
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//implementing of adding own recipe...
const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);

  try {
    //showing the loading Spinner
     addRecipeView.renderSpinner();

    //add the recipe to the model...
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change the id in url
    window.history.pushState(null,'',`#${model.state.recipe.id}`);
    

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    //console.log(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
