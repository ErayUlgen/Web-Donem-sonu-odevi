import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, ArrowLeft } from 'lucide-react';

export default function AdminPage() {
    const { token, role } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        // Sadece adminler girebilir
        if (role !== 'admin') {
            navigate('/');
            return;
        }

        // Kullanıcıları çek (Bu endpoint backend'de olmayabilir, demo amaçlı)
        // Gerçekte backend'de users endpoint'i olmalı
        fetchUsers();
    }, [role, navigate]);

    const fetchUsers = async () => {
        try {
            // Backend'de users endpoint'i var mı kontrol etmeliyiz, yoksa hata verir
            const res = await api.get('/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Kullanıcılar çekilemedi");
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '5px', border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}>
                <ArrowLeft size={20} /> Geri Dön
            </button>

            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                    <Shield size={40} color="#d97706" />
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Yönetici Paneli</h1>
                        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Sadece yetkili personel görebilir.</p>
                    </div>
                </div>

                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={24} /> Kullanıcı Listesi</h2>

                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {users.length > 0 ? users.map((u: any) => (
                        <li key={u.id} style={{ padding: '15px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{u.firstName} {u.lastName} ({u.email})</span>
                            <span style={{ fontWeight: 'bold', color: u.role === 'admin' ? '#d97706' : '#666' }}>{u.role || 'user'}</span>
                        </li>
                    )) : <p>Kullanıcı bulunamadı veya yetki yok.</p>}
                </ul>
            </div>
        </div>
    );
}
