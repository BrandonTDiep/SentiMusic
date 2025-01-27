import axiosInstance from '../utils/axiosInstance'
import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
})

/**
 * Redirects the user to Spotify login
 */
export const spotifyLogin = () => {
    // redirect the user to the login endpoint
    window.location.href = `${process.env.REACT_APP_API_URL}/api/spotify/login`
}

/**
 * Logout the user with their Spotify credentials
 */
export const spotifyLogout = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("expirationTime")

  window.location.reload()
}


/**
 *  Handle callback and retrieve tokens
 * @returns {Promise<Object>} - code
 */
export const handleSpotifyCallback = async (code) => {
    try {   
      const response = await axiosInstance.get(`/api/spotify/callback`, {
        params: { code },
      });
      return response.data;
    } catch (error) {
      console.error('Error during Spotify callback:', error);
      throw error;
    }
};

/**
 * Gets the access token from local storage
 * @returns {Promise<Object>} - new access token
 */
export const getAccessToken = async () => {
    const accessToken = localStorage.getItem("accessToken")
    const expirationTime = localStorage.getItem("expirationTime")

    if (!accessToken || new Date().getTime() > expirationTime) {
        console.log("Access token expired or missing, refreshing...")
        const newAccessToken = await refreshAccessToken()
        return newAccessToken 
    }

    console.log("Returning valid access token");
    return accessToken;
};

/**
 * Refresh the access token if it expires
 * @returns {Promise<Object>} - new access token
 */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
      console.error('No refresh token available');
      spotifyLogout()
      return null;
  }

  try {
      const response = await axiosInstance.post('/api/spotify/refreshToken', {
        refreshToken,
      });

      const { accessToken, expiresIn } = response.data;
      const newExpirationTime = new Date().getTime() + expiresIn * 1000;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('expirationTime', newExpirationTime);

      return accessToken;
  } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
  }
};

/**
 * Fetch genre recommendation based on mood
 * @returns {Promise<Object>} - spotify user data
 */
export const getSpotifyUserData = async() => {
  const accessToken = await getAccessToken()
  spotifyApi.setAccessToken(accessToken)

  try {
    const response = await spotifyApi.getMe()
    return response.body;
  } catch (error) {
    console.error("Error fetching Spotify user data:", error);
    throw error;
  }
};

/**
 * Fetch genre recommendation based on mood
 * @param {string} genre - Genres generated from OpenAI
 * @param {string} popularityThreshold - Popularity of the song
 * @returns {Promise<Object>} - Songs based on the genre
 */
export const getSpotifySongs = async(genre, popularityThreshold=20) => {
  const accessToken = await getAccessToken()
  spotifyApi.setAccessToken(accessToken)
  const randomOffset = Math.floor(Math.random() * 100);
  try {
    const searchResult = await spotifyApi.searchTracks(`genre: ${genre}`, { 
      limit: 50, 
      market: 'from_token',
      offset: randomOffset
    })

    const filteredSongs = searchResult.body.tracks.items.filter((track) => track.popularity >= popularityThreshold)

    // map the filtered songs to the desired structure
    return filteredSongs.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      album: {
        name: track.album.name, 
        external_url: track.album.external_urls.spotify, 
        image: track.album.images[2].url 
      },
      uri: track.uri,
      duration: track.duration_ms,
      external_url: track.external_urls.spotify,
      preview_url: track.preview_url,
      explicit: track.explicit,
      popularity: track.popularity,
    }));
    
  } catch (error) {
    console.error("Error fetching songs:", error);
    return []; 
  }
}

/**
 * Create spotify playlist to your spotify account
 * @param {string} playlistName - playlist description
 * @param {string} playlistDescription - playlist description
 * @param {Object} playlistSongs - array of playlist songs

 * @returns {Promise<Object>} - Songs based on the genre
 */
export const createSpotifyPlaylist = async (playlistName, playlistDescription, playlistSongs) => {
  const accessToken = await getAccessToken()
  spotifyApi.setAccessToken(accessToken)

  try {
    const playlist = await spotifyApi.createPlaylist(playlistName, {description: playlistDescription, public: true})
    const songsUris = playlistSongs.map((song) => song.uri)

    await spotifyApi.addTracksToPlaylist(playlist.body.id, songsUris)
  
  } catch (error) {
    console.error("Error creating spotify playlist:", error);
    return []; 
  }
}

