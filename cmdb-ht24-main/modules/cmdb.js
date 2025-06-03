import { configCmdb } from "../modules/config.js";
import { configOmdb } from "../modules/config.js";
import { showUserMessage } from "./ui.js";

const baseUrlOmdb = configOmdb.omdbApi.baseUrl;
const baseUrlCmdb = [configCmdb.cmdbApi.baseUrl];

// Gets all media from Omdb. Uses for search-function.
// We decided to keep the Omdb-call in the Cmdb-js-file (not logical, we know :) )
export async function getMovie() {
  let search = document.querySelector("#search-input").value;
  try {
    let endpoint = `${baseUrlOmdb}/?apikey=${configOmdb.omdbApi.value}&s="${search}"`;
    const response = await fetch(endpoint, { method: "GET" });

    if (!response.ok) {
      console.log("Felaktigt anrop");
      return null;
    }

    const movies = await response.json();
    if (!movies.Search || movies.Search.length === 0) {
      console.log("Inga filmer hittades");
      return null;
    }

    const limitedMovies = movies.Search.slice(0, 15);

    const detailRequests = limitedMovies.map((movie) => {
      const detailEndpoint = `${baseUrlOmdb}/?apikey=${configOmdb.omdbApi.value}&i=${movie.imdbID}`;
      return fetch(detailEndpoint).then((res) => res.json());
    });

    const detailsArray = await Promise.all(detailRequests);

    detailsArray.forEach((details, index) => {
      limitedMovies[index].imdbRating = details.imdbRating;
      limitedMovies[index].Plot = details.Plot;
    });

    return limitedMovies;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
    return null;
  }
}

// Gets media from Cmbd by imdb-id
export async function getMediaByImdbid(imdbId) {
  try {
    let endpoint = baseUrlCmdb + "/Media/" + imdbId;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });

    if (!response.ok) {
      return null;
    }

    const media = await response.json();
    return media;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
    return null;
  }
}

// Gets toprated media from Cmdb, uses to generate toplist
export async function getTopRated() {
  try {
    let endpoint =
      baseUrlCmdb +
      "/Toplists/top-rated?pageNumber=1&pageSize=10&offset=0&minVotesForRanking=2";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const topRated = await response.json();
    return topRated.data;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Gets bottomrated media from Cmdb, uses to generate bottom-list
export async function getBottomRated() {
  try {
    let endpoint =
      baseUrlCmdb +
      "/Toplists/bottom-rated?pageNumber=1&pageSize=10&offset=0&minVotesForRanking=2";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const bottomRated = await response.json();
    return bottomRated.data;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Gets trending media from Cmdb, uses to generate trending-media-list
export async function getTrendingMedia() {
  try {
    let endpoint =
      baseUrlCmdb +
      "/Toplists/trending-media?pageNumber=1&pageSize=10&sortDirection=desc&offset=0&minVotesForRanking=0&lookbackDays=3";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const bottomRated = await response.json();
    return bottomRated.data;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Posts reviews
export async function reviewMedia(mediaDto) {
  try {
    let endpoint = baseUrlCmdb + "/Contributions/Review";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
      body: JSON.stringify(mediaDto),
    });
    console.log("response", response.status);
    console.log("data", response.status);

    if (response.status === 409) {
      const errorData = await response.json();
      console.warn(errorData);
      showUserMessage("Du har redan gjort en recension på den här filmen!");
      return;
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const review = await response.json();
    showUserMessage("Din recension har mottagits!");
    return review;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Edit/update review and/or grade
export async function editReviewOrGrade(imdbId, mediaDto) {
  try {
    let endpoint = baseUrlCmdb + "/Contributions/" + imdbId;
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
      body: JSON.stringify(mediaDto),
    });
    console.log("response", response.status);
    console.log("data", response.status);

    if (response.status === 400) {
      const errorData = await response.json();
      console.warn(errorData);
      showUserMessage(
        "Du måste fylla i både rubrik och recension samt sätta betyg för att uppdatera!"
      );
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
    }

    const updatedReview = await response.json();
    showUserMessage("Din recension har uppdaterats!");
    return updatedReview;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Gets userprofile to generate name and avatar in navbar and My page
export async function getUserProfile() {
  try {
    let endpoint = baseUrlCmdb + "/Users/profile";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });
    if (response.status === 404) {
      const errorData = await response.json();
      console.warn(errorData);
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const userProfile = await response.json();
    console.log(userProfile);
    return userProfile;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Gets media from Omdb by imdbid
// We decided to keep the Omdb-call in the Cmdb-js-file (not logical, we know :) )
export async function getMediaByOmdbImdbid(imdbId) {
  try {
    let endpoint = `${baseUrlOmdb}/?apikey=${configOmdb.omdbApi.value}&i=${imdbId}`;
    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (response.status === 404) {
      const errorData = await response.json();
      console.warn(errorData.detail);
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
      return null;
    }

    const media = await response.json();
    return media;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
    return null;
  }
}

// Posts grade
export async function postGradeOfMedia(imdbId, grade) {
  try {
    let endpoint = `${baseUrlCmdb}/Contributions/Rate/${imdbId}/${grade}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });

    if (response.status === 409) {
      const errorData = await response.json();
      console.warn(errorData.detail);
      showUserMessage(
        "Du har redan satt ett betyg för den här filmen. Vill du ändra ditt betyg välj uppdatera på filmens sida istället!"
      );
    }

    if (!response.ok) {
      console.log("Felaktigt anrop", response.status);
      return null;
    }

    const responseText = await response.text();
    const media = responseText ? JSON.parse(responseText) : null;

    if (media) {
      showUserMessage("Ditt betyg har sparats!");
      return media;
    } else {
      console.warn("Inget giltigt svar från servern.");
      return null;
    }
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
    return null;
  }
}

// Gets my followers to generate on My page
export async function getMyFollowers() {
  try {
    let endpoint = baseUrlCmdb + "/Users/my-followers";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });
    if (response.status === 404) {
      const errorData = await response.json();
      console.warn(errorData);
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const userProfile = await response.json();
    console.log(userProfile);
    return userProfile;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Gets my followees to generate on My page
export async function getMyFollowees() {
  try {
    let endpoint = baseUrlCmdb + "/Users/my-followees";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });
    if (response.status === 404) {
      const errorData = await response.json();
      console.warn(errorData);
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const userProfile = await response.json();
    console.log(userProfile);
    return userProfile;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Gets watchlist (media the user would like to watch later)
export async function getMyWatchlist() {
  try {
    let endpoint = baseUrlCmdb + "/Watchlist";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });
    if (response.status === 404) {
      const errorData = await response.json();
      console.warn(errorData);
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const watchlist = await response.json();
    console.log(watchlist);
    return watchlist;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Gets overall top-raters-list
export async function getTopRatersOverall() {
  try {
    let endpoint = baseUrlCmdb + "/Badges/top-raters-overall";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });
    if (response.status === 404) {
      const errorData = await response.json();
      console.warn(errorData);
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const watchlist = await response.json();
    console.log(watchlist);
    return watchlist;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

// Gets overall top-reviewers-list
export async function getTopReviewersOverall() {
  try {
    let endpoint = baseUrlCmdb + "/Badges/top-reviewers-overall";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });
    if (response.status === 404) {
      const errorData = await response.json();
      console.warn(errorData);
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const watchlist = await response.json();
    console.log(watchlist);
    return watchlist;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}

//Posts my media in Watchlist
export async function postMediaInWatchlist(imdbId) {
  try {
    let endpoint = `${baseUrlCmdb}/Watchlist/${imdbId}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });

    if (response.status === 409) {
      const errorData = await response.text();
      console.warn(errorData);
      showUserMessage("Du har redan den här filmen i din Watchlist!");
      return null;
    }

    if (!response.ok) {
      console.log("Felaktigt anrop", response.status);
      return null;
    }

    const responseText = await response.text();
    showUserMessage("Du har lagt till filmen i din Wachlist");
    return responseText;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
    return null;
  }
}

//Gets my badges to generate on My page
export async function getMyBadges() {
  try {
    let endpoint = baseUrlCmdb + "/Badges/my";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        [configCmdb.cmdbApi.key]: configCmdb.cmdbApi.value,
      },
    });
    if (response.status === 404) {
      const errorData = await response.json();
      console.warn(errorData);
    }

    if (!response.ok) {
      console.log("felaktigt anrop");
    }
    const userProfile = await response.json();
    console.log(userProfile);
    return userProfile;
  } catch (error) {
    console.error("Kunde inte hämta, något gick fel", error);
  }
}
