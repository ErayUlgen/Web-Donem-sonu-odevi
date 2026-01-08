import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import Footer from './components/Footer'; // <-- Footer eklendi

function App() {
  return (
    <AuthProvider>
      {/* Sayfa yapısını dikey esnek kutu yapıyoruz ki Footer en alta itilsin */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* İÇERİK ALANI (Büyüyerek boşluğu doldurur) */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>

        {/* FOOTER (Her sayfanın en altında) */}
        <Footer />

      </div>
    </AuthProvider>
  );
}

export default App;