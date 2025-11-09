import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <h1 className="text-3xl font-semibold">Welcome!</h1>
        </main>
        <Footer />
      </div>
  );
}
export default App;
