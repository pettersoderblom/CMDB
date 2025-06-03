import {    
    generateUserProfile,    
    setupSearchMovieButtonAndEnter,
    generateMyFollowers,
    generateMyWatchlist,
    generateMyFollowees,
    generateTopRaters,
    generateTopReviewers,
    generateMyBadges,
  } from "../modules/ui.js";  
  
    
  document.addEventListener("DOMContentLoaded", async () => {
    
    generateMyBadges();
    generateTopReviewers();
    generateTopRaters();
    generateMyFollowees();
    generateMyFollowers();
    generateUserProfile();
    setupSearchMovieButtonAndEnter();
    generateMyWatchlist();
  });