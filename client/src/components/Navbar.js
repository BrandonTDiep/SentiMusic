import { Link } from 'react-router-dom'

const Navbar = () => {
    
    return (
        <div class="navbar bg-base-100">
            <div class="flex-1">
                <Link to="/" className="btn btn-ghost text-xl"> SentiMusic</Link>
            </div>
            <div className="navbar-end">
                <button class="btn btn-square btn-ghost"> Login</button>
            </div>
        </div>
    )
}

export default Navbar