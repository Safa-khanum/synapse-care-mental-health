import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Reports from './pages/Reports';
import Therapy from './pages/Therapy';
import About from './pages/About';
import Contact from './pages/Contact';
import LabReport from './pages/LabReport';


function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
  case 'home':
    return <Home onNavigate={setCurrentPage} />;
  case 'features':
    return <Features onNavigate={setCurrentPage} />;
  case 'reports':
    return <Reports onNavigate={setCurrentPage} />;
  case 'therapy':
    return <Therapy onNavigate={setCurrentPage} />;
  case 'about':
    return <About onNavigate={setCurrentPage} />;
  case 'contact':
    return <Contact onNavigate={setCurrentPage} />;
  case 'labreport':
    return <LabReport onNavigate={setCurrentPage} />;
  default:
    return <Home onNavigate={setCurrentPage} />;
}

  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main>{renderPage()}</main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
