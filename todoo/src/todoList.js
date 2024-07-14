export default function TodoList({checkTask,deleteTask,tasklist,currCategory}){
    return(
        <div className="list">
        {tasklist.length === 0 && "notodos"}
        {tasklist.filter(t => t.category === currCategory).map((task) => {
          return (
            <li className="task" key={task.id}>
              <input type="checkbox" checked={task.checked} onChange={(e) => checkTask(task.id,e.target.cheked)}></input>
              {task.task}
              <button onClick={(e) => deleteTask(task.id)}>del</button>
            </li>)
        })}
      </div>
    )
}