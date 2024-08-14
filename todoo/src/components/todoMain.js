import { useContext, useEffect, useState } from "react";
import NewItemForm from "./newItemForm";
import TodoList from "./todoList";
import Sidebar from "./sidebar";
import { useCookies } from "react-cookie";
import { AuthContext } from "../authContext";
import UserDetails from "./shared/useDetails";
import './todoMain.css'
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL



function TodoMain() {
  const auth = useContext(AuthContext) 
  const username = auth.username
  const [currCategory,setCurrCategory] = useState("")
  const [cookies,,] = useCookies(["TOKEN"])
  const [tasklist, settasklist] = useState(() =>{
    const localItems =  localStorage.getItem('TODOTASKS')
    if(localItems != null) return JSON.parse(localItems)
    return []
  })

  useEffect(()=>{
    const fetchData = async () =>{
        await fetch(BACKEND_URL+'/todo/all',{
          method:'GET',
          headers:{
            'content-type':'application/json',
            'Authentication':'Bearer '+ cookies['TOKEN']
          }
        })
        .then(response => response.json())
        .then(data => {
          settasklist(data.todos.map(t => {
            return { 
              id: t._id, 
              task: t.title, 
              checked: t.status,
              category:t.categId
            }})
          )
        })
        .catch(err => console.log('fetch error:\n'+err)) 
    }
    if(auth.isLoggedIn){
      const localData = JSON.parse(localStorage.getItem('TODOTASKS'))
      if(localData){
        settasklist(localData)
      }    
      else fetchData()
    }
},[])

useEffect(()=>{
  localStorage.setItem('TODOTASKS',JSON.stringify(tasklist))
},[tasklist])

const addTask = async (newItem) => {
  if(newItem === "")
    return

  if(!auth.isLoggedIn){
    settasklist(currlist => {
      return([...currlist, { 
        id: crypto.randomUUID(), 
        task: newItem, 
        checked: false, 
        category:currCategory
      }])})
    return 
  }
  
  await fetch(BACKEND_URL+'/todo/add/'+currCategory,{
  method:'POST',
  headers:{
    'content-type':'application/json',
    'Authentication':'Bearer '+ cookies['TOKEN']
  },
  body:JSON.stringify({task: newItem, checked: false})
  })
  .then(response => response.json())
  .then(data => {
    settasklist(currlist => {
      return([...currlist, { 
        id: data._id, 
        task: newItem, 
        checked: false, 
        category:currCategory
      }])})
  })
  .catch(err => console.log('fetch error:'+err))

  
}

const deleteTask = async(key) => {
  settasklist(currlist =>{return currlist.filter(task => task.id !== key)})
  if(!auth.isLoggedIn)
    return

  await fetch(BACKEND_URL+'/todo/delete/'+key,{
    method:'DELETE',
    headers:{
      'content-type':'application/json',
      'Authentication':'Bearer '+ cookies['TOKEN']
    }})
    .then(response => response.json())
    .catch(err => console.log('fetch error:'+err))
}

const checkTask = async (key,checked) => {

  if(!auth.isLoggedIn){
    settasklist(currlist =>{
      return currlist.map(task =>{
        if(task.id === key) return {...task,checked}
        return task
      })
    })
    return
  }

  await fetch(BACKEND_URL+'/todo/check/'+key,{
    method:'PUT',
    headers:{
      'content-type':'application/json',
      'Authentication':'Bearer '+ cookies['TOKEN']
    },
    body:JSON.stringify({checked:checked})
  })
    .then(response => response.json())
    .then(data => {
      settasklist(currlist =>{
        return currlist.map(task =>{
          if(task.id === key) return {...task,checked}
          return task
        })
      })
    })
    .catch(err => console.log('fetch error:'+err))
}

const showCategory = (id) =>{
  setCurrCategory(id)
}
  return (
    <div className="todo-main">
      <div className="todo-sidebar">
        <UserDetails/>
        <Sidebar 
          showCategory={showCategory}
          username={username}
        />
      </div>
      <div className="todo-list">
        <TodoList 
          checkTask={checkTask} 
          deleteTask={deleteTask} 
          tasklist={tasklist} 
          currCategory={currCategory}
        />
      </div>
      <div className="todo-inputForm"> 
        <NewItemForm 
        addTask={addTask}
      />
      </div>
      
    </div>
  );
}

export default TodoMain;
