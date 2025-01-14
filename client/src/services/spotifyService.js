import axiosInstance from '../utils/axiosInstance'
import SpotifyWebApi from "spotify-web-api-node"

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
})

export const spotifyLogin = () => {
    // redirect the user to the login endpoint
    window.location.href = `${process.env.REACT_APP_API_URL}/api/spotify/login`
}

export const spotifyLogout = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("expirationTime")

  window.location.reload()
}

// Function to handle callback and retrieve tokens
export const handleSpotifyCallback = async (code) => {
    try {   
      const response = await axiosInstance.get(`/api/spotify/callback`, {
        params: { code },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error during Spotify callback:', error);
      throw error;
    }
};

export const getAccessToken = async () => {
    const accessToken = localStorage.getItem("accessToken")
    const expirationTime = localStorage.getItem("expirationTime")

    console.log("Access Token:", accessToken)
    console.log("Expiration Time:", expirationTime)

    if (!accessToken || new Date().getTime() > expirationTime) {
        console.log("Access token expired or missing, refreshing...")
        const newAccessToken = await refreshAccessToken()
        return newAccessToken 
    }

    console.log("Returning valid access token");
    return accessToken;
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
      console.error('No refresh token available');
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

export const getSpotifySongs = async(genre, popularityThreshold=20) => {
  const accessToken = await getAccessToken()
  spotifyApi.setAccessToken(accessToken)

  try {
    const searchResult = await spotifyApi.searchTracks(`genre: ${genre}`, { 
      limit: 10, 
      market: 'from_token' 
    })

    const filteredSongs = searchResult.body.tracks.items.filter((track) => track.popularity >= popularityThreshold)
    console.log(filteredSongs)

    // map the filtered songs to the desired structure
    return filteredSongs.map((track) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      album: {
        name: track.album.name, external_url: 
        track.album.external_urls.spotify, 
        image: track.album.images[2].url 
      },
      uri: track.uri,
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

