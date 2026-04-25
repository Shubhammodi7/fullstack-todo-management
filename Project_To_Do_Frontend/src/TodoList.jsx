import { useState, useEffect } from 'react';
import API from './api/axios';

const TodoList = ({ logout }) => {
    const [todos, setTodos] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState(''); // New: For date picking

    const fetchTodos = async () => {
        try {
            let url = '/todos';
            if (filter !== 'all') {
                url = `/todos/status?status=${filter}`;
            }
            const { data } = await API.get(url);
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

    useEffect(() => {
        fetchTodos();
    }, [filter]);

    // Helper: Grouping Logic
    const groupTodosByDate = (todoList) => {
        const groups = {};
        todoList.forEach(todo => {
            const date = new Date(todo.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            if (!groups[date]) groups[date] = [];
            groups[date].push(todo);
        });
        return groups;
    };

    const groupedTodos = groupTodosByDate(todos);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await API.put(`/todos/update/${editingId}`, formData);
                setEditingId(null);
            } else {
                await API.post('/todos/add', formData);
            }
            setFormData({ title: '', description: '' });
            fetchTodos();
        } catch (err) {
            console.error("Submit Error:", err);
        }
    };

    const toggleStatus = async (id) => {
        try {
            await API.patch(`/todos/${id}/toggle`);
            fetchTodos();
        } catch (err) {
            console.error("Toggle Error:", err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await API.delete(`/todos/${id}/delete`);
            fetchTodos();
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    const startEdit = (todo) => {
        setEditingId(todo._id);
        setFormData({ title: todo.title, description: todo.description });
    };

    // Helper to format the input date to match our grouped headers
    const formatPickedDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div style={{ maxWidth: '650px', margin: '50px auto', padding: '20px', backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#333', fontSize: '24px', margin: 0 }}>My Daily Log</h1>
                <button onClick={logout} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#ffefef', color: '#ff4d4d', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                <input 
                    type="text" 
                    placeholder="Enter new task..." 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required 
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px' }}
                />
                <textarea 
                    placeholder="Add details (optional)" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', minHeight: '60px', resize: 'vertical' }}
                />
                <button type="submit" style={{ padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
                    {editingId ? "Update Task" : "Add Task to Today"}
                </button>
            </form>

            {/* Filter Bar */}
            <div style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', gap: '10px', backgroundColor: '#f5f7fa', padding: '5px', borderRadius: '12px', marginBottom: '15px' }}>
                    {['all', 'completed', 'pending'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => { setFilter(t); setSelectedDate(''); }}
                            style={{
                                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                                backgroundColor: (filter === t && !selectedDate) ? '#ffffff' : 'transparent',
                                color: (filter === t && !selectedDate) ? '#4A90E2' : '#777',
                                fontWeight: (filter === t && !selectedDate) ? 'bold' : 'normal',
                                cursor: 'pointer', transition: '0.3s'
                            }}
                        >
                            {t.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Date Picker Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <label style={{ fontSize: '14px', color: '#666' }}>Jump to Date:</label>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', color: '#4A90E2' }}
                        />
                    </div>
                    {selectedDate && (
                        <button 
                            onClick={() => setSelectedDate('')}
                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
                        >
                            Show All Days
                        </button>
                    )}
                </div>
            </div>

            {/* Grouped List Display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {Object.keys(groupedTodos).length > 0 ? (
                    Object.keys(groupedTodos)
                        .sort((a, b) => new Date(b) - new Date(a))
                        .filter(date => !selectedDate || date === formatPickedDate(selectedDate))
                        .map(date => (
                            <div key={date}>
                                <div style={{ 
                                    paddingBottom: '8px', marginBottom: '12px', color: '#4A90E2', 
                                    fontWeight: 'bold', fontSize: '14px', borderBottom: '2px solid #f0f4f8',
                                    display: 'flex', justifyContent: 'space-between'
                                }}>
                                    <span>{date === new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) ? "TODAY" : date.toUpperCase()}</span>
                                    <span style={{ fontSize: '11px', color: '#ccc' }}>{groupedTodos[date].length} tasks</span>
                                </div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {groupedTodos[date].map(todo => (
                                        <div key={todo._id} style={{ 
                                            padding: '15px', borderRadius: '12px', border: '1px solid #f0f0f0', 
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            backgroundColor: todo.isCompleted ? '#fafafa' : '#ffffff',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 4px 0', textDecoration: todo.isCompleted ? 'line-through' : 'none', color: todo.isCompleted ? '#bbb' : '#333' }}>
                                                    {todo.title}
                                                </h4>
                                                {todo.description && <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>{todo.description}</p>}
                                            </div>
                                            
                                            <div style={{ display: 'flex', gap: '12px', marginLeft: '15px' }}>
                                                <button onClick={() => toggleStatus(todo._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                                                    {todo.isCompleted ? '✅' : '⚪'}
                                                </button>
                                                <button onClick={() => startEdit(todo)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✏️</button>
                                                <button onClick={() => deleteTask(todo._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#bbb', fontStyle: 'italic' }}>
                        No history found here.
                    </div>
                )}

                {/* Specific message if the picked date has no data */}
                {selectedDate && !Object.keys(groupedTodos).includes(formatPickedDate(selectedDate)) && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '14px' }}>
                        Nothing was logged on this day.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList;