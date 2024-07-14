import { useEffect, useState } from "react";


export default function NewItemForm({addTask}){

    const [newItem, setNewItem] = useState("")

    const handleSubmit = (e) =>{
        e.preventDefault()
        addTask(newItem)
        setNewItem("")
    }
    return(
    <form onSubmit={handleSubmit}>
        <input id="newTask" value={newItem}
          onChange={e => setNewItem(e.target.value)}
          className="newTask" placeholder="Enter new task"></input>
        <button>Add</button>
      </form>
    )

}