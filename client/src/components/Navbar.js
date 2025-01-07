import { Link } from 'react-router-dom'
import { spotifyLogin } from '../services/spotifyService'

const Navbar = () => {
    
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">SentiMusic</Link>
            </div>
            <div className="navbar-end">
                <button className="btn btn-square btn-ghost" onClick={spotifyLogin}>Login</button>
            </div>
        </div>
    )
}

export default Navbar