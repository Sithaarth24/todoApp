import { useNavigate } from "react-router-dom"
import { useState } from "react"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

export default function Login(){

    const navigate = useNavigate()
    const [renderComp,setRenderComp] = useState("Login")
    const [samePass,setSamePass] = useState(true)
    const [available,setAvailable] = useState(true)
    const [userFound,setUserFound] = useState(true)
    const [formData,setFormData] = useState({
        uname:"",
        pswd:""
    })

    const loadTodos = async (name,password) => {
        await fetch(BACKEND_URL+"/getTodos",{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({name:name,password:password})
        })
        .then(res => res.json())
        .then(data => localStorage.setItem('TODOITEMS',data))
        .catch(err => console.log(err))
    }

    const handleLoginSubmit = async (e)=>{
        console.log(BACKEND_URL + "/login")
        e.preventDefault()
        await fetch(BACKEND_URL + "/login",{
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
            console.log(data.response)
            if(data.response === "userFound"){
                loadTodos(formData.name,formData.pswd)
                navigate('/todo', {state:{username:formData.uname}})
            }
            else if(data.response === "userNotFound") setUserFound(false)
        })
        .catch(err => console.log(err))
    }

    const handleSignupSubmit = async (e)=>{
        e.preventDefault()
        if(!samePass) return 
        await fetch(BACKEND_URL+"/signup",{
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
                setFormData({uname:"",pswd:""})
                setRenderComp("Login")
            }
            else if(data.response === "dbError")
                throw new Error("Database Error")
            else if(data.response === "notAvailable")
                setAvailable(false)
        })
        .catch(err => console.log(err))
    }

    return(
        <>
        <button onClick={(e) =>{setRenderComp("Login")}}>Login</button>
        <button onClick={(e) =>{setRenderComp("Signup")}}>Signup</button>
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
            {!userFound && "No User Found"}
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
                onChange={(e) =>{setSamePass(e.target.value === formData.pswd)}}>
            </input>
            {!samePass && "Password not matching da punda olunga paru"}<br/><br/>
            {!available && "Username or Password not available"}
            <button>Signup</button>
        </form>}
        </>
        
    )
}