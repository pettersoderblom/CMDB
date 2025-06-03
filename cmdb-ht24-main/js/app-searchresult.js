import {
  generateUserProfile,
  generateSearchList,
  setupSearchMovieButtonAndEnter,
} from "../modules/ui.js";
import { getMovie } from "../modules/cmdb.js";

let searchResultList = [];

document.addEventListener("DOMContentLoaded", async () => {
  generateUserProfile();
  setupSearchMovieButtonAndEnter();

  const searchResults = JSON.parse(localStorage.getItem("searchResults")) || [];

  generateSearchList(searchResults);
});
