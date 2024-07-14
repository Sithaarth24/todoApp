import { useEffect, useState } from "react";
import NewItemForm from "./newItemForm";
import TodoList from "./todoList";
import Sidebar from "./sidebar";
import { useLocation } from "react-router-dom";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL



function App() {
  const [currCategory,setCurrCategory] = useState("")
  const { state } = useLocation()
  const username = state.username
  const [tasklist, settasklist] = useState(() =>{
    const localItems =  localStorage.getItem('TODOTASKS')
    if(localItems != null) return JSON.parse(localItems)
    return []
  })

  useEffect(()=>{
    console.log("cat came")
    const fetchData = async () =>{
        await fetch(BACKEND_URL+username+'/todo/all')
        .then(response => response.json())
        .then(data => {if(data.todos.length !== 0) settasklist([data.todos.map(t => {return { id: crypto.randomUUID(), task: t.title, checked: t.status,category:t.category,user:username}})])})
        .catch(err => console.log('fetch error:\n'+err))
        
    }
    const localData = JSON.parse(localStorage.getItem('TODOTASKS'))
    if(localData)
        settasklist(localData)
    else fetchData()
},[])

  useEffect(()=>{
    localStorage.setItem('TODOTASKS',JSON.stringify(tasklist))
  },[tasklist])

  const addTask = async (newItem) => {
    console.log("current:"+currCategory)
    settasklist(currlist => {
      if(newItem === "") return currlist
      return([...currlist, { id: crypto.randomUUID(), task: newItem, checked: false,category:currCategory,user:username }])})
    console.log("taskaddcame")
    await fetch(BACKEND_URL+'/todo/add',{
      method:'POST',
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify({task: newItem, checked: false,category:currCategory,user:username})
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log('fetch error:'+err))
  }

  const deleteTask = (key) => {
    settasklist(currlist =>{return currlist.filter(task => task.id !== key)})
  }

  const checkTask = (key,checked) => {
    settasklist(currlist =>{
      return currlist.map(task =>{
        if(task.id === key) return {...task,checked}
        return task
      })
    })
  }

  const showCategory = (category) =>{
    setCurrCategory(category)
  } 



  return (
    <div className="App">
      <Sidebar showCategory={showCategory} username={username}/>
      <TodoList checkTask={checkTask} deleteTask={deleteTask} tasklist={tasklist} currCategory={currCategory}/>
      <NewItemForm addTask={addTask}/>
    </div>
  );
}

export default App;
