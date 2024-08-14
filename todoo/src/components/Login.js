import { useNavigate } from "react-router-dom"
import { useState,useContext, useEffect } from "react"
import { useCookies } from "react-cookie"
import { AuthContext } from "../authContext"
import './Login.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

export default function Login(){

    const navigate = useNavigate()
    const auth = useContext(AuthContext)
    const [renderComp,setRenderComp] = useState("Login")
    const [samePass,setSamePass] = useState(true)
    const[logUser,setLogUser] = useState("")
    const [,setCookies,removeCookie] = useCookies(["TOKEN"])

    useEffect(()=>{
        localStorage.removeItem('TODOTASKS')
        localStorage.removeItem('TODO_CATEGORIES')
        removeCookie('TOKEN')
    },[])
    
    const [formData,setFormData] = useState({
        uname:"",
        pswd:""
    })

    const check = () =>{
        if(formData.uname === ""){
            setLogUser("Username required!")
            return true
        }
        if(formData.pswd === ""){
            setLogUser("Password required!")
            return true
        }
        return false
    }

    const handleLoginSubmit = async (e)=>{
        e.preventDefault()
        if(check())
            return
        await fetch(BACKEND_URL + "/auth/login",{
            method:'POST',
            headers:{
                'Content-type':'application/json',
            },
            body:JSON.stringify({name:formData.uname,password:formData.pswd})
        })
        .then(response => {
            if(!response.ok) throw new Error("Fetch error")
            return response.json()
        })
        .then(data => {
            if(data.response === "userFound"){
                setCookies('TOKEN',data.token,{path : '/'})
                auth.login(formData.uname)
                navigate('/todo')
            }
            else if(data.response === "userNotFound") 
                setLogUser("No User found!")
            else
                setLogUser("Incorrect Password!")
        })
        .catch(err => console.log(err))
    }

    const handleSignupSubmit = async (e)=>{
        e.preventDefault()
        if(check())
            return
        if(!samePass) return 
        await fetch(BACKEND_URL+"/auth/signup",{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({name:formData.uname,password:formData.pswd})
        })
        .then(response => {
            if(!response.ok) throw new Error("Fetch error")
            return response.json()
        })
        .then(data => {
            if(data.response === "added"){
                switchTab("Login")
            }
            else if(data.response === "dbError")
                throw new Error("Database Error")
            else if(data.response === "notAvailable"){
                setLogUser("Username or Password not available")
            }
                
        })
        .catch(err => console.log(err))
    }

    const switchTab = (choice) =>{
        setRenderComp(choice)
        setFormData({uname:"",pswd:""})
        setLogUser("")
    }

    return(
        <div className="outer-login-box">
        <div className="login-box">
            <div className="login-buttons"><button onClick={(e) =>{switchTab("Login")}}>Login</button>
            <button onClick={(e) =>{switchTab("Signup")}}>Signup</button></div>
            <div className="login-forms">
                {renderComp === "Login" && <form onSubmit={handleLoginSubmit}>
                    <input 
                        placeholder="Enter UserName"
                        onChange={(e) =>{setFormData({...formData,uname:e.target.value})}}
                        value={formData.uname}>
                    </input><br/><br/>
                    <input 
                        placeholder="Password" 
                        type="password" 
                        onChange={(e) =>{setFormData({...formData,pswd:e.target.value})}} 
                        value={formData.pswd}>
                    </input><br/><br/>
                    {logUser}<br/>
                    <button>Login</button>
                </form>}
                {renderComp === "Signup" && <form onSubmit={handleSignupSubmit}>
                    <input 
                        placeholder="Enter UserName"
                        onChange={(e) =>{setFormData({...formData,uname:e.target.value})}}
                        value={formData.uname}>
                    </input><br/><br/>
                    <input 
                        placeholder="Password" 
                        type="password" 
                        onChange={(e) =>{setFormData({...formData,pswd:e.target.value})}} 
                        value={formData.pswd}>
                    </input><br/><br/>
                    <input 
                        placeholder="Confirm Password" 
                        type="password" 
                        onChange={(e) =>{setSamePass(e.target.value === formData.pswd)}}
                        required = {true}>
                    </input>
                    {!samePass && "Password not matching"}<br/><br/>
                    {logUser}<br/>
                    <button disabled={!samePass}>Signup</button>
                </form>}
            </div>
            
            </div>
        </div>
    
    )
}