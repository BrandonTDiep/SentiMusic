import axiosInstance from '../utils/axiosInstance'

export const spotifyLogin = () => {
    // redirect the user to the login endpoint
    window.location.href = `${process.env.REACT_APP_API_URL}api/spotify/login`
}
