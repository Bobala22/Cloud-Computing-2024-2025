import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login-page';
import SignUp from './pages/signup-page';
import Dashboard from './pages/dashboard';
import CreatePost from './pages/new-post';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/new-post' element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  )
}