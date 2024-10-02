import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskList.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Button, Form } from 'react-bootstrap'; 


export default function TaskList() {
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [taskForm, setTaskForm] = useState({ title: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null); 
  const [viewingTask, setViewingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search bar state
  const [sortField, setSortField] = useState('createdAt'); // Sort field state
  const [sortOrder, setSortOrder] = useState('asc'); // Sort order state (asc or desc)

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await axios.get('http://localhost:5000/api/tasks');
      const todo = data.filter((task) => task.status === 'todo');
      const inProgress = data.filter((task) => task.status === 'inProgress');
      const done = data.filter((task) => task.status === 'done');
      setColumns({ todo, inProgress, done });
    };
    fetchTasks();
  }, []);

  const Task = ({ task, index, moveTask }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { index, id: task._id },
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
            
            {/* Add Task Action Buttons */}
            <div>
                <Button variant="info" onClick={() => handleViewTask(task)} style={{ marginRight: '10px' }}>
                    View
                </Button>
                <Button variant="warning" onClick={() => handleEditTask(task)} style={{ marginRight: '10px' }}>
                    Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteTask(task._id)} >
                    Delete
                </Button>
            </div>
        </div>
    );
};


const Column = ({ title, tasks, moveTask }) => {
  const [, drop] = useDrop({
      accept: 'TASK',
      drop: (item) => {
          moveTask(item.id, title); // Calls moveTask with the task ID and new column title
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
              <Task key={task._id} task={task} index={index} moveTask={moveTask} />
          ))}
      </div>
  );
};


  // Handle adding a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (taskForm.title && taskForm.description) {
      const { data } = await axios.post('http://localhost:5000/api/tasks', {
        title: taskForm.title,
        description: taskForm.description,
        createdAt: new Date(),
    });
    
      setColumns((prevColumns) => ({
        ...prevColumns,
        todo: [...prevColumns.todo, data],
      }));
      setTaskForm({ title: '', description: '' });
      setShowForm(false);
    }
  };

  const handleDeleteTask = (col, idx) => {
    const updatedTasks = columns[col].filter((_, i) => i !== idx);
    setColumns({ ...columns, [col]: updatedTasks });
  };

  const handleEditTask = (task) => {
    setTaskForm(task);
    setEditingTask(true);
    setShowForm(true);
};

  const handleViewTask = (task) => {
    setTaskForm(task);
    setShowForm(true);
    setViewingTask(task);
  };

  // Handle moving a task
  const moveTask = async (taskId, toColumn) => {
    const updatedColumns = { ...columns };
    let taskToMove;

    // Find and remove the task from the previous column
    Object.keys(updatedColumns).forEach((col) => {
      const taskIndex = updatedColumns[col].findIndex((task) => task._id === taskId);
      if (taskIndex > -1) {
        taskToMove = updatedColumns[col][taskIndex];
        updatedColumns[col].splice(taskIndex, 1);
      }
    });

    // Update task status in the backend
    if (taskToMove) {
      const { data } = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: toColumn });
      updatedColumns[toColumn].push(data);
      setColumns(updatedColumns);
    }
  };


   // Filter tasks based on search query
   const filterTasks = (tasks) => {
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Sort tasks based on selected field and order
  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return sortOrder === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });
  };
  return (
    <div className='Task-page'>

      
        <DndProvider backend={HTML5Backend}>
      
        <button onClick={() => setShowForm(true)}>Add Task</button>
        <div style={{ padding: '20px' }}>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
          />

          {/* Sort Field */}
          <div style={{ marginBottom: '10px' }}>
            <label>Sort By:</label>
            <select value={sortField} onChange={(e) => setSortField(e.target.value)} style={{ marginLeft: '10px' }}>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
            </select>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: '10px' }}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        {Object.keys(columns).map((col, idx) => {
          const filterandsortedTask=sortTasks(filterTasks(columns[col]));
          return(
            <Column key={idx} title={col} tasks={columns[col]} moveTask={moveTask} />
          );
          
        })}
      </div>

      

        {/* Modal for task form */}
      <Modal show={showForm} onHide={() => {setShowForm(false);setViewingTask(null);}}>
        <Modal.Header closeButton>
          <Modal.Title>{editingTask ? 'Edit Task' : viewingTask ? 'View Task' : 'Add New Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTask}>
            <Form.Group controlId="taskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter task title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                readOnly={!!viewingTask}
                required
              />
            </Form.Group>

            <Form.Group controlId="taskDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              {/* Use textarea for multi-line input */}
              <Form.Control
                as="textarea"
                rows={15}  
                placeholder="Enter task description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                readOnly={!!viewingTask}
                required
              />
            </Form.Group>

            {!viewingTask && (
              <Button variant="primary" type="submit" className="mt-3">
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </DndProvider>
    </div>
    
  );
}
