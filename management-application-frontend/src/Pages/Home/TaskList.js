import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskList.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function TaskList() {
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [taskForm, setTaskForm] = useState({ title: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  // Task component to make it draggable
  const Task = ({ task, index, moveTask }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'TASK',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          backgroundColor: '#f0f0f0',
          padding: '10px',
          marginBottom: '5px',
          borderRadius: '4px',
          cursor: 'move',
        }}
      >
        <h4>{task.title}</h4>
        <p>{task.description}</p>
      </div>
    );
  };

  // Column component to hold tasks and enable dropping
  const Column = ({ title, tasks, moveTask }) => {
    const [, drop] = useDrop({
      accept: 'TASK',
      drop: (item) => {
        moveTask(item.index, title);
      },
    });

    return (
      <div
        ref={drop}
        style={{
          flex: 1,
          margin: '0 10px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          minHeight: '200px',
        }}
      >
        <h2>{title}</h2>
        {tasks.map((task, index) => (
          <Task key={index} task={task} index={index} moveTask={moveTask} />
        ))}
      </div>
    );
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskForm.title && taskForm.description) {
      setColumns((prevColumns) => ({
        ...prevColumns,
        todo: [...prevColumns.todo, { title: taskForm.title, description: taskForm.description }],
      }));
      setTaskForm({ title: '', description: '' });
      setShowForm(false);
    }
  };

  const moveTask = (taskIndex, toColumn) => {
    let taskToMove;
    const updatedColumns = { ...columns };

    // Find and remove the task from any column
    Object.keys(updatedColumns).forEach((col) => {
      if (updatedColumns[col][taskIndex]) {
        taskToMove = updatedColumns[col][taskIndex];
        updatedColumns[col].splice(taskIndex, 1);
      }
    });

    // Add the task to the target column
    if (taskToMove) {
      updatedColumns[toColumn].push(taskToMove);
      setColumns(updatedColumns);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        {Object.keys(columns).map((col, idx) => (
          <Column key={idx} title={col} tasks={columns[col]} moveTask={moveTask} />
        ))}
      </div>

      <button onClick={() => setShowForm(true)}>Add Task</button>

      {showForm && (
        <form onSubmit={handleAddTask} style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            required
          />
          <button type="submit">Add</button>
        </form>
      )}
    </DndProvider>
  );
}
