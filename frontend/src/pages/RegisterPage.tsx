import { useState, type CSSProperties } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Kayıt başarılı! Şimdi giriş yapabilirsin.');
      navigate('/login');
    } catch (error) {
      toast.error('Kayıt başarısız. Bu email kullanılıyor olabilir.');
    }
  };

  const colors = { bg: '#f5f2eb', card: '#ffffff', text: '#4a4540', accent: '#10b981', border: '#e2e8f0' };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ backgroundColor: colors.card, padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', border: `1px solid ${colors.border}` }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ backgroundColor: '#ecfdf5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
            <UserPlus size={28} color={colors.accent} />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: colors.text, fontWeight: '800' }}>Kayıt Ol</h1>
          <p style={{ color: '#8c8882', marginTop: '5px' }}>Aramıza katıl, etkinlikleri kaçırma.</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input type="text" placeholder="Ad" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required style={inputStyle} />
            </div>
            <div style={{ position: 'relative' }}>
              <input type="text" placeholder="Soyad" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required style={{ ...inputStyle, paddingLeft: '15px' }} />
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="email" placeholder="E-posta Adresi" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required style={inputStyle} />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input type="password" placeholder="Şifre" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required style={inputStyle} />
          </div>

          <button type="submit" style={{ backgroundColor: '#4a4540', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}>
            Hesap Oluştur
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#6b7280' }}>
          Zaten hesabın var mı? <Link to="/login" style={{ color: colors.accent, fontWeight: 'bold', textDecoration: 'none' }}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = { width: '100%', padding: '14px 14px 14px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f9fafb', fontSize: '0.95rem', boxSizing: 'border-box' };