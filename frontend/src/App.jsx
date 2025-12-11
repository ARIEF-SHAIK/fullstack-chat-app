import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import useAuthStore from "./store/UseAuthStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { UseThemeStore } from './store/UseThemeStore';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const {theme}= UseThemeStore();

  console.log(onlineUsers);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-10 h-10 animate-spin text-white' />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Toaster />
      <Navbar/>
      <Routes>
        <Route path="/" element={ authUser ?<HomePage />: <Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser ?<SignUpPage /> : <Navigate to="/"/>} />
        <Route path="/login" element={  !authUser ? <LoginPage /> : <Navigate to="/"/>} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={ authUser ?<ProfilePage /> :<Navigate to="/login"/> } />
      </Routes>
    </div>
  );
};

export default App;
