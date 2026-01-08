import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { Calendar, MapPin, ArrowLeft, HeartOff, ArrowRight, Loader2, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import api from '../api';

interface Category { id: number; name: string; }
interface Event { id: number; title: string; description: string; date: string; location: string; imageUrl: string; isFree: boolean; category: Category; }

export default function FavoritesPage() {
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth();
    const [favorites, setFavorites] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Önce giriş yapmalısın.");
            navigate('/login');
            return;
        }
        fetchFavorites();
    }, [isAuthenticated]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await api.get('/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Backend profil içinde 'favorites' dizisi dönüyor
            setFavorites(res.data.favorites);
        } catch (error) {
            toast.error("Favoriler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (eventId: number) => {
        try {
            await api.delete(`/users/favorites/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Listeden anlık olarak sil (tekrar istek atmaya gerek yok)
            setFavorites(prev => prev.filter(event => event.id !== eventId));
            toast.success("Listeden çıkarıldı.");
        } catch (error) {
            toast.error("İşlem başarısız.");
        }
    };

    const formatDate = (d: string) => { try { return format(new Date(d), 'd MMM yyyy', { locale: tr }); } catch { return d; } };

    const colors = { bg: '#f5f2eb', card: '#ffffff', textMain: '#2d3748', textSoft: '#718096', accent: '#d97706', border: '#e2e8f0' };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.bg, padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
            <Toaster position="top-center" />

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* HEADER */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => navigate('/')} style={{ background: 'white', border: `1px solid ${colors.border}`, padding: '10px', borderRadius: '12px', cursor: 'pointer', color: colors.textSoft }}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: colors.textMain }}>Favorilerim</h1>
                            <p style={{ margin: '5px 0 0 0', color: colors.textSoft }}>Kaydettiğin etkinlikler burada.</p>
                        </div>
                    </div>
                    <div style={{ backgroundColor: '#fff', padding: '10px 20px', borderRadius: '12px', border: `1px solid ${colors.border}`, fontWeight: 'bold', color: colors.accent }}>
                        {favorites.length} Etkinlik
                    </div>
                </div>

                {/* LİSTE */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: colors.textSoft }}>
                        <Loader2 className="spin-anim" size={40} /> <p>Yükleniyor...</p>
                    </div>
                ) : favorites.length === 0 ? (
                    // BOŞ DURUM (Empty State)
                    <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '24px', border: `1px dashed ${colors.border}` }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                            <HeartOff size={40} color="#ef4444" />
                        </div>
                        <h2 style={{ color: colors.textMain, marginBottom: '10px' }}>Henüz favorin yok</h2>
                        <p style={{ color: colors.textSoft, marginBottom: '30px' }}>Beğendiğin etkinlikleri kalp ikonuna basarak buraya ekleyebilirsin.</p>
                        <button onClick={() => navigate('/')} style={{ backgroundColor: colors.accent, color: 'white', border: 'none', padding: '12px 30px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                            Etkinlikleri Keşfet
                        </button>
                    </div>
                ) : (
                    // DOLU DURUM (Grid)
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                        {favorites.map((event) => (
                            <div key={event.id} style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${colors.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', transition: 'transform 0.2s', position: 'relative' }} className="fav-card">

                                {/* Resim */}
                                <div onClick={() => navigate(`/event/${event.id}`)} style={{ height: '160px', overflow: 'hidden', cursor: 'pointer' }}>
                                    <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'; }} />
                                </div>

                                {/* Silme Butonu (Sağ Üst) */}
                                <button
                                    onClick={() => removeFavorite(event.id)}
                                    style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', padding: '8px', borderRadius: '10px', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', fontSize: '0.8rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                                >
                                    <HeartOff size={16} /> Çıkar
                                </button>

                                {/* İçerik */}
                                <div style={{ padding: '20px' }}>
                                    <div style={{ marginBottom: '10px' }}>
                                        {event.category && <span style={{ fontSize: '0.7rem', color: colors.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '5px' }}><Tag size={10} /> {event.category.name}</span>}
                                        <h3 onClick={() => navigate(`/event/${event.id}`)} style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: colors.textMain, cursor: 'pointer' }}>{event.title}</h3>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', color: colors.textSoft, fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} color="#4f46e5" /><span>{formatDate(event.date)}</span></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color={colors.accent} /><span>{event.location}</span></div>
                                    </div>

                                    <button onClick={() => navigate(`/event/${event.id}`)} style={{ width: '100%', padding: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', color: colors.textMain, fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                                        Detaylar <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`.spin-anim { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .fav-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }`}</style>
        </div>
    );
}