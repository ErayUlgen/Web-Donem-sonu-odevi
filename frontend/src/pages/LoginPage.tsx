import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });

      // Backend'den gelen token'ı sisteme kaydet
      login(res.data.access_token);

      toast.success('Giriş başarılı! Hoş geldiniz.');
      navigate('/'); // Anasayfaya yönlendir
    } catch (error) {
      toast.error('Giriş başarısız! Bilgilerinizi kontrol edin.');
    }
  };

  // Stiller (Krem Tema)
  const colors = { bg: '#f5f2eb', card: '#ffffff', text: '#4a4540', accent: '#d97706', border: '#e2e8f0' };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ backgroundColor: colors.card, padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', border: `1px solid ${colors.border}` }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#fff7ed', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
            <LogIn size={28} color={colors.accent} />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: colors.text, fontWeight: '800' }}>Giriş Yap</h1>
          <p style={{ color: '#8c8882', marginTop: '5px' }}>Etkinlik dünyasına geri dön.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="email" placeholder="E-posta Adresi" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f9fafb', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input
              type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f9fafb', fontSize: '0.95rem', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ backgroundColor: '#4a4540', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}>
            Giriş Yap
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#6b7280' }}>
          Hesabın yok mu? <Link to="/register" style={{ color: colors.accent, fontWeight: 'bold', textDecoration: 'none' }}>Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}