import { useEffect, useState } from "react";


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

export default function Sidebar({ showCategory,username }){
    const [renderForm,setRenderForm] = useState(false)
    const [newCategory,setNewCategory] = useState("")
    const [categories,setCategories] = useState([{name:"newCategory",id:crypto.randomUUID()}])
    
    useEffect(()=>{
        console.log("cat came")
        const fetchData = async () =>{
            await fetch(BACKEND_URL+username+'/categories/all')
            .then(response => response.json())
            .then(data => {if(data.categories.length !== 0) setCategories(data.categories)})
            .catch(err => console.log('fetch error:\n'+err))
            
        }
        const localData = JSON.parse(localStorage.getItem('TODO_CATEGORIES'))
        if(localData)
            setCategories(localData)
        else fetchData()

        showCategory(categories[0].name)
    },[])

    useEffect(()=>{
        localStorage.setItem('TODO_CATEGORIES',JSON.stringify(categories))
    },[categories])

    

    const addCategory = async(e) =>{
        e.preventDefault()
        setRenderForm(false)
        setCategories([...categories,{id: crypto.randomUUID(),name:newCategory}])

        await fetch(BACKEND_URL + '/categories/add',{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({newCat:newCategory,name:username})
        })
        .then(res => res.json)
        .then(data => console.log(data))
        .catch(err => console.log('fetch err '+ err))
    }

    return(
        <>
            <div className="categories">
                {categories.map((categ) => {
                    return(
                    <div key={categ.id} onClick={()=>{showCategory(categ.name)}}>{categ.name}</div>
                    )
                })}
            </div>
            {!renderForm && <button onClick={(e) => setRenderForm(true)}>add</button>}
            {renderForm && <form onSubmit={addCategory}>
                <input
                    value={newCategory}
                    onChange={ (e) =>{setNewCategory(e.target.value)} }
                    placeholder=""
                ></input>
            </form>}
        </>
        
    )
}