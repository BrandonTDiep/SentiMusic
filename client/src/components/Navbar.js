import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom'
import { spotifyLogin, spotifyLogout } from '../services/spotifyService'
import {  getSpotifyUserData } from '../services/spotifyService'
import { isUserAuthenticated } from '../utils/authUtils';
import defaultImg from '../assets/default_img.webp'

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        setIsAuthenticated(isUserAuthenticated)
        const fetchUserData = async () => {
            try {
              const user = await getSpotifyUserData()
              setUserData(user)
            } catch (error) {
              console.error("Error fetching Spotify user data:", error);
            }
      
          };
        fetchUserData();
    }, [])



    const handleAuthAction = () => {
        if(isAuthenticated){
            spotifyLogout()
            isAuthenticated(false)
        }
        else{
            spotifyLogin()
        }

    }
    return (
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">SentiMusic</a>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Spotify User Profile Picture"
                                src={userData && userData.images.length != 0 ? userData.images[1].url : defaultImg}
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a onClick={handleAuthAction}>{isAuthenticated ? "Logout" : "Login"}</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar