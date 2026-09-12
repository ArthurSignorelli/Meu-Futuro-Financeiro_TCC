import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './styles/global.css';
import './styles/login.css';
import './styles/dashboard.css';
import './styles/test.css';
import './styles/budget.css';
import './styles/library.css';

createRoot(document.getElementById('root')).render(<StrictMode><AuthProvider><App /></AuthProvider></StrictMode>);
