import {
  generateUserProfile,
  generateMediaDetailsBySearch,
  setupSearchMovieButtonAndEnter,
} from "../modules/ui.js";
import {
  getMovie,
  getMediaByOmdbImdbid,
  getMediaByImdbid,
  reviewMedia,
} from "../modules/cmdb.js";

let searchResultList = [];

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const imdbID = params.get("omdb_id");

  try {
    const [omdb_response, cmdb_response] = await Promise.all([
      getMediaByOmdbImdbid(imdbID),
      getMediaByImdbid(imdbID),
    ]);

    const omdb_data = await omdb_response;
    const cmdb_data = await cmdb_response;

    const media = { ...omdb_data };

    media.cmdb_score = cmdb_data?.cmdb_score || "Ingen score tillgänglig";
    media.reviews = cmdb_data?.reviews || "Inga recensioner tillgängliga";

    generateMediaDetailsBySearch(media);
  } catch (error) {
    console.error("Ett fel inträffade vid hämtning av data:", error);
  }

  generateUserProfile();
  setupSearchMovieButtonAndEnter();
});
