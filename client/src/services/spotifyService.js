import axiosInstance from '../utils/axiosInstance'

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
  const accessToken = await getAccessToken(); 
  try {
    const response = await axiosInstance.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Spotify user data:", error);
    throw error;
  }
};

