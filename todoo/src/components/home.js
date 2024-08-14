import { useNavigate } from "react-router-dom"


export default function Home(){
    const navigate  = useNavigate()
    return(
    <>
        <div>Home</div>
        <button onClick={() => {navigate('/login')}}>Go to Login</button>
        <button onClick={() => {navigate('/todo')}}>Try App</button>
    </>)
}