import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useTheme } from './contexts/ThemeContext';
import { ToastContainer } from 'react-toastify';

function App() {
  const { isDark, theme } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen transition-colors ${
      isDark 
        ? 'bg-slate-950 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
}

export default App;