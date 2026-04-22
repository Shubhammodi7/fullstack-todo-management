import { useState, useEffect } from 'react';
import Auth from './Auth';
import TodoList from './TodoList';
import './App.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div className="App">
            {!token ? (
                <Auth setToken={setToken} />
            ) : (
                <TodoList logout={handleLogout} />
            )}
        </div>
    );
}

export default App;