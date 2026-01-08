import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, ArrowLeft, Tag, MessageCircle, Send, User, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
    };
}

export default function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuth();

    const [event, setEvent] = useState<any>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEventData();
        fetchComments();
    }, [id]);

    const fetchEventData = () => {
        axios.get(`http://localhost:3000/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err));
    };

    const fetchComments = () => {
        axios.get(`http://localhost:3000/comments/event/${id}`)
            .then(res => setComments(res.data))
            .catch(err => console.error("Yorumlar çekilemedi", err));
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;
        if (!isAuthenticated) {
            toast.error("Yorum yapmak için giriş yapmalısınız.");
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:3000/comments', {
                content: newComment,
                eventId: Number(id)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Yorum gönderildi!");
            setNewComment("");
            fetchComments();
        } catch (error) {
            toast.error("Yorum gönderilemedi.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm("Yorumu silmek istediğine emin misin?")) return;

        try {
            await axios.delete(`http://localhost:3000/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Yorum silindi.");
            fetchComments();
        } catch (error) {
            toast.error("Silme yetkiniz yok.");
        }
    };

    if (!event) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#8c8882' }}>Yükleniyor...</div>;

    const formatDate = (d: string) => format(new Date(d), 'd MMMM yyyy, EEEE', { locale: tr });
    const formatTime = (d: string) => format(new Date(d), 'd MMM HH:mm', { locale: tr });

    const colors = { bg: '#f5f2eb', cardBg: '#ffffff', textMain: '#2d3748', textSoft: '#718096', accent: '#d97706', border: '#e2e8f0' };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: colors.bg, paddingBottom: '80px', position: 'relative' }}>
            {/* HERO BÖLÜMÜ */}
            <div style={{ height: '50vh', minHeight: '400px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }} onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80'; }} />
                <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <button onClick={() => navigate('/')} style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', padding: '12px 20px', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: colors.textMain, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                        <ArrowLeft size={18} /> Geri Dön
                    </button>
                </div>
                <div style={{ position: 'absolute', bottom: '60px', left: '0', width: '100%', maxWidth: '1000px', margin: '0 auto', right: '0', padding: '0 20px' }}>
                    {event.category && <span style={{ backgroundColor: colors.accent, color: 'white', padding: '6px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '15px', display: 'inline-block' }}>{event.category.name}</span>}
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', margin: '0', textShadow: '0 2px 10px rgba(0,0,0,0.3)', lineHeight: '1.1' }}>{event.title}</h1>
                </div>
            </div>

            {/* İÇERİK KARTI */}
            <div style={{ maxWidth: '1000px', margin: '-50px auto 0', padding: '0 20px', position: 'relative', zIndex: 5 }}>
                <div style={{ backgroundColor: colors.cardBg, borderRadius: '24px', padding: '40px', boxShadow: '0 20px 40px -5px rgba(0,0,0,0.1)', border: `1px solid ${colors.border}` }}>

                    {/* Bilgiler */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', paddingBottom: '30px', borderBottom: `1px solid ${colors.border}`, marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ backgroundColor: '#e0e7ff', padding: '12px', borderRadius: '14px', color: '#4f46e5' }}><Calendar size={28} /></div>
                            <div><span style={{ display: 'block', fontSize: '0.85rem', color: colors.textSoft, fontWeight: '600' }}>TARİH</span><span style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.textMain }}>{formatDate(event.date)}</span></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ backgroundColor: '#fef3c7', padding: '12px', borderRadius: '14px', color: '#d97706' }}><MapPin size={28} /></div>
                            <div><span style={{ display: 'block', fontSize: '0.85rem', color: colors.textSoft, fontWeight: '600' }}>KONUM</span><span style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.textMain }}>{event.location}</span></div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ backgroundColor: event.isFree ? '#d1fae5' : '#fee2e2', padding: '12px', borderRadius: '14px', color: event.isFree ? '#059669' : '#e11d48' }}><Tag size={28} /></div>
                            <div><span style={{ display: 'block', fontSize: '0.85rem', color: colors.textSoft, fontWeight: '600' }}>ÜCRET</span><span style={{ fontSize: '1.1rem', fontWeight: '700', color: event.isFree ? '#059669' : '#e11d48' }}>{event.isFree ? "Ücretsiz" : "Biletli"}</span></div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '50px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.textMain, margin: '0 0 15px 0' }}>Etkinlik Detayları</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#4a5568', whiteSpace: 'pre-line' }}>{event.description}</p>
                    </div>

                    {/* YORUM BÖLÜMÜ */}
                    <div style={{ backgroundColor: '#f8fafc', padding: '30px', borderRadius: '20px', border: `1px solid ${colors.border}` }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: colors.textMain, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MessageCircle size={24} color="#4f46e5" /> Yorumlar ({comments.length})
                        </h3>

                        {/* Yorum Yapma Kutusu */}
                        <div style={{ marginBottom: '30px' }}>
                            {isAuthenticated ? (
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 'bold' }}>
                                        <User size={24} />
                                    </div>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Bu etkinlik hakkında ne düşünüyorsun?"
                                            rows={3}
                                            style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', resize: 'none', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' }}
                                        />
                                        <button
                                            onClick={handleSendComment}
                                            disabled={loading}
                                            style={{ position: 'absolute', bottom: '15px', right: '15px', backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', fontSize: '0.9rem' }}
                                        >
                                            {loading ? '...' : <><Send size={16} /> Gönder</>}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                                    Yorum yapmak için <span onClick={() => navigate('/login')} style={{ color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer' }}>Giriş Yap</span> veya <span onClick={() => navigate('/register')} style={{ color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer' }}>Kayıt Ol</span>.
                                </div>
                            )}
                        </div>

                        {/* Yorum Listesi */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {comments.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Henüz yorum yapılmamış. İlk yorumu sen yap! 🚀</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} style={{ display: 'flex', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                                            <span style={{ fontWeight: 'bold' }}>{comment.user.firstName.charAt(0)}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: colors.textMain }}>
                                                    {comment.user.firstName} {comment.user.lastName}
                                                </h4>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatTime(comment.createdAt)}</span>
                                            </div>
                                            <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>{comment.content}</p>
                                        </div>
                                        {isAuthenticated && (
                                            <button onClick={() => handleDeleteComment(comment.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }} title="Sil">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}