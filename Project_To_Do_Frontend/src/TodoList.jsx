import { useState, useEffect } from 'react';
import API from './api/axios';

const TodoList = ({ logout }) => {
    const [todos, setTodos] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState('all');

    // 1. Fetching Logic
    const fetchTodos = async () => {
        try {
            let url = '/todos';
            if (filter !== 'all') {
                // Matches: /api/todos/status?status=completed
                url = `/todos/status?status=${filter}`;
            }

            const { data } = await API.get(url);

            // Based on your controller: res.json({ success: true, todos: [...] })
            if (data.success && data.todos) {
                setTodos(data.todos);
            } else {
                setTodos([]);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setTodos([]);
        }
    };

    // Re-fetch when filter state changes
    useEffect(() => {
        fetchTodos();
    }, [filter]);

    // 2. Add / Update Logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Matches: route.put("/update/:id")
                await API.put(`/todos/update/${editingId}`, formData);
                setEditingId(null);
            } else {
                // Matches: route.post('/add')
                await API.post('/todos/add', formData);
            }
            setFormData({ title: '', description: '' });
            fetchTodos();
        } catch (err) {
            console.error("Submit Error:", err);
        }
    };

    // 3. Toggle isCompleted Logic
    const toggleStatus = async (id) => {
        try {
            // Matches: route.patch('/:id/toggle')
            await API.patch(`/todos/${id}/toggle`);
            fetchTodos();
        } catch (err) {
            console.error("Toggle Error:", err);
        }
    };

    // 4. Delete Logic
    const deleteTask = async (id) => {
        try {
            // Matches: route.delete('/:id/delete')
            await API.delete(`/todos/${id}/delete`);
            fetchTodos();
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    // 5. Populate form for editing
    const startEdit = (todo) => {
        setEditingId(todo._id);
        setFormData({ title: todo.title, description: todo.description });
    };

    return (
        <div style={{ maxWidth: '650px', margin: '50px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#333', fontSize: '24px' }}>My To-Do App</h1>
                <button onClick={logout} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ffefef', color: '#ff4d4d', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Task Title..." 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required 
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px' }}
                />
                <textarea 
                    placeholder="Description (Optional)" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', minHeight: '80px' }}
                />
                <button type="submit" style={{ padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                    {editingId ? "Update Task" : "Add New Task"}
                </button>
            </form>

            {/* Filter Navigation */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', backgroundColor: '#f5f7fa', padding: '5px', borderRadius: '12px' }}>
                {['all', 'completed', 'pending'].map((t) => (
                    <button 
                        key={t}
                        onClick={() => setFilter(t)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: filter === t ? '#ffffff' : 'transparent',
                            color: filter === t ? '#4A90E2' : '#777',
                            fontWeight: filter === t ? 'bold' : 'normal',
                            boxShadow: filter === t ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                            textTransform: 'capitalize',
                            cursor: 'pointer'
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Tasks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {todos.length > 0 ? (
                    todos.map(todo => (
                        <div key={todo._id} style={{ 
                            padding: '15px', 
                            borderRadius: '12px', 
                            border: '1px solid #f0f0f0', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            backgroundColor: todo.isCompleted ? '#fafafa' : '#ffffff',
                            opacity: todo.isCompleted ? 0.8 : 1
                        }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 4px 0', textDecoration: todo.isCompleted ? 'line-through' : 'none', color: todo.isCompleted ? '#999' : '#333' }}>
                                    {todo.title}
                                </h4>
                                <p style={{ margin: 0, fontSize: '13px', color: '#777' }}>{todo.description}</p>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '12px', marginLeft: '15px' }}>
                                <button onClick={() => toggleStatus(todo._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                                    {todo.isCompleted ? '✅' : '⚪'}
                                </button>
                                <button onClick={() => startEdit(todo)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✏️</button>
                                <button onClick={() => deleteTask(todo._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#bbb' }}>
                        No tasks found for "{filter}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList;