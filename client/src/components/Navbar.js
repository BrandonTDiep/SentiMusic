import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom'
import { spotifyLogin, spotifyLogout } from '../services/spotifyService'
import { isUserAuthenticated } from '../utils/authUtils';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        setIsAuthenticated(isUserAuthenticated)
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
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">SentiMusic</Link>
            </div>
            <div className="navbar-end">
                <button className="btn btn-square btn-ghost" onClick={handleAuthAction}>{isAuthenticated ? "Logout" : "Login"}</button>
            </div>
        </div>
    )
}

export default Navbar