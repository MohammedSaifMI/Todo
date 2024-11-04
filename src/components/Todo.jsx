import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Todo.css';

function Todo() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get("http://localhost:8080/api/v1/ToDo/show");
    setTodos(response.data);
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      try {
        await axios.post("http://localhost:8080/api/v1/ToDo/save", {
          title: title,
          description: description,
          completed: false,
        });
        alert("Todo added successfully");
        clearFields();
        fetchTodos();
      } catch (error) {
        alert("Failed to add Todo");
      }
    } else {
      alert('Please enter both a title and a description.');
    }
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    if (id) {
      try {
        await axios.put(`http://localhost:8080/api/v1/ToDo/edit/${id}`, {
          title: title,
          description: description,
        });
        alert("Todo updated successfully");
        clearFields();
        fetchTodos();
      } catch (error) {
        alert("Failed to update Todo");
      }
    }
  };

  const handleEditTodo = (todo) => {
    setId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const handleDeleteTodo = async (id) => {
    await axios.delete(`http://localhost:8080/api/v1/ToDo/del/${id}`);
    alert('Todo deleted successfully');
    fetchTodos();
  };

  const handleTodoClick = async (id) => {
    const todo = todos.find(todo => todo.id === id);
    await axios.put(`http://localhost:8080/api/v1/ToDo/edit/${id}`, { ...todo, completed: !todo.completed });
    fetchTodos();
  };

  const clearFields = () => {
    setId('');
    setTitle('');
    setDescription('');
  };

  return (
    <div>
      <div className="container cont1 w-50 h-100 mt-5 mb-5 bg-light rounded">
        <h3 className="display-5">To-Do List</h3>
        <form>
          <input className="w-50 border border-success rounded-start"placeholder="Title..."type="text"value={title}onChange={(e) => setTitle(e.target.value)}/>
          <input className="w-50 border border-success rounded-end"placeholder="Description..."type="text"value={description}onChange={(e) => setDescription(e.target.value)}/>
          <button className="btn btn1 mt-4" onClick={handleAddTodo}>
            {id ? 'Save' : 'Add'}
          </button>
          {id && (
            <button className="btn btn1 mt-4 ms-4" onClick={handleUpdateTodo}>Update</button>
          )}
        </form>
      </div>

      <div className="container cont2 w-50 rounded bg-light" id="todo-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <div onClick={() => handleTodoClick(todo.id)} className="todo-details">
              <input type="checkbox"checked={todo.completed}readOnlyclassName="todo-checkbox"className='me-3'/>
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.title} - {todo.description}
              </span>
            </div>
            <button onClick={() => handleDeleteTodo(todo.id)}className="btn btn-danger ms-3 me-3 btn-sm">
              <i className="fa-solid fa-trash"></i>
            </button>
            <button onClick={() => handleEditTodo(todo)}className="btn btn-warning btn-sm">
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todo;
