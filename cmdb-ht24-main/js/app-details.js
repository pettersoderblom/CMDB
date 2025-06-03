import {
  generateUserProfile,
  generateMediaDetails,
  setupSearchMovieButtonAndEnter,
} from "../modules/ui.js";
import { getMovie, getMediaByImdbid, reviewMedia } from "../modules/cmdb.js";

let searchResultList = [];

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const imdbId = params.get("imdb_id");

  const media = await getMediaByImdbid(imdbId);

  generateUserProfile();
  setupSearchMovieButtonAndEnter();
  generateMediaDetails(media);
});
