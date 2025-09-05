# Üniversite Dashboard Projesi - Frontend

Bu proje, üniversite gösterge sistemini yönetmek için geliştirilmiş modern bir React uygulamasıdır.

## 🚀 Özellikler

### Gösterge Yönetimi
- **Gösterge Listesi**: Tüm göstergeleri görüntüleme, filtreleme ve arama
- **Yeni Gösterge Oluşturma**: Kapsamlı form ile yeni gösterge tanımlama
- **Gösterge Düzenleme**: Mevcut göstergeleri güncelleme
- **Veri Girişi**: Dönemsel gösterge verilerini girme ve yönetme

### Tasarım Özellikleri
- 🎨 **Premium Modern Tasarım**: Gradient renkler ve modern UI elementleri
- 📱 **Responsive Design**: Tüm cihazlarda uyumlu çalışma
- 🌈 **İnteraktif Animasyonlar**: Hover efektleri ve geçiş animasyonları
- 🎯 **Kullanıcı Dostu Arayüz**: Kolay navigasyon ve sezgisel kullanım

## 📋 Gerekli Sayfalar

### 1. Gösterge Listesi Sayfası (`/indicators`)
- Gösterge durumu (aktif/pasif) göstergesi
- Gösterge grubu (departman) 
- Gösterge kodu ve adı
- Gösterge tipi
- Kök değerler (1-2-3...)
- İşlem menüsü (görüntüle, düzenle, sil)
- Arama ve filtreleme özellikleri

### 2. Yeni Gösterge Kayıt Sayfası (`/indicators/new`)
- **Temel Bilgiler**: Ad, kod, açıklama
- **Departman ve Atama**: Gösterge grubu, atanacak kişi, uyarı alacak kişi
- **Gösterge Ayarları**: Tip, periyot, bilgilendirme süresi
- **Kök Değerler**: Dinamik kök değer ekleme/çıkarma
- **Geçmiş Dönem Verileri**: 2 dönemlik geçmiş veri girişi
- **Durum Ayarları**: Aktif/pasif, otomatik hesaplama

### 3. Veri Giriş Ekranı (`/indicators/data-entry`)
- **Dönem Seçimi**: Yıl ve dönem seçici
- **Tablo Formatında Veri Girişi**:
  - Gösterge kodu ve adı
  - Açıklama
  - Otomatik hesaplama simgesi
  - Değer girişi alanı
  - Geçmiş dönem verileri (1 ve 2)
  - Onay durumu seçici
  - Açıklama alanı
- **Genel Açıklama**: Tablo dışında genel notlar
- **Kaydetme Seçenekleri**: Taslak kaydet, kaydet ve gönder

## 🛠️ Teknolojiler

- **React 19** - Modern React hooks ve fonksiyonlar
- **React Router DOM** - SPA routing
- **Axios** - HTTP client
- **CSS3** - Modern CSS özellikleri (Grid, Flexbox, Animations)
- **Vite** - Hızlı geliştirme ortamı

## 📁 Proje Yapısı

```
src/
├── components/           # React bileşenleri
│   ├── auth/            # Kimlik doğrulama bileşenleri
│   ├── common/          # Ortak bileşenler (LoadingSpinner, ErrorMessage)
│   └── layout/          # Düzen bileşenleri (Layout, Navbar, Sidebar)
├── pages/               # Sayfa bileşenleri
│   ├── auth/           # Giriş, kayıt, profil sayfaları
│   ├── dashboard/      # Ana sayfa
│   └── indicators/     # Gösterge sayfaları
│       ├── IndicatorListPage.jsx
│       ├── NewIndicatorPage.jsx
│       ├── EditIndicatorPage.jsx
│       └── DataEntryPage.jsx
├── services/           # API ve yardımcı servisler
│   ├── api/           # API servisleri
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   └── indicatorService.js
│   └── utils/         # Yardımcı fonksiyonlar
│       ├── constants.js
│       └── helpers.js
├── styles/            # CSS dosyaları
│   ├── components/    # Bileşen stilleri
│   ├── pages/         # Sayfa stilleri
│   │   ├── indicator-list.css
│   │   ├── indicator-form.css
│   │   └── data-entry.css
│   └── utils/         # CSS yardımcıları
└── context/           # React Context'leri
    └── AuthContext.jsx
```

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Primary**: Mavi gradientler (#3b82f6 → #1d4ed8)
- **Success**: Yeşil tonları (#10b981, #059669)
- **Warning**: Turuncu tonları (#f59e0b, #d97706)
- **Danger**: Kırmızı tonları (#ef4444, #dc2626)
- **Neutral**: Gri tonları (#f8fafc → #1e293b)

### Tipografi
- **Başlıklar**: 700 font-weight, gradient renkler
- **Alt başlıklar**: 600 font-weight
- **Etiketler**: 600 font-weight, uppercase, letter-spacing
- **Metinler**: 400-500 font-weight

### Bileşenler
- **Butonlar**: Gradient arka planlar, hover animasyonları
- **Form Elemanları**: Yuvarlatılmış köşeler, focus efektleri
- **Kartlar**: Box-shadow, border-radius
- **Tablolar**: Hover efektleri, zebra striping

## 🚀 Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Üretim için build al
npm run build

# Üretim build'ini önizle
npm run preview
```

## 📱 Responsive Tasarım

- **Desktop**: 1200px ve üzeri - Full layout
- **Tablet**: 768px - 1199px - Adaptif grid sistemi
- **Mobile**: 480px - 767px - Tek sütun, stack layout
- **Small Mobile**: 479px ve altı - Kompakt tasarım

## 🔧 API Entegrasyonu

### Backend Endpoints
```javascript
// Gösterge yönetimi
GET    /api/indicator              // Gösterge listesi
POST   /api/indicator              // Yeni gösterge
GET    /api/indicator/{id}         // Gösterge detayı
PUT    /api/indicator/{id}         // Gösterge güncelle
DELETE /api/indicator/{id}         // Gösterge sil

// Veri girişi
GET    /api/indicator/data-entry   // Veri giriş formu
POST   /api/indicator/data-entry   // Veri kaydet

// Yardımcı endpoints
GET    /api/indicator/departments  // Departmanlar
GET    /api/indicator/users/department/{id} // Departman kullanıcıları
```

## 🎯 Özellik Detayları

### Gösterge Listesi
- Arama kutusu (gösterge adı, kodu, departman)
- Durum filtreleri (tümü, aktif, pasif)
- Sayfalama (büyük veri setleri için)
- Sıralama seçenekleri
- Toplu işlemler

### Form Validasyonları
- Zorunlu alan kontrolleri
- Format validasyonları
- Real-time hata mesajları
- Backend validasyon entegrasyonu

### Veri Girişi
- Otomatik kaydetme (draft)
- Toplu veri girişi
- Geçmiş dönem karşılaştırması
- Onay durumu yönetimi

## 🔐 Güvenlik

- JWT token tabanlı kimlik doğrulama
- Refresh token mekanizması
- Route koruma (PrivateRoute)
- API error handling
- XSS koruması

## 📈 Performans

- Lazy loading için React.Suspense
- Memoization ile gereksiz render'ları önleme
- API cache mekanizması
- Optimize edilmiş bundle boyutu
- Progressive loading

Bu frontend uygulaması, modern web standartlarına uygun, kullanıcı dostu ve performanslı bir gösterge yönetim sistemi sunar.
