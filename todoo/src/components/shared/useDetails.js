import { useContext } from "react"
import { AuthContext } from "../../authContext"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"

export default function UserDetails(){
    const auth = useContext(AuthContext)
    const username = auth.username
    const[,,removeCookie] = useCookies(['TOKEN'])
    const navigate = useNavigate()

    const handleLogin = (e) =>{
        navigate('/login')
    }

    const handleLogout = (e) =>{
        localStorage.removeItem('TODOTASKS')
        localStorage.removeItem('TODO_CATEGORIES')
        removeCookie('TOKEN')
        auth.logout()
        navigate('/login')
    }

    return(
        <>
            {!auth.isLoggedIn && <>User<button onClick={handleLogin}>Login</button><br/></>}
            {auth.isLoggedIn && <>{username} <button onClick={handleLogout}>Logout</button><br/></>}
        </>
    )
}