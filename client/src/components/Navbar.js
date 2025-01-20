import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { spotifyLogin, spotifyLogout } from '../services/spotifyService'
import {  getSpotifyUserData } from '../services/spotifyService'
import { isUserAuthenticated } from '../utils/authUtils';
import defaultImg from '../assets/default_img.webp'
import logo from '../assets/logo.png'

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
        isAuthenticated && fetchUserData();
    }, [isAuthenticated])

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
            <div className='container mx-auto'>
                <div className="flex flex-1 flex-row items-center">
                    <Link to="/">
                        <img src={logo} alt="SentiMusic logo" className='w-[60px] h-[60px]'/>
                    </Link>
                </div>
                
                <label className="grid cursor-pointer place-items-center mr-3">
                    <input
                        id='toggle-theme'
                        name='toggle-theme'
                        type="checkbox"
                        value="light"
                        className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1" />
                    <svg
                        className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    <svg
                        className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                </label>

                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full flex">
                                <img
                                    alt="Spotify User"
                                    src={userData && userData.images.length !== 0 ? userData.images[1].url : defaultImg}
                                />
                                <p>{userData && userData.display_name}</p>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><Link onClick={handleAuthAction}>{isAuthenticated ? "Logout" : "Login"}</Link></li>
                        </ul>
                    </div>
                </div> 

            </div>
        </div>
    )
}

export default Navbar