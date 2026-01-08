import { useEffect, useState } from 'react';
import api from '../api';
import { Toaster, toast } from 'react-hot-toast';
import { Calendar, MapPin, Trash2, Edit2, Plus, Search, X, Loader2, Sparkles, Tag, LogOut, LogIn, Heart, ArrowRight, Upload, Shield } from 'lucide-react';
import { format, isAfter, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Category { id: number; name: string; }
interface Event { id: number; title: string; description: string; date: string; location: string; imageUrl: string; isFree: boolean; category: Category; }

export default function HomePage() {
    const navigate = useNavigate();
    const { token, isAuthenticated, logout, role } = useAuth();

    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    // MODAL VE FORM STATE'LERİ
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Yeni: Seçilen dosya için state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        imageUrl: '', // Burası artık sadece düzenlerken eski resmi göstermek için
        isFree: false,
        categoryId: ''
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
    const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past'>('all');

    // --- VERİ ÇEKME ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const [eventsRes, categoriesRes] = await Promise.all([
                api.get('/events'),
                api.get('/categories')
            ]);
            setEvents(eventsRes.data);
            setCategories(categoriesRes.data);
            if (token) fetchFavorites();
        } catch { toast.error("Veriler alınamadı."); } finally { setLoading(false); }
    };

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/users/profile', { headers: { Authorization: `Bearer ${token}` } });
            setFavoriteIds(res.data.favorites.map((fav: any) => fav.id));
        } catch (error) { console.error("Favoriler çekilemedi"); }
    };

    useEffect(() => { fetchData(); }, [token]);

    // --- FAVORİ İŞLEMLERİ ---
    const toggleFavorite = async (e: React.MouseEvent, eventId: number) => {
        e.stopPropagation();
        if (!isAuthenticated) { toast.error("Giriş yapmalısınız."); return; }
        const isLiked = favoriteIds.includes(eventId);
        try {
            if (isLiked) {
                await api.delete(`/users/favorites/${eventId}`, { headers: { Authorization: `Bearer ${token}` } });
                setFavoriteIds(prev => prev.filter(id => id !== eventId));
                toast.success("Favorilerden çıkarıldı");
            } else {
                await api.post(`/users/favorites/${eventId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
                setFavoriteIds(prev => [...prev, eventId]);
                toast.success("Favorilere eklendi ❤️");
            }
        } catch (error) { toast.error("İşlem başarısız."); }
    };

    // --- FORM İŞLEMLERİ ---
    const handleInputChange = (e: any) => { setNewEvent({ ...newEvent, [e.target.name]: e.target.value }); };
    const handleCheckboxChange = (e: any) => { setNewEvent({ ...newEvent, isFree: e.target.checked }); };

    // YENİ: Dosya Seçilince Çalışır
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!isAuthenticated) { toast.error("Giriş yapmalısınız!"); return; }
        if (!newEvent.title || !newEvent.date || !newEvent.categoryId) { toast.error("Eksik bilgi!"); return; }

        try {
            // --- 1. DÜZENLEME MODU (Şimdilik sadece metin günceller, dosya yükleme Create'de) ---
            if (editingId) {
                const payload = { ...newEvent, categoryId: Number(newEvent.categoryId) };
                await api.patch(`/events/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Güncellendi!');
            }
            // --- 2. OLUŞTURMA MODU (Dosyalı Gönderim - FormData) ---
            else {
                const formData = new FormData();
                formData.append('title', newEvent.title);
                formData.append('description', newEvent.description);
                formData.append('date', newEvent.date);
                formData.append('location', newEvent.location);
                formData.append('isFree', String(newEvent.isFree));
                formData.append('categoryId', newEvent.categoryId);

                // Eğer dosya seçildiyse ekle
                if (selectedFile) {
                    formData.append('file', selectedFile); // Backend 'file' ismini bekliyor!
                }

                await api.post('/events', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data' // Dosya gönderdiğimizi belirtiyoruz
                    }
                });
                toast.success('Oluşturuldu!');
            }

            fetchData();
            closeModal();
        } catch (error) {
            console.error(error);
            toast.error('Hata oluştu.');
        }
    };

    const handleDelete = (id: number) => {
        if (!isAuthenticated) return;
        if (window.confirm("Silmek istediğinize emin misiniz?")) {
            api.delete(`/events/${id}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(() => { toast.success("Silindi."); fetchData(); })
                .catch(() => toast.error("Yetkiniz yok."));
        }
    };

    const openNewModal = () => { if (!isAuthenticated) { toast.error("Giriş yapın."); navigate('/login'); return; } resetForm(); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); resetForm(); };

    const resetForm = () => {
        setNewEvent({ title: '', description: '', date: '', location: '', imageUrl: '', isFree: false, categoryId: '' });
        setEditingId(null);
        setSelectedFile(null); // Dosyayı sıfırla
    };

    const handleEditClick = (event: Event) => {
        setEditingId(event.id);
        setNewEvent({ title: event.title, description: event.description, date: event.date, location: event.location, imageUrl: event.imageUrl, isFree: event.isFree, categoryId: event.category ? event.category.id.toString() : '' });
        setIsModalOpen(true);
    };

    const handleLogout = () => { logout(); toast.success("Çıkış yapıldı."); navigate('/login'); };
    const formatDate = (d: string) => { try { return format(new Date(d), 'd MMM yyyy', { locale: tr }); } catch { return d; } };

    // --- FİLTRELEME ---
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategoryFilter ? event.category?.id.toString() === selectedCategoryFilter : true;
        const eventDate = new Date(event.date); const today = startOfDay(new Date());
        let matchesDate = true;
        if (dateFilter === 'upcoming') matchesDate = isAfter(eventDate, today) || format(eventDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        else if (dateFilter === 'past') matchesDate = !isAfter(eventDate, today);
        return matchesSearch && matchesCategory && matchesDate;
    });

    const stats = {
        total: events.length,
        upcoming: events.filter(e => isAfter(new Date(e.date), startOfDay(new Date()))).length,
        free: events.filter(e => e.isFree).length
    };

    // --- TASARIM ---
    const colors = { bgMain: 'transparent', bgCard: 'rgba(255, 255, 255, 0.75)', textPrimary: '#1f2937', textSecondary: '#6b7280', border: 'rgba(255, 255, 255, 0.4)', accentWarm: '#d97706' };
    const btnStyle = { padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.1s' };
    const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', backgroundColor: 'rgba(255,255,255,0.9)' };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.bgMain, color: colors.textPrimary, fontFamily: "'Inter', sans-serif", padding: '40px 20px' }}>
            <Toaster position="top-center" />
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', backgroundColor: colors.bgCard, padding: '20px', borderRadius: '24px', backdropFilter: 'blur(10px)', border: `1px solid ${colors.border}`, boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Sparkles size={28} color={colors.accentWarm} /> Etkinlig
                        </h1>
                        <p style={{ color: colors.textSecondary, margin: '5px 0 0 0' }}>{isAuthenticated ? 'Hoş geldin! 👋' : 'Panel görünümü'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {isAuthenticated ? (
                            <>
                                <button onClick={() => navigate('/favorites')} style={{ ...btnStyle, backgroundColor: 'white', color: '#4b5563', border: '1px solid #e5e7eb' }}><Heart size={18} color="#ef4444" /> Favoriler</button>
                                {role === 'admin' && (
                                    <button onClick={() => navigate('/admin')} style={{ ...btnStyle, backgroundColor: '#d97706' }}><Shield size={18} /> Panel</button>
                                )}
                                <button onClick={handleLogout} style={{ ...btnStyle, backgroundColor: '#ef4444' }}><LogOut size={18} /> Çıkış</button>
                                <button onClick={openNewModal} style={{ ...btnStyle, backgroundColor: '#10b981', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}><Plus size={20} /> Yeni Etkinlik</button>
                            </>
                        ) : (
                            <button onClick={() => navigate('/login')} style={{ ...btnStyle, backgroundColor: '#4f46e5' }}><LogIn size={20} /> Giriş Yap</button>
                        )}
                    </div>
                </div>

                {/* ISTATISTIKLER */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {[{ title: 'Toplam', val: stats.total, color: '#4f46e5' }, { title: 'Yaklaşan', val: stats.upcoming, color: '#d97706' }, { title: 'Ücretsiz', val: stats.free, color: '#10b981' }].map((s, i) => (
                        <div key={i} style={{ backgroundColor: colors.bgCard, padding: '25px', borderRadius: '20px', backdropFilter: 'blur(10px)', border: `1px solid ${colors.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: colors.textSecondary, marginBottom: '5px', fontWeight: '600' }}>{s.title}</span>
                            <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: s.color }}>{s.val}</h2>
                        </div>
                    ))}
                </div>

                {/* FILTRE & LISTE */}
                <div style={{ backgroundColor: colors.bgCard, padding: '25px', borderRadius: '24px', backdropFilter: 'blur(10px)', border: `1px solid ${colors.border}`, marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
                        <div style={{ flex: 2, position: 'relative' }}><Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} /><input type="text" placeholder="Etkinlik ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px' }} /></div>
                        <div style={{ flex: 1 }}><select value={selectedCategoryFilter} onChange={e => setSelectedCategoryFilter(e.target.value)} style={inputStyle}><option value="">Tüm Kategoriler</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    </div>

                    {loading ? <div style={{ textAlign: 'center', padding: '50px' }}><Loader2 className="spin-anim" /></div> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                            {filteredEvents.map((event, index) => (
                                <div key={event.id} className="animate-enter" style={{ animationDelay: `${index * 0.1}s`, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}>
                                    <div onClick={() => navigate(`/event/${event.id}`)} style={{ height: '180px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                                        <img src={event.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'; }} />
                                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>{event.isFree ? <span style={{ backgroundColor: 'white', color: '#059669', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>ÜCRETSİZ</span> : <span style={{ backgroundColor: 'white', color: '#e11d48', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>ÜCRETLİ</span>}</div>
                                        <div onClick={(e) => toggleFavorite(e, event.id)} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}><Heart size={20} color={favoriteIds.includes(event.id) ? '#ef4444' : '#64748b'} fill={favoriteIds.includes(event.id) ? '#ef4444' : 'none'} /></div>
                                    </div>
                                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ marginBottom: '10px' }}>{event.category && (<span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '5px' }}><Tag size={10} /> {event.category.name}</span>)}<h3 onClick={() => navigate(`/event/${event.id}`)} style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#1f2937', cursor: 'pointer' }}>{event.title}</h3></div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px', color: '#6b7280', fontSize: '0.85rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} color="#4f46e5" /><span>{formatDate(event.date)}</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#d97706" /><span>{event.location}</span></div></div>
                                        <button onClick={() => navigate(`/event/${event.id}`)} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e5e7eb', borderRadius: '10px', backgroundColor: 'white', color: '#374151', cursor: 'pointer', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>Detayları Gör <ArrowRight size={16} /></button>
                                        {isAuthenticated && (
                                            <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleEditClick(event)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600', backgroundColor: '#f9fafb', color: '#6b7280' }}><Edit2 size={16} /> Düzenle</button>
                                                <button onClick={() => handleDelete(event.id)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: '600', color: '#ef4444', backgroundColor: '#fef2f2' }}><Trash2 size={16} /></button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                            <button onClick={closeModal} style={{ position: 'absolute', right: '20px', top: '20px', border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={24} /></button>
                            <h2 style={{ marginTop: 0 }}>{editingId ? 'Düzenle' : 'Yeni Etkinlik'}</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <input type="text" placeholder="Başlık" name="title" value={newEvent.title} onChange={handleInputChange} style={inputStyle} />
                                <select name="categoryId" value={newEvent.categoryId} onChange={handleInputChange} style={inputStyle}><option value="">Kategori Seç...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>

                                {/* --- YENİ DOSYA YÜKLEME ALANI --- */}
                                {!editingId && ( // Sadece yeni oluştururken gösterelim
                                    <div style={{ border: '1px dashed #cbd5e1', padding: '15px', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc', position: 'relative' }}>
                                        <input type="file" onChange={handleFileChange} style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: '#64748b' }}>
                                            <Upload size={24} color="#4f46e5" />
                                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{selectedFile ? selectedFile.name : 'Resim Yüklemek İçin Tıkla'}</span>
                                            <span style={{ fontSize: '0.75rem' }}>veya dosyayı buraya sürükle</span>
                                        </div>
                                    </div>
                                )}
                                {/* ------------------------------- */}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} style={inputStyle} />
                                    <input type="text" placeholder="Konum" name="location" value={newEvent.location} onChange={handleInputChange} style={inputStyle} />
                                </div>
                                <textarea placeholder="Açıklama" name="description" value={newEvent.description} onChange={handleInputChange} rows={3} style={{ ...inputStyle, resize: 'none' }} />
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" checked={newEvent.isFree} onChange={handleCheckboxChange} /> <span style={{ fontSize: '0.9rem', color: '#4b5563' }}>Ücretsiz Etkinlik</span></label>
                                <button onClick={handleSubmit} style={{ ...btnStyle, backgroundColor: '#10b981', justifyContent: 'center' }}>{editingId ? 'Güncelle' : 'Oluştur'}</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}