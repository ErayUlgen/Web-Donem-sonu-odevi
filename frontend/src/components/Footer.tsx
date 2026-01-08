import { Sparkles, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            marginTop: 'auto', // Sayfa içeriği azsa bile en altta dursun
            padding: '40px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.6)', // Buzlu Cam
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.4)',
            color: '#4a4540',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>

                {/* SOL KISIM: LOGO & SLOGAN */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                        <Sparkles size={24} color="#d97706" />
                        <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1f2937' }}>Etkinlig</span>
                    </div>
                    <p style={{ lineHeight: '1.6', color: '#6b7280', fontSize: '0.95rem' }}>
                        Şehrin ritmini yakala. En güncel konserler, tiyatrolar ve atölyeler tek bir platformda.
                    </p>
                </div>

                {/* ORTA KISIM: HIZLI LİNKLER */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', color: '#1f2937' }}>Keşfet</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <a href="/" style={linkStyle}>Anasayfa</a>
                        <a href="/favorites" style={linkStyle}>Favorilerim</a>
                        <a href="#" style={linkStyle}>Hakkımızda</a>
                        <a href="#" style={linkStyle}>İletişim</a>
                    </div>
                </div>

                {/* SAĞ KISIM: SOSYAL MEDYA & BÜLTEN */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px', color: '#1f2937' }}>Takipte Kal</h4>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <SocialIcon icon={<Instagram size={20} />} />
                        <SocialIcon icon={<Twitter size={20} />} />
                        <SocialIcon icon={<Linkedin size={20} />} />
                        <SocialIcon icon={<Github size={20} />} />
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>© {currentYear} Etkinlig Inc. Tüm hakları saklıdır.</p>
                </div>

            </div>
        </footer>
    );
}

// Yardımcı Stiller
const linkStyle = { textDecoration: 'none', color: '#6b7280', transition: 'color 0.2s', fontSize: '0.95rem', cursor: 'pointer' };
const SocialIcon = ({ icon }: { icon: any }) => (
    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', cursor: 'pointer', border: '1px solid #e5e7eb', transition: 'all 0.2s' }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
        {icon}
    </div>
);