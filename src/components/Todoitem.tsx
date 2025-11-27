import { Pencil } from "lucide-react";
import { useState } from "react";

type Priority = "Urgente" | "Moyenne" | "Basse"

type Todo = {
    id: number;
    text: string;
    priority: Priority;
}

type Props = {
    todo: Todo
    isSelected : boolean
    toggleSelect: (id:number) => void
    clearSelection: () => void
    editTodo: (id: number, newText: string, newPriority: Priority) => void
}

function TodoItem({ todo, isSelected, toggleSelect, clearSelection, editTodo}: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(todo.text)
    const [editPriority, setEditPriority] = useState(todo.priority)

    function startEditing (e:React.MouseEvent){
        e.stopPropagation();
        clearSelection();
        setIsEditing(true);
        setEditText(todo.text);
        setEditPriority(todo.priority);
    };

    return (
        <div 
            className="card flex flex-row justify-between items-center p-4 bg-base-100 shadow-md gap-4"
            onClick= {() => !isEditing ? toggleSelect(todo.id) : ""}
        >   
            { !isEditing || isSelected ? (
                <>
                    <div className="w-full flex items-center gap-4">
                        <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary checkbox-sm"
                            checked={isSelected}
                            onChange={() => toggleSelect(todo.id)}
                        />
                        <span className="flex-1 text-left">{todo.text}</span>
                        <span className={`badge badge-sm badge-soft whitespace-nowrap ${todo.priority === "Urgente" ? "badge-error" : todo.priority === "Moyenne" ? "badge-warning" : "badge-success"}`}>
                            {todo.priority}
                        </span>
                    </div>
                    <button
                        className="p-2 rounded-lg text-primary/60 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                        onClick ={ startEditing }
                        aria-label="Modifier la tâche"
                        >
                        <Pencil size={18} />
                    </button>
                </>
            ):(
                <div className="w-full flex flex-col gap-4">
                    <span className="flex gap-4 justify-right flex-2">
                        <input 
                            type="text" 
                            className="input input-bordered w-full"
                            defaultValue={editText}
                            onChange={(e)=>setEditText(e.target.value)}
                            autoFocus
                        />
                        <select 
                            className="select select-bordered w-1/3"
                            defaultValue={editPriority}
                            onChange={(e)=> setEditPriority(e.target.value as Priority)}
                        >
                            <option value="Urgente">Urgente</option>
                            <option value="Moyenne">Moyenne</option>
                            <option value="Basse">Basse</option>
                        </select>
                    </span>
                    <span className="flex items-center justify-end gap-4">
                        <button 
                            className="btn btn-sm btn-secondary" 
                            onClick={ (e) => {
                                e.preventDefault();
                                setIsEditing(false);
                                editTodo(todo.id, editText, editPriority)
                            }}
                        >
                            Enregistrer
                        </button>
                        <button 
                            className="btn btn-sm btn-soft"
                            onClick = {() => setIsEditing(false)}
                        >
                            Annuler
                        </button>
                    </span>
                </div>
            )}
        </div>
    );
}


export default TodoItem;