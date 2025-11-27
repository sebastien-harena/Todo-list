import { useEffect, useState } from "react";
import TodoItem from "./components/Todoitem";

type Priority = "Urgente" | "Moyenne" | "Basse"
type Todo = {
  id: number;
  text: string;
  priority: Priority
}
function App() {
  const [input, setInput] = useState<string>("")
  const [priority, setPriority] = useState<Priority>("Moyenne")

  const savedTodos = localStorage.getItem("todos")
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : []
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [filter, setFilter] = useState<Priority | "Tous">("Moyenne")
  const filteredTodos = filter === "Tous" ? todos : todos.filter(todo => todo.priority === filter)

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  function addTodo() {
    if (input.trim() === "") {
      return;
    }
    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      priority: priority
    }
    const newTodos = [newTodo, ...todos]
    setTodos(newTodos)
    setInput("")
    console.log(newTodos)
  }

  const urgentCount = todos.filter(todo => todo.priority === "Urgente").length;
  const mediumCount = todos.filter(todo => todo.priority === "Moyenne").length;
  const lowCount = todos.filter(todo => todo.priority === "Basse").length;
  const totalCount = todos.length;
  
  const [selectedTodo, setSelectedTodo] = useState<Set<number>>(new Set())
  const clearSelection = () => setSelectedTodo(new Set());
  
  function toggleSelectTodo(id: number) {
    const newSelectedTodo = new Set(selectedTodo)
    if (newSelectedTodo.has(id)) {
      newSelectedTodo.delete(id)
    } else {
      newSelectedTodo.add(id)
    }
    setSelectedTodo(newSelectedTodo)
  }
  function editTodo(id: number, newText: string, newPriority: Priority) {
    setTodos(prevTodos =>
        prevTodos.map(todo =>
        todo.id === id
            ? { ...todo, text: newText, priority: newPriority }  // on remplace
            : todo                                                // on garde les autres
        )
    );
  }
 

  return (

    <div className="flex justify-center px-3 py-12">
        <div className="w-full md:w-2/3 flex flex-col gap-4 my-15 p-5 rounded-2xl bg-base-300">
            <div className="flex gap-4">
                <input 
                    type="text" 
                    className="input w-full" 
                    placeholder="Ajouter une tâche..."
                    value={input}
                    onChange={(e)=>setInput(e.target.value)}
                />
                <select 
                    className="select w-full"
                    value={priority}
                    onChange={(e)=>setPriority(e.target.value as Priority)}
                >
                    <option value="Urgente">Urgente</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Basse">Basse</option>
                </select>
                <button className="btn btn-primary" onClick={addTodo}>Ajouter</button>
            </div>
            <div className="space-y-2 flex-1 h-fit">
                <div className="flex flex-wrap gap-4 justify-between">
                    <div className="flex flex-wrap gap-4">
                        <button 
                            className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`} 
                            onClick={()=> setFilter("Tous")}>Tous ({totalCount})
                        </button>
                        <button 
                            className={`btn btn-soft ${filter === "Urgente" ? "btn-primary" : ""}`} 
                            onClick={()=> {setFilter("Urgente"); setPriority("Urgente");}}>Urgente ({urgentCount})
                        </button>
                        <button 
                            className={`btn btn-soft ${filter === "Moyenne" ? "btn-primary" : ""}`} 
                            onClick={()=> {setFilter("Moyenne"); setPriority("Moyenne");}}>Moyenne ({mediumCount})
                        </button>
                        <button 
                            className={`btn btn-soft ${filter === "Basse" ? "btn-primary" : ""}`} 
                            onClick={()=>{setFilter("Basse"); setPriority("Basse");}}>Basse ({lowCount})
                        </button>
                    </div>
                    { selectedTodo.size > 0 &&(
                        <div className="flex gap-4">
                            <button
                                className="btn btn-soft btn-secondary"
                                onClick={() => {
                                    if (selectedTodo.size === filteredTodos.length) {
                                        setSelectedTodo(new Set())
                                    } else {
                                        const allIds = filteredTodos.map(todo => todo.id)
                                        setSelectedTodo(new Set(allIds))
                                    }
                                }}
                            >
                                Selectionner tout
                            </button>
                            <button
                                className="btn btn-soft btn-error"
                                onClick={() => {
                                    const newTodos = todos.filter(todo => !selectedTodo.has(todo.id))
                                    setTodos(newTodos)
                                    setSelectedTodo(new Set())
                                }}
                                disabled={selectedTodo.size === 0}
                            >
                                Supprimier ({selectedTodo.size})
                            </button>
                        </div>
                    ) }
                </div>
            </div>
            { filteredTodos.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {filteredTodos.map((todo)=>(
                        <div key={todo.id}>
                            <TodoItem 
                                todo={todo} 
                                isSelected ={selectedTodo.has(todo.id)}
                                toggleSelect = {toggleSelectTodo}
                                clearSelection={clearSelection}
                                editTodo={editTodo}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 my-10">
                    Aucune tâche pour ce filtre.
                </div>
            )}
        </div>
    </div>
      
  )
}

export default App
