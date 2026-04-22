import { useState } from 'react';
import API from './api/axios';

const Auth = ({ setToken }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = isLogin ? '/user/login' : '/user/register';
        
        try {
            const payload = isLogin 
                ? { email: formData.email, password: formData.password } 
                : formData;

            const { data } = await API.post(endpoint, payload);
            
            if (data.token) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Auth failed");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p style={styles.subtitle}>
                    {isLogin ? 'Enter your details to access your tasks' : 'Join us to stay organized and productive'}
                </p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {!isLogin && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="John Doe" 
                                style={styles.input}
                                value={formData.name}
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    )}
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="name@company.com" 
                            style={styles.input}
                            value={formData.email}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            style={styles.input}
                            value={formData.password}
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                    <button 
                        style={styles.switchBtn} 
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modern UI Styles
const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    title: {
        margin: '0 0 10px 0',
        fontSize: '24px',
        color: '#1a202c',
        fontWeight: '700'
    },
    subtitle: {
        fontSize: '14px',
        color: '#718096',
        marginBottom: '30px',
        lineHeight: '1.5'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        textAlign: 'left'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#4a5568',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    input: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        marginTop: '10px',
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4A90E2',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    footer: {
        marginTop: '25px',
        fontSize: '14px',
        color: '#718096',
        display: 'flex',
        justifyContent: 'center',
        gap: '5px'
    },
    switchBtn: {
        background: 'none',
        border: 'none',
        color: '#4A90E2',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0'
    }
};

export default Auth;