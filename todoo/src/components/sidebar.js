import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie"
import { AuthContext } from "../authContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

export default function Sidebar({ showCategory }){
    const [renderForm,setRenderForm] = useState(false)
    const [newCategory,setNewCategory] = useState("")
    const [cookies,,] = useCookies(["TOKEN"])
    const auth = useContext(AuthContext)
    const [categories,setCategories] = useState([])
    
    useEffect(()=>{
        const fetchData = async () =>{
            await fetch(BACKEND_URL+'/category/all',{
                method:'GET',
                headers:{
                    'Content-type':'application/json',
                    'Authentication':'Bearer '+ cookies['TOKEN']
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.categories.length !== 0) {
                    setCategories(data.categories)
                    showCategory(data.categories[0].id)
                }
            })
            .catch(err => console.log('fetch error:\n'+err))
            
        }
        if(auth.isLoggedIn){
            const localData = JSON.parse(localStorage.getItem('TODO_CATEGORIES'))
            if(localData){
                showCategory(localData[0].id)
                setCategories(localData)
            }
            else fetchData()
        }
        
    },[])

    useEffect(()=>{
        localStorage.setItem('TODO_CATEGORIES',JSON.stringify(categories))
    },[categories])

    

    const addCategory = async(e) =>{
        e.preventDefault()
        if(newCategory === "")
            return
        setRenderForm(false)

        if(!auth.isLoggedIn){
            setCategories([...categories,{id: crypto.randomUUID(),name:newCategory}])
            setNewCategory("")
            return
        }

        await fetch(BACKEND_URL + '/category/add',{
            method:'POST',
            headers:{
                'Content-type':'application/json',
                'Authentication':'Bearer '+ cookies['TOKEN']
            },
            body:JSON.stringify({newCat:newCategory})
        })
        .then(res => res.json())
        .then(data =>
        {
            setCategories([...categories,{
            id: data._id,
            name:newCategory
            }])
            showCategory(data._id)
            setNewCategory("")
        }
          
        )
        .catch(err => console.log('fetch err '+ err))
    }

    const deleteCategory = async(id) =>{
        if(!auth.isLoggedIn){
            setCategories(categories.filter(c => c.id !== id))
            return
        }
        await fetch(BACKEND_URL + '/category/delete/' + id ,{
            method:'DELETE',
            headers:{
                'Content-type':'application/json',
                'Authentication':'Bearer '+ cookies['TOKEN']
            }
        })
        .then(resp => {
            if(!resp.ok)
                console.log("cant be deleted! server error")
            else{
                showCategory(categories[0].id)
                setCategories(categories.filter(c => c.id !== id))
            }   
        })
        
    }

    return(
        <>
            <div className="categories">
                {categories.map((categ) => {
                    return(
                    <div key={categ.id} onClick={()=>{showCategory(categ.id)}}>
                        <div>{categ.name}<button disabled = {categories.length == 1} onClick={() => deleteCategory(categ.id)}>del</button></div>
                    </div>
                    )
                })}
            </div>
            
            {renderForm && <form style={{'display':'inline','margin-right':'10px'}} onSubmit={addCategory}>
                <input
                    value={newCategory}
                    onChange={ (e) =>{setNewCategory(e.target.value)} }
                    placeholder=""
                    autoFocus = {true}
                />
            </form>}
            
            {<button onClick={(e) => setRenderForm(curr => !curr)}>
                {!renderForm && <>add</>}
                {renderForm && <>cancel</>} 
            </button>}

            
        </>
        
    )
}