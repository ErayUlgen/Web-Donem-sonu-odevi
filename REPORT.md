# Etkinlig - Etkinlik Yönetim Platformu Proje Raporu

## 1. Proje Hakkında
Etkinlig, kullanıcıların etkinlikleri keşfedebileceği, oluşturabileceği ve favorileyebileceği modern bir etkinlik yönetim platformudur. Kullanıcılar sisteme kayıt olup giriş yapabilir, etkinlikleri kategorilere göre filtreleyebilir ve detaylarını inceleyebilirler.

## 2. Kullanılan Teknolojiler

### Frontend (İstemci Tarafı)
- **React**: Kullanıcı arayüzü oluşturmak için kullanıldı.
- **Vite**: Hızlı geliştirme ve derleme aracı olarak tercih edildi.
- **TypeScript**: Tip güvenliği sağlamak için kullanıldı.
- **Axios**: HTTP istekleri için kullanıldı.
- **React Router**: Sayfa yönlendirmeleri için kullanıldı.
- **Lucide React**: Modern ikon seti.
- **Date-fns**: Tarih formatlama işlemleri için kullanıldı.
- **CSS Modules / Inline Styles**: Özelleştirilmiş, modern ve duyarlı tasarım için kullanıldı.

### Backend (Sunucu Tarafı)
- **NestJS**: Ölçeklenebilir ve modüler sunucu mimarisi için kullanıldı.
- **TypeScript**: Backend tarafında da tip güvenliği sağlandı.
- **TypeORM**: Veritabanı ile nesne tabanlı iletişim (ORM) için kullanıldı.
- **PostgreSQL**: İlişkisel veritabanı yönetim sistemi.
- **Passport & JWT**: Güvenli kimlik doğrulama (Authentication) ve yetkilendirme (Authorization) için kullanıldı.
- **Multer**: Dosya yükleme işlemleri için kullanıldı.

## 3. Veritabanı Tasarımı ve İlişkiler
Projede toplam **4 temel tablo (Entity)** bulunmaktadır:

1. **User (Kullanıcılar)**
   - `id`, `firstName`, `lastName`, `email`, `password`, `role` (user/admin)
   - **İlişkiler**:
     - **One-to-Many**: Bir kullanıcı birden fazla yorum yapabilir (`comments`).
     - **Many-to-Many**: Bir kullanıcı birden fazla etkinliği favorileyebilir (`favorites`).

2. **Event (Etkinlikler)**
   - `id`, `title`, `description`, `date`, `location`, `imageUrl`, `isFree`, `price`, `categoryId`
   - **İlişkiler**:
     - **Many-to-One**: Bir etkinlik bir kategoriye aittir (`category`).
     - **One-to-Many**: Bir etkinliğe birden fazla yorum yapılabilir (`comments`).
     - **Many-to-Many**: Bir etkinlik birden fazla kullanıcı tarafından favorilenebilir.

3. **Category (Kategoriler)**
   - `id`, `name`
   - **İlişkiler**:
     - **One-to-Many**: Bir kategori altında birden fazla etkinlik olabilir.

4. **Comment (Yorumlar)**
   - `id`, `content`, `createdAt`, `userId`, `eventId`
   - **İlişkiler**:
     - **Many-to-One**: Bir yorum bir etkinliğe aittir.

### Veritabanı Diyagramı (ER Diagram)

```mermaid
erDiagram
    User ||--o{ Comment : "makes"
    User }|--|{ Event : "favorites"
    Category ||--|{ Event : "contains"
    Event ||--o{ Comment : "has"

    User {
        int id PK
        string firstName
        string lastName
        string email
        string password
        string role "user/admin"
        boolean isActive
    }

    Event {
        int id PK
        string title
        string description
        datetime date
        string location
        string imageUrl
        boolean isFree
        decimal price
        boolean isActive
        int categoryId FK
    }

    Category {
        int id PK
        string name
    }

    Comment {
        int id PK
        string content
        datetime createdAt
        int userId FK
        int eventId FK
    }
```

## 4. Dağıtım (Deployment) Adımları

Proje bulut ortamına yüklenmeye hazırdır. Aşağıdaki adımları takip ederek **Render.com** veya **Railway.app** gibi platformlarda yayınlayabilirsiniz.

### Adım 1: Veritabanı (PostgreSQL)
Proje şu anda **Neon (neondb)** üzerinde barındırılan bir PostgreSQL veritabanı kullanmaktadır. Bu veritabanı bulut tabanlıdır ve her yerden erişilebilir durumdadır.
- `DATABASE_URL` bağlantı adresi backend `.env` dosyasında tanımlıdır.

### Adım 2: Backend Dağıtımı (Render.com)
1. GitHub hesabınızda bir depo (repository) oluşturun ve kodları yükleyin.
2. Render.com'a üye olun ve "New Web Service" seçeneğini tıklayın.
3. GitHub deponuzu bağlayın.
4. Ayarları şu şekilde yapın:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Environment Variables**:
     - `DATABASE_URL`: `postgresql://neondb_owner:npg_pN0jb7KhkDyH@ep-holy-king-ag4umk0e-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require`
     - `JWT_SECRET`: (Güvenli bir şifre belirleyin)
5. "Create Web Service" butonuna tıklayın.
6. **Canlı Backend URL**: `https://web-donem-sonu-odevi.onrender.com`

### Adım 3: Frontend Dağıtımı (Vercel)
1. Vercel.com'a üye olun ve "Add New Project" deyin.
2. GitHub deponuzu seçin.
3. `frontend` klasörünü "Root Directory" olarak seçin.
4. **Environment Variables** kısmına şunu ekleyin:
   - `VITE_API_URL`: `https://web-donem-sonu-odevi.onrender.com`
5. "Deploy" butonuna tıklayın.

## 5. Proje Paylaşım Linki
- **Canlı Backend API**: `https://web-donem-sonu-odevi.onrender.com`
- **GitHub Reposu**: `https://github.com/ErayUlgen/Web-Donem-sonu-odevi.git`

---
*Bu rapor Antigravity AI tarafından 08.01.2026 tarihinde oluşturulmuştur.*
