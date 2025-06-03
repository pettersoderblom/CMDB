import {
  getMediaByImdbid,
  getMovie,
  getTopRated,
  getUserProfile,
  postGradeOfMedia,
  getBottomRated,
  reviewMedia,
  getMyFollowers,
  getMyWatchlist,
  editReviewOrGrade,
  getMyFollowees,
  getTopRatersOverall,
  getTopReviewersOverall,
  postMediaInWatchlist,
  getMyBadges,
} from "../modules/cmdb.js";

// Generates the Toplist at start page
export async function generateToplist(movies) {
  const toplistContainer = document.querySelector(".toplist-container");

  toplistContainer.innerHTML = "";

  movies.forEach((movie, index) => {
    const article = document.createElement("article");
    const articleData = document.createElement("article-data");
    articleData.classList.add("article-data");

    const firstArticleContainer = document.createElement("div");
    firstArticleContainer.classList.add("first-article-container");

    if (index === 0) {
      const firstArticleImage = document.createElement("img");
      firstArticleImage.id = "first-article-image";
      firstArticleImage.src = "images/trophy.png";
      firstArticleContainer.appendChild(firstArticleImage);
    }

    const toplistNumber = document.createElement("p");
    toplistNumber.textContent = `${index + 1}.`;
    toplistNumber.id = "toplist-number";
    toplistNumber.style.fontSize = "20px";
    firstArticleContainer.appendChild(toplistNumber);

    articleData.appendChild(firstArticleContainer);

    const titlePosterContainer = document.createElement("div");
    titlePosterContainer.classList.add("title-poster-container");

    const title = document.createElement("h4");
    title.textContent = movie.title || "Ingen titel finns att visa";
    title.addEventListener("click", () => {
      window.location.href = `details.html?imdb_id=${movie.imdb_id}`;
    });

    const poster = document.createElement("img");
    poster.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    poster.addEventListener("click", () => {
      window.location.href = `details.html?imdb_id=${movie.imdb_id}`;
    });

    titlePosterContainer.appendChild(poster);
    titlePosterContainer.appendChild(title);

    const rating = document.createElement("p");
    rating.textContent = rating
      ? `⭐Cmdb-score: ${movie.cmdb_score.toFixed(1)}`
      : "";

    const tagline = document.createElement("p");
    tagline.textContent = movie.tagline || "";
    tagline.style.fontStyle = "italic";

    //Creates grade buttons
    const gradeContainer = document.createElement("div");
    gradeContainer.classList.add("grade-container", "rating");

    const grades = [-1, 1, 2, 3, 4, 5];
    let selectedGrade = null;

    grades.forEach((grade) => {
      const button = document.createElement("button");
      button.textContent = grade;
      button.classList.add("grade-button");

      if (grade === -1) {
        button.classList.add("red");
      } else if (grade === 1) {
        button.classList.add("orange");
      } else if (grade === 2) {
        button.classList.add("light-green");
      } else if (grade === 3) {
        button.classList.add("medium-green");
      } else if (grade === 4) {
        button.classList.add("dark-green");
      } else if (grade === 5) {
        button.classList.add("darkest-green");
      }

      button.dataset.imdbId = movie.imdb_id;

      button.addEventListener("click", (event) => {
        selectedGrade = grade;
        const buttons = document.querySelectorAll(".grade-button");
        buttons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
      });

      gradeContainer.appendChild(button);
    });

    //Creates Set Grade Button
    const executeButton = document.createElement("button");
    executeButton.textContent = "Sätt betyg";
    executeButton.classList.add("execute-button");
    executeButton.addEventListener("click", async () => {
      if (selectedGrade !== null) {
        const imdbId = movie.imdb_id;
        await postGradeOfMedia(imdbId, selectedGrade);
        console.log(`Betyg ${selectedGrade} satt för film med ID: ${imdbId}`);
      } else {
        showUserMessage("Du måste välja ett betyg!");
      }
    });

    gradeContainer.appendChild(executeButton);
    toplistContainer.appendChild(article);
    article.appendChild(articleData);
    articleData.appendChild(titlePosterContainer);
    articleData.appendChild(rating);
    articleData.appendChild(tagline);
    articleData.appendChild(gradeContainer);
  });
}

// Generates the Bottomlist at Startpage
export async function generateBottomRated(bottomMovies) {
  const toplistContainer = document.querySelector(".bottom-container");

  toplistContainer.innerHTML = "";

  bottomMovies.forEach((movie, index) => {
    const article = document.createElement("article");
    const articleData = document.createElement("article-data");
    articleData.classList.add("article-data");

    const bottomlistNumber = document.createElement("p");
    bottomlistNumber.textContent = `${index + 1}.`;
    bottomlistNumber.id = "toplist-number";
    bottomlistNumber.style.fontSize = "20px";
    articleData.appendChild(bottomlistNumber);

    const titlePosterContainer = document.createElement("div");
    titlePosterContainer.classList.add("title-poster-container");

    const title = document.createElement("h4");
    title.textContent = movie.title || "Ingen titel finns att visa";
    title.addEventListener("click", () => {
      window.location.href = `details.html?imdb_id=${movie.imdb_id}`;
    });

    const poster = document.createElement("img");
    poster.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    poster.addEventListener("click", () => {
      window.location.href = `details.html?imdb_id=${movie.imdb_id}`;
    });

    titlePosterContainer.appendChild(poster);
    titlePosterContainer.appendChild(title);

    const rating = document.createElement("p");
    rating.textContent = rating
      ? `⭐Cmdb-score: ${movie.cmdb_score.toFixed(1)}`
      : "";

    const tagline = document.createElement("p");
    tagline.textContent = movie.tagline || "";
    tagline.style.fontStyle = "italic";

    // Creates grade buttons
    const gradeContainer = document.createElement("div");
    gradeContainer.classList.add("grade-container", "rating");

    const grades = [-1, 1, 2, 3, 4, 5];
    let selectedGrade = null;

    grades.forEach((grade) => {
      const button = document.createElement("button");
      button.textContent = grade;
      button.classList.add("grade-button");

      if (grade === -1) {
        button.classList.add("red");
      } else if (grade === 1) {
        button.classList.add("orange");
      } else if (grade === 2) {
        button.classList.add("light-green");
      } else if (grade === 3) {
        button.classList.add("medium-green");
      } else if (grade === 4) {
        button.classList.add("dark-green");
      } else if (grade === 5) {
        button.classList.add("darkest-green");
      }

      button.dataset.imdbId = movie.imdb_id;

      button.addEventListener("click", (event) => {
        selectedGrade = grade;
        const buttons = document.querySelectorAll(".grade-button");
        buttons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
      });

      gradeContainer.appendChild(button);
    });

    // Creates Set Grade Button
    const executeButton = document.createElement("button");
    executeButton.textContent = "Sätt betyg";
    executeButton.classList.add("execute-button");
    executeButton.addEventListener("click", async () => {
      if (selectedGrade !== null) {
        const imdbId = movie.imdb_id;
        await postGradeOfMedia(imdbId, selectedGrade);
        console.log(`Betyg ${selectedGrade} satt för film med ID: ${imdbId}`);
      } else {
        showUserMessage("Du måste välja ett betyg!");
      }
    });

    gradeContainer.appendChild(executeButton);
    toplistContainer.appendChild(article);
    article.appendChild(articleData);
    articleData.appendChild(titlePosterContainer);
    articleData.appendChild(rating);
    articleData.appendChild(tagline);
    articleData.appendChild(gradeContainer);
  });
}

// Generates trending movies list at start page
export async function generateTrendingMedia(trendingMedia) {
  const toplistContainer = document.querySelector(".trending-container");
  toplistContainer.innerHTML = "";

  trendingMedia.forEach((movie, index) => {
    const article = document.createElement("article");
    const articleData = document.createElement("article-data");
    articleData.classList.add("article-data");

    const trendingMediaNumber = document.createElement("p");
    trendingMediaNumber.textContent = `${index + 1}.`;
    trendingMediaNumber.id = "toplist-number";
    trendingMediaNumber.style.fontSize = "20px";
    articleData.appendChild(trendingMediaNumber);

    const titlePosterContainer = document.createElement("div");
    titlePosterContainer.classList.add("title-poster-container");

    const title = document.createElement("h4");
    title.textContent = movie.title || "Ingen titel finns att visa";
    title.addEventListener("click", () => {
      window.location.href = `details.html?imdb_id=${movie.imdb_id}`;
    });

    const poster = document.createElement("img");
    poster.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    poster.addEventListener("click", () => {
      window.location.href = `details.html?imdb_id=${movie.imdb_id}`;
    });

    titlePosterContainer.appendChild(poster);
    titlePosterContainer.appendChild(title);

    const rating = document.createElement("p");
    rating.textContent = rating
      ? `⭐Cmdb-score: ${movie.cmdb_score.toFixed(1)}`
      : "";

    const tagline = document.createElement("p");
    tagline.textContent = movie.tagline || "";
    tagline.style.fontStyle = "italic";

    // Creates grade buttons
    const gradeContainer = document.createElement("div");
    gradeContainer.classList.add("grade-container", "rating");

    const grades = [-1, 1, 2, 3, 4, 5];
    let selectedGrade = null;

    grades.forEach((grade) => {
      const button = document.createElement("button");
      button.textContent = grade;
      button.classList.add("grade-button");

      if (grade === -1) {
        button.classList.add("red");
      } else if (grade === 1) {
        button.classList.add("orange");
      } else if (grade === 2) {
        button.classList.add("light-green");
      } else if (grade === 3) {
        button.classList.add("medium-green");
      } else if (grade === 4) {
        button.classList.add("dark-green");
      } else if (grade === 5) {
        button.classList.add("darkest-green");
      }

      button.dataset.imdbId = movie.imdb_id;

      button.addEventListener("click", (event) => {
        selectedGrade = grade;
        const buttons = document.querySelectorAll(".grade-button");
        buttons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
      });

      gradeContainer.appendChild(button);
    });

    // Creates Set Grade Button
    const executeButton = document.createElement("button");
    executeButton.textContent = "Sätt betyg";
    executeButton.classList.add("execute-button");
    executeButton.addEventListener("click", async () => {
      if (selectedGrade !== null) {
        const imdbId = movie.imdb_id;
        await postGradeOfMedia(imdbId, selectedGrade);
        console.log(`Betyg ${selectedGrade} satt för film med ID: ${imdbId}`);
      } else {
        showUserMessage("Du måste välja ett betyg!");
      }
    });

    gradeContainer.appendChild(executeButton);
    toplistContainer.appendChild(article);
    article.appendChild(articleData);
    articleData.appendChild(titlePosterContainer);
    articleData.appendChild(rating);
    articleData.appendChild(tagline);
    articleData.appendChild(gradeContainer);
  });
}

// Generates User Profile in nav on all pages
export async function generateUserProfile() {
  const profile = await getUserProfile();

  const userProfileContainer = document.querySelector(".user-profile");
  userProfileContainer.innerHTML = "";

  const listItem = document.createElement("li");

  const profileName = document.createElement("p");
  profileName.textContent = profile.value.username || "Användarnamn saknas";

  const profileAvatar = document.createElement("img");
  profileAvatar.src = profile.value.avatar;
  profileAvatar.alt = "User Avatar";

  [profileName, profileAvatar].forEach((element) => {
    element.style.cursor = "pointer";
    element.addEventListener("click", () => {
      window.location.href = "mypage.html";
    });
  });

  userProfileContainer.appendChild(listItem);
  listItem.appendChild(profileAvatar);
  listItem.appendChild(profileName);
}

// Creates search function in nav at all pages, with both buttonclick an enterpress, and takes user to search page
export async function setupSearchMovieButtonAndEnter() {
  const searchInput = document.querySelector("#search-input");
  const movieButton = document.querySelector("#omdb-button");

  async function performSearch() {
    const searchResultList = await getMovie(searchInput.value);
    console.log(searchResultList);

    localStorage.setItem("searchResults", JSON.stringify(searchResultList));

    window.location.href = "searchresult.html";
    searchInput.value = "";
  }

  movieButton.addEventListener("click", performSearch);

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  });
}
// Generates searchlist at search page
export async function generateSearchList(searchResultList) {
  const searchResultContainer = document.querySelector(
    ".searchresult-container"
  );
  searchResultContainer.innerHTML = "";

  for (const movie of searchResultList) {
    const article = document.createElement("article");
    const searchResultArticle = document.createElement("searchresult-article");
    searchResultArticle.classList.add("searchresult-article");

    const title = document.createElement("h4");
    title.textContent = movie.Title || "Ingen titel finns att visa";
    title.addEventListener("click", async () => {
      window.location.href = `detailssearch.html?omdb_id=${movie.imdbID}`;
    });

    const image = document.createElement("img");
    if (movie.Poster && movie.Poster !== "N/A") {
      image.src = movie.Poster;
    } else {
      image.src = "./images/noimage.jpg";
    }
    image.addEventListener("click", async () => {
      window.location.href = `detailssearch.html?omdb_id=${movie.imdbID}`;
    });

    const rating = document.createElement("p");
    if (movie.cmdb_score != null) {
      rating.textContent = rating
        ? `⭐Cmdb-rating: ${movie.cmdb_score.toFixed(1)}`
        : "";
    } else {
      rating.textContent = rating ? `⭐Imdb-rating: ${movie.imdbRating}` : "";
    }

    const plot = document.createElement("p");
    plot.textContent = movie.Plot || "";
    plot.style.fontStyle = "italic";

    // Creates grade buttons
    const gradeContainer = document.createElement("div");
    gradeContainer.classList.add("grade-container", "rating");

    const grades = [-1, 1, 2, 3, 4, 5];
    let selectedGrade = null;

    grades.forEach((grade) => {
      const button = document.createElement("button");
      button.textContent = grade;
      button.classList.add("grade-button");

      if (grade === -1) {
        button.classList.add("red");
      } else if (grade === 1) {
        button.classList.add("orange");
      } else if (grade === 2) {
        button.classList.add("light-green");
      } else if (grade === 3) {
        button.classList.add("medium-green");
      } else if (grade === 4) {
        button.classList.add("dark-green");
      } else if (grade === 5) {
        button.classList.add("darkest-green");
      }

      button.dataset.imdbId = movie.imdbID;

      button.addEventListener("click", (event) => {
        selectedGrade = grade;
        const buttons = document.querySelectorAll(".grade-button");
        buttons.forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
        console.log(`Valt betyg: ${selectedGrade}`);
      });

      gradeContainer.appendChild(button);
    });

    // Create Set Grade Button
    const executeButton = document.createElement("button");
    executeButton.textContent = "Sätt betyg";
    executeButton.classList.add("execute-button");
    executeButton.addEventListener("click", async () => {
      if (selectedGrade !== null) {
        const imdbId = movie.imdbID;
        await postGradeOfMedia(imdbId, selectedGrade);
        console.log(`Betyg ${selectedGrade} satt för film med ID: ${imdbId}`);
      } else {
        showUserMessage("Du måste välja ett betyg!");
      }
    });

    gradeContainer.appendChild(executeButton);
    searchResultContainer.appendChild(article);
    article.appendChild(searchResultArticle);
    searchResultArticle.appendChild(image);
    searchResultArticle.appendChild(title);
    searchResultArticle.appendChild(rating);
    searchResultArticle.appendChild(plot);
    searchResultArticle.appendChild(gradeContainer);
  }
}

// Generates detail page for the toplists media
export async function generateMediaDetails(media) {
  const detailsContainer = document.querySelector(".details-container");
  detailsContainer.innerHTML = "";

  const article = document.createElement("article");
  const detailsArticle = document.createElement("details-article");
  detailsArticle.classList.add("details-article");

  const poster = document.createElement("img");
  poster.src = `https://image.tmdb.org/t/p/original${media.poster_path}`;

  // Creates "Watchlist"-button
  const addToWatchlist = document.createElement("button");
  addToWatchlist.textContent = "Lägg till i Watchlist";
  addToWatchlist.classList.add("watchlist-button");
  addToWatchlist.addEventListener("click", async () => {
    await postMediaInWatchlist(media.imdb_id);
  });

  const title = document.createElement("h4");
  title.textContent = media.title || "Ingen titel finns att visa";

  const cmdbScore = document.createElement("p");
  cmdbScore.textContent = cmdbScore
    ? `⭐Cmdb-score: ${media.cmdb_score.toFixed(1)}`
    : "";

  const overview = document.createElement("p");
  overview.textContent = media.overview || "";
  overview.style.fontStyle = "italic";

  const firstAirDate = document.createElement("p");
  firstAirDate.textContent = media.first_air_date
    ? `Utgivningsår: ${media.first_air_date}`
    : "";

  const numberOfEpisodes = document.createElement("p");
  numberOfEpisodes.textContent = media.number_of_episodes
    ? `Antal episoder: ${media.number_of_episodes}`
    : "";

  const numberOfSeasons = document.createElement("p");
  numberOfSeasons.textContent = media.number_of_seasons
    ? `Antal säsonger: ${media.number_of_seasons}`
    : "";

  const genres = document.createElement("p");
  genres.textContent = media.genres
    ? `Genres: ${media.genres.map((genre) => genre.name).join(", ")}`
    : "";

  const cast = document.createElement("p");
  cast.textContent = media.cast
    ? `Skådespelare: ${media.cast
        .slice(0, 10)
        .map((cast) => cast.name)
        .join(", ")}`
    : "";
  //Infobox
  const infoBox = document.createElement("div");
  infoBox.classList.add("info-box");

  infoBox.innerHTML = `
  <p>✅Du kan välja att enbart sätta ett betyg. Klicka då på ett betyg och sedan på Sätt Betyg.</p>
  <p>✅Vill du göra en recension skriver du en rubrik, en recension och väljer ett betyg, sedan skicka recension.</p>
  <p>✅Vill du uppdatera ett redan satt betyg och/eller recension fyller du i rubrik, recension och väljer betyg och klickar sedan uppdatera recension.</p>
`;

  //Reviews
  const reviewsContainer = document.createElement("div");
  reviewsContainer.classList.add("reviews-container");

  const reviewsHeading = document.createElement("h4");
  reviewsHeading.textContent = "Recensioner";

  reviewsContainer.appendChild(reviewsHeading);

  media.reviews.forEach((review) => {
    const reviewElement = document.createElement("div");
    reviewElement.classList.add("review");

    reviewElement.innerHTML = `
          <h4>${review.title}</h4>
          <p><strong>Score:</strong> ${review.cmdb_score}</p>
          <p><em>${review.username}</em>: "${review.content}"</p>
        `;

    reviewsContainer.appendChild(reviewElement);
  });

  // Create grade buttons
  const gradeContainer = document.createElement("div");
  gradeContainer.classList.add("grade-container", "rating");

  const grades = [-1, 1, 2, 3, 4, 5];
  let selectedGrade = null;

  grades.forEach((grade) => {
    const button = document.createElement("button");
    button.textContent = grade;
    button.classList.add("grade-button");

    button.classList.add(
      grade === -1
        ? "red"
        : grade === 1
        ? "orange"
        : grade === 2
        ? "light-green"
        : grade === 3
        ? "medium-green"
        : grade === 4
        ? "dark-green"
        : "darkest-green"
    );

    button.dataset.imdb_id = media.imdb_id;

    button.addEventListener("click", () => {
      selectedGrade = grade;
      document
        .querySelectorAll(".grade-button")
        .forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
      console.log(`Valt betyg: ${selectedGrade}`);
    });

    gradeContainer.appendChild(button);
  });

  // Creates Set grade button
  const setOnlyGradeButton = document.createElement("button");
  setOnlyGradeButton.textContent = "Sätt betyg";
  setOnlyGradeButton.classList.add("execute-button");
  setOnlyGradeButton.addEventListener("click", async () => {
    if (selectedGrade !== null) {
      await postGradeOfMedia(media.imdb_id, selectedGrade);
      console.log(
        `Betyg ${selectedGrade} satt för film med ID: ${media.imdb_id}`
      );
    } else {
      showUserMessage("Du måste välja ett betyg.");
    }
  });
  gradeContainer.appendChild(setOnlyGradeButton);

  // Create form for reviews
  const reviewFormContainer = document.createElement("div");
  reviewFormContainer.classList.add("review-form");

  const form = document.createElement("form");

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Rubrik:";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "title";

  const contentLabel = document.createElement("label");
  contentLabel.textContent = "Skriv din recension:";
  const contentInput = document.createElement("textarea");
  contentInput.name = "content";

  const submitReviewButton = document.createElement("button");
  submitReviewButton.textContent = "Skicka recension";
  submitReviewButton.type = "button";
  submitReviewButton.id = "send-review";

  submitReviewButton.addEventListener("click", async () => {
    if (selectedGrade !== null) {
      const reviewData = {
        imdb_id: media.imdb_id,
        cmdb_score: selectedGrade,
        title: titleInput.value,
        content: contentInput.value,
      };

      await reviewMedia(reviewData);
      console.log("Recension skickad:", reviewData);
    } else {
      showUserMessage(
        "Du måste välja ett betyg och/eller fylla i titel och content!"
      );
    }
  });

  // Creates button to update review
  const updateReviewButton = document.createElement("button");
  updateReviewButton.textContent = "Uppdatera recension";
  updateReviewButton.type = "button";
  updateReviewButton.id = "update-review";

  updateReviewButton.addEventListener("click", async () => {
    if (selectedGrade !== null) {
      const mediaDto = {
        cmdbScore: selectedGrade,
        title: titleInput.value,
        content: contentInput.value,
      };

      await editReviewOrGrade(media.imdb_id, mediaDto);
      console.log(media.imdb_id, mediaDto);
    } else {
      showUserMessage("Du måste välja ett betyg!");
    }
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  buttonContainer.appendChild(submitReviewButton);
  buttonContainer.appendChild(updateReviewButton);

  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(contentLabel);
  form.appendChild(contentInput);
  form.appendChild(buttonContainer);

  reviewFormContainer.appendChild(form);
  detailsContainer.appendChild(article);
  article.appendChild(detailsArticle);
  detailsArticle.appendChild(poster);
  detailsArticle.appendChild(addToWatchlist);
  detailsArticle.appendChild(title);
  detailsArticle.appendChild(cmdbScore);
  detailsArticle.appendChild(overview);
  detailsArticle.appendChild(firstAirDate);
  detailsArticle.appendChild(numberOfEpisodes);
  detailsArticle.appendChild(numberOfSeasons);
  detailsArticle.appendChild(genres);
  detailsArticle.appendChild(cast);
  detailsArticle.appendChild(infoBox);
  detailsArticle.appendChild(gradeContainer);
  detailsArticle.appendChild(reviewFormContainer);
  detailsArticle.appendChild(reviewsContainer);
}

export async function generateMediaDetailsBySearch(media) {
  const detailsContainer = document.querySelector(".detailssearch-container");
  detailsContainer.innerHTML = "";

  const article = document.createElement("article");
  const detailsArticle = document.createElement("details-article");
  detailsArticle.classList.add("details-article");

  const image = document.createElement("img");
  if (media.Poster && media.Poster !== "N/A") {
    image.src = media.Poster;
  } else {
    image.src = "./images/noimage.jpg";
  }

  const title = document.createElement("h4");
  title.textContent = media.Title || "Ingen titel finns att visa";

  const rating = document.createElement("p");
  rating.textContent =
    media.cmdb_score && typeof media.cmdb_score === "number"
      ? `⭐Cmdb-score: ${media.cmdb_score.toFixed(1)}`
      : `⭐Imdb-rating: ${media.imdbRating || ""}`;

  const plot = document.createElement("p");
  plot.textContent = media.Plot || "";
  plot.style.fontStyle = "italic";

  const released = document.createElement("p");
  released.textContent = released ? `Utgivningsår: ${media.Released}` : "";

  const totalSeasons = document.createElement("p");
  totalSeasons.textContent = media.totalSeasons
    ? `Antal säsonger: ${media.totalSeasons}`
    : "";

  const genres = document.createElement("p");
  genres.textContent = genres ? `Genres: ${media.Genre}` : "";

  const actors = document.createElement("p");
  actors.textContent = actors
    ? `Skådespelare: ${media.Actors.split(", ").slice(0, 10).join(", ")}`
    : "";

  const infoBox = document.createElement("div");
  infoBox.classList.add("info-box");

  infoBox.innerHTML = `
    <p>✅Du kan välja att enbart sätta ett betyg. Klicka då på ett betyg och sedan på Sätt Betyg.</p>
    <p>✅Vill du göra en recension skriver du en rubrik, en recension och väljer ett betyg, sedan skicka recension.</p>
    <p>✅Vill du uppdatera ett redan satt betyg och/eller recension fyller du i rubrik, recension och väljer betyg och klickar sedan uppdatera recension.</p>
  `;

  // Create grades-container
  const gradeContainer = document.createElement("div");
  gradeContainer.classList.add("grade-container", "rating");

  const grades = [-1, 1, 2, 3, 4, 5];
  let selectedGrade = null;

  grades.forEach((grade) => {
    const button = document.createElement("button");
    button.textContent = grade;
    button.classList.add("grade-button");

    button.classList.add(
      grade === -1
        ? "red"
        : grade === 1
        ? "orange"
        : grade === 2
        ? "light-green"
        : grade === 3
        ? "medium-green"
        : grade === 4
        ? "dark-green"
        : "darkest-green"
    );

    button.dataset.imdb_id = media.imdbID;

    button.addEventListener("click", () => {
      selectedGrade = grade;
      document
        .querySelectorAll(".grade-button")
        .forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
      console.log(`Valt betyg: ${selectedGrade}`);
    });

    gradeContainer.appendChild(button);
  });

  // Create Set grade button
  const setOnlyGradeButton = document.createElement("button");
  setOnlyGradeButton.textContent = "Sätt betyg";
  setOnlyGradeButton.classList.add("execute-button");
  setOnlyGradeButton.addEventListener("click", async () => {
    if (selectedGrade !== null) {
      await postGradeOfMedia(media.imdbID, selectedGrade);
      console.log(
        `Betyg ${selectedGrade} satt för film med ID: ${media.imdbID}`
      );
    } else {
      showUserMessage("Du måste välja ett betyg!");
    }
  });
  gradeContainer.appendChild(setOnlyGradeButton);

  // Creates form for reviews
  const reviewFormContainer = document.createElement("div");
  reviewFormContainer.classList.add("review-form");

  const form = document.createElement("form");

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Rubrik";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.name = "title";

  const contentLabel = document.createElement("label");
  contentLabel.textContent = "Skriv din recension här:";
  const contentInput = document.createElement("textarea");
  contentInput.name = "content";

  // Creates button for review
  const submitReviewButton = document.createElement("button");
  submitReviewButton.textContent = "Skicka recension";
  submitReviewButton.type = "button";
  submitReviewButton.id = "send-review";

  submitReviewButton.addEventListener("click", async () => {
    if (selectedGrade !== null) {
      const reviewData = {
        imdb_id: media.imdbID,
        cmdb_score: selectedGrade,
        title: titleInput.value,
        content: contentInput.value,
      };

      await reviewMedia(reviewData);
      console.log("Recension skickad:", reviewData);
    } else {
      showUserMessage("Du måste välja ett betyg!");
    }
  });

  // Creates button tu update review
  const updateReviewButton = document.createElement("button");
  updateReviewButton.textContent = "Uppdatera recension";
  updateReviewButton.type = "button";
  updateReviewButton.id = "update-review";

  updateReviewButton.addEventListener("click", async () => {
    if (selectedGrade !== null) {
      const mediaDto = {
        cmdbScore: selectedGrade,
        title: titleInput.value,
        content: contentInput.value,
      };

      await editReviewOrGrade(media.imdbID, mediaDto);
      console.log(media.imdbID, mediaDto);
    } else {
      showUserMessage(
        "Du måste välja ett betyg och/eller fylla i titel och innehåll!"
      );
    }
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  buttonContainer.appendChild(submitReviewButton);
  buttonContainer.appendChild(updateReviewButton);

  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(contentLabel);
  form.appendChild(contentInput);
  form.appendChild(buttonContainer);

  reviewFormContainer.appendChild(form);
  detailsContainer.appendChild(article);
  article.appendChild(detailsArticle);
  detailsArticle.appendChild(image);
  detailsArticle.appendChild(title);
  detailsArticle.appendChild(rating);
  detailsArticle.appendChild(plot);
  detailsArticle.appendChild(released);
  detailsArticle.appendChild(totalSeasons);
  detailsArticle.appendChild(genres);
  detailsArticle.appendChild(actors);
  detailsArticle.appendChild(infoBox);

  //Reviews

  if (media.reviews != null) {
    const reviewsContainer = document.createElement("div");
    reviewsContainer.classList.add("reviews-container");

    const reviewsHeading = document.createElement("h4");
    reviewsHeading.textContent = "Recensioner";

    reviewsContainer.appendChild(reviewsHeading);

    if (Array.isArray(media.reviews)) {
      media.reviews.forEach((review) => {
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review");

        reviewElement.innerHTML = `
          <h4>${review.title}</h4>
          <p><strong>Betyg:</strong> ${review.cmdb_score}</p>
          <p><em>${review.username}</em>: "${review.content}"</p>
        `;
        document.querySelector(".reviews-container");
        reviewsContainer.appendChild(reviewElement);
      });
    } else {
      console.log("Inga recensioner tillgängliga.");
    }

    detailsArticle.appendChild(gradeContainer);
    detailsArticle.appendChild(reviewFormContainer);
    detailsArticle.appendChild(reviewsContainer);
  }
}
// Generats my followers in member page
export async function generateMyFollowers() {
  const followerContainer = document.querySelector(".myfollower-container");
  followerContainer.innerHTML = "";

  const followers = await getMyFollowers();

  const followersDiv = document.createElement("div");
  followersDiv.classList.add("followers-list");

  followers.forEach((follower) => {
    const followerItem = document.createElement("div");
    followerItem.classList.add("follower-item");

    const followerAvatar = document.createElement("img");
    followerAvatar.src = follower.avatar || "";

    const followerName = document.createElement("p");
    followerName.textContent = follower.username || "Okänd användare";

    followerItem.appendChild(followerAvatar);
    followerItem.appendChild(followerName);

    followersDiv.appendChild(followerItem);
  });

  followerContainer.appendChild(followersDiv);
}

// Generates "My followees" in My Page
export async function generateMyFollowees() {
  const followeeContainer = document.querySelector(".myfollowee-container");
  followeeContainer.innerHTML = "";

  const followees = await getMyFollowees();

  const followeesDiv = document.createElement("div");
  followeesDiv.classList.add("followers-list");

  followees.forEach((followee) => {
    const followeeItem = document.createElement("div");
    followeeItem.classList.add("followee-item");

    const followeeAvatar = document.createElement("img");
    followeeAvatar.src = followee.avatar || "";

    const followeeName = document.createElement("p");
    followeeName.textContent = followee.username || "Okänd användare";

    followeeItem.appendChild(followeeAvatar);
    followeeItem.appendChild(followeeName);

    followeesDiv.appendChild(followeeItem);
  });

  followeeContainer.appendChild(followeesDiv);
}

// Generates my watchlist in member page
export async function generateMyWatchlist() {
  const myWatchlistContainer = document.querySelector(".mywatchlist-container");
  myWatchlistContainer.innerHTML = "";

  const watchlists = await getMyWatchlist();

  const watchlistDiv = document.createElement("div");
  watchlistDiv.classList.add("watchlist");

  watchlists.value.forEach((watchlist) => {
    const watchlistMedia = document.createElement("div");

    const watchlistImage = document.createElement("img");
    watchlistImage.src =
      `https://image.tmdb.org/t/p/original${watchlist.poster_path}` || "";

    watchlistMedia.appendChild(watchlistImage);
    watchlistDiv.appendChild(watchlistMedia);
  });

  myWatchlistContainer.appendChild(watchlistDiv);
}

// Generates top raters list in member page
export async function generateTopRaters() {
  const topRatersContainer = document.querySelector(".topraters-container");
  topRatersContainer.innerHTML = "";

  const topRaters = await getTopRatersOverall();

  const topRatersDiv = document.createElement("div");
  topRatersDiv.classList.add("topraters");

  const header = document.createElement("div");
  header.classList.add("topraters-header");

  const rankHeader = document.createElement("div");
  rankHeader.textContent = "Ranking";
  const nameHeader = document.createElement("div");
  nameHeader.textContent = "Username";
  const countHeader = document.createElement("div");
  countHeader.textContent = "Antal";

  header.appendChild(rankHeader);
  header.appendChild(nameHeader);
  header.appendChild(countHeader);
  topRatersDiv.appendChild(header);

  topRaters.forEach((topRatee) => {
    const topRaterRow = document.createElement("div");
    topRaterRow.classList.add("topraters-row");

    const rank = document.createElement("div");
    rank.textContent = topRatee.rank || "0";

    const name = document.createElement("div");
    name.textContent = topRatee.username || "Ingen titel finns";

    const count = document.createElement("div");
    count.textContent = topRatee.ratingsCount || "0";

    topRaterRow.appendChild(rank);
    topRaterRow.appendChild(name);
    topRaterRow.appendChild(count);
    topRatersDiv.appendChild(topRaterRow);
  });

  topRatersContainer.appendChild(topRatersDiv);
}

// Generates top reviewers list in member page
export async function generateTopReviewers() {
  const topReviewersContainer = document.querySelector(
    ".topreviewers-container"
  );
  topReviewersContainer.innerHTML = "";

  const header = document.createElement("div");
  header.classList.add("topreviewers-header");

  const rankHeader = document.createElement("div");
  rankHeader.textContent = "Ranking";
  const nameHeader = document.createElement("div");
  nameHeader.textContent = "Username";
  const countHeader = document.createElement("div");
  countHeader.textContent = "Antal";

  header.appendChild(rankHeader);
  header.appendChild(nameHeader);
  header.appendChild(countHeader);
  topReviewersContainer.appendChild(header);

  const topReviewers = await getTopReviewersOverall();

  topReviewers.forEach((topReviewee) => {
    const topReviewerRow = document.createElement("div");
    topReviewerRow.classList.add("topreviewers-row");

    const rank = document.createElement("div");
    rank.textContent = topReviewee.rank || "0";

    const name = document.createElement("div");
    name.textContent = topReviewee.username || "Ingen titel finns";

    const count = document.createElement("div");
    count.textContent = topReviewee.reviewsCount || "0";

    topReviewerRow.appendChild(rank);
    topReviewerRow.appendChild(name);
    topReviewerRow.appendChild(count);

    topReviewersContainer.appendChild(topReviewerRow);
  });
}

// Generates my badges in member page
export async function generateMyBadges() {
  const myBadgesContainer = document.querySelector(".mybadges-container");
  myBadgesContainer.innerHTML = "";

  const myBadges = await getMyBadges();

  const totalBadges = document.createElement("div");
  totalBadges.classList.add("total-badges");
  totalBadges.textContent = `🏅Totalt antal märken: ${
    myBadges.value.totalBadges || "0"
  }`;
  myBadgesContainer.appendChild(totalBadges);

  const myBadgesDiv = document.createElement("ul");
  myBadgesDiv.classList.add("badges-list");

  myBadges.value.confirmedBadges.forEach((myBadge) => {
    const badgeItem = document.createElement("li");
    badgeItem.classList.add("badge-item");

    const badgeName = document.createElement("h4");
    badgeName.textContent = myBadge.name;

    const badgeDescription = document.createElement("p");
    badgeDescription.textContent = myBadge.description;

    const badgeDifficulty = document.createElement("p");
    badgeDifficulty.textContent = `Svårighetsgrad: ${myBadge.difficulty}`;

    badgeItem.appendChild(badgeName);
    badgeItem.appendChild(badgeDescription);
    badgeItem.appendChild(badgeDifficulty);

    myBadgesDiv.appendChild(badgeItem);
  });

  myBadgesContainer.appendChild(myBadgesDiv);
}

// Show message to the user
export async function showUserMessage(message) {
  const alertBox = document.getElementById("custom-alert");
  const alertMessage = document.getElementById("alert-message");

  alertMessage.textContent = message;
  alertBox.style.display = "flex";

  const closeButton = document.getElementById("close-alert");
  closeButton.onclick = function () {
    alertBox.style.display = "none";
  };
}
