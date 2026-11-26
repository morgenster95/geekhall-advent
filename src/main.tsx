import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';
import App from './App';
import { Admin } from './components/Admin';
import { Rules } from './components/Rules';

const q = new URLSearchParams(location.search);
const page = q.has('admin') ? <Admin /> : q.has('pravidla') ? <Rules /> : <App />;

createRoot(document.getElementById('root')!).render(<StrictMode>{page}</StrictMode>);
