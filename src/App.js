import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmedTask = task.trim();
    if (trimmedTask === '') return alert('Task cannot be empty');
    if (tasks.some(t => t.text.toLowerCase() === trimmedTask.toLowerCase())) {
      return alert('Duplicate task!');
    }

    const newTask = {
      id: Date.now(),
      text: trimmedTask,
      completed: false,
      createdAt: Date.now()
    };

    setTasks(prev => [newTask, ...prev]);
    setTask('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Filtering
    if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (filter === 'incomplete') {
      filtered = filtered.filter(t => !t.completed);
    }

    // Sorting
    switch (sortOrder) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'az':
        filtered.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'za':
        filtered.sort((a, b) => b.text.localeCompare(a.text));
        break;
      default:
        break;
    }

    return filtered;
  };

  return (
    <div className="App">
      <h1>📋 To-Do List</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Add a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filter-sort">
        <label>
          Filter:
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </label>
        <label>
          Sort:
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </label>
      </div>

      <ul>
        {applyFilters().map(t => (
          <li key={t.id} className={t.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => toggleComplete(t.id)}
            />
            <span>{t.text}</span>
            <button onClick={() => deleteTask(t.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
