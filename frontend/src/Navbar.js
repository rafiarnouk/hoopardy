import react from "react"
import { Link } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
    const [cookies, setCookies] = useCookies(["access_token"])
    const navigate = useNavigate()

    function logout() {
        console.log(cookies)
        setCookies("access_token", "")
        console.log(cookies)
        window.localStorage.removeItem("userID")
        navigate("/auth")
    }

    return (
        <div className="navbar">
            <Link to="/" className="navbar-element">Home</Link>
            {cookies.access_token ? (
                <button className="logout-button" onClick={logout}>Logout</button>
            ) : (
                <Link to="/auth" className="navbar-element">Login</Link>
            )}
        </div>
    )
}