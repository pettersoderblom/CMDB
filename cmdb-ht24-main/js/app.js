import {
  generateToplist,
  generateUserProfile,
  generateBottomRated,
  setupSearchMovieButtonAndEnter,
  generateTrendingMedia,
} from "../modules/ui.js";
import {
  getBottomRated,
  getTopRated,
  getTrendingMedia,
} from "../modules/cmdb.js";

let movies = [];

let bottomMovies = [];

let trendingMedia = [];

document.addEventListener("DOMContentLoaded", async () => {
  movies = await getTopRated();
  await generateToplist(movies);

  bottomMovies = await getBottomRated();
  await generateBottomRated(bottomMovies);

  trendingMedia = await getTrendingMedia();
  await generateTrendingMedia(trendingMedia);

  generateUserProfile();
  setupSearchMovieButtonAndEnter();
});
