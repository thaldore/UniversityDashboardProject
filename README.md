# 🏫 University Dashboard Project

A high-performance, real-time analytics and management system for higher education institutions. Built on the principles of **Clean Architecture** and **CQRS**, this project provides a premium experience for monitoring KPIs, performance scoring, and data visualization.

> [!IMPORTANT]
> **Individual Development:** This entire ecosystem, comprising the multi-layered .NET backend, the React-Three-Fiber frontend, and the complex database schema, was architected and developed exclusively by **Tolga Çınar**.

---

## 🌎 Language Selection / Dil Seçimi
- [English (EN)](#-english-en)
- [Türkçe (TR)](#-türkçe-tr)

---

# 🇺🇸 English (EN)

## 📌 Project Concept
The University Dashboard is a centralized platform designed to handle the complexity of academic data. It allows administrators to define indicators, departments to submit periodic data, and the system to automatically calculate performance scores based on predefined targets. The front-end utilizes 3D visualization to provide an immersive data exploration experience.

---

## 🏗️ Deep Architectural Dive
The system is built using **Clean Architecture** (Onion Architecture), ensuring that the core business logic remains independent of external frameworks, databases, or UI.

### 🧩 Layer Responsibilities
| Layer | Description | Key Components |
| :--- | :--- | :--- |
| **Domain** | The innermost layer. Pure business logic and state. | Entities (`Indicator`, `Chart`, `PerformanceTarget`), Enums, Domain Services (`IPeriodCalculationService`). |
| **Application** | Orchestrates flow. Implements the "Use Cases". | MediatR Commands/Queries, DTOs, FluentValidation, AutoMapper Profiles. |
| **Infrastructure** | Concrete implementations of interfaces. | `ApplicationDbContext` (EF Core), JWT Token Service, Identity Management, Seeding Logic. |
| **Presentation** | Entry points for the application. | .NET 8 WebAPI Controllers, React 19 SPA, Swagger documentation. |

### ⚡ Behavioral Pattern: CQRS with MediatR
The project separates "Writes" (Commands) from "Reads" (Queries) to optimize performance and maintainability:
- **Commands**: Every state change (e.g., `SaveIndicatorDataCommand`) is a distinct object handled by a specific handler, ensuring transaction integrity and validation.
- **Queries**: Data retrieval (e.g., `GetChartDataQuery`) is optimized for the UI, often bypassing complex logic to provide fast response times.
- **Cross-Cutting Concerns**: Logging (Serilog) and Validation (FluentValidation) are integrated into the pipeline.

---

## 🚀 Key Feature Showcase

### 📊 1. 3D Interactive Data Visualization
- **Technology**: Built with **Three.js** and **React Three Fiber**.
- **Capabilities**: Interactive 3D Bar and Difference charts with real-time shadow casting, dynamic scaling, and hover effects for precise data reading.
- **State Integration**: Directly connected to the backend Chart system, allowing dynamic dashboard configurations.

### 📈 2. Advanced Indicator Management
- **Hierarchical Structure**: Manage indicators across departments with granular categories.
- **Periodic Data Entry**: Intelligent system that calculates Quarter (Q1-Q4) and Yearly periods automatically using `IPeriodCalculationService`.
- **Drafting System**: Users can save data as drafts before final submission.
- **Excel Export**: Integrated reporting allowing admins to export all indicator data to `.xlsx` format.

### 🎯 3. Performance & Target Scoring
- **Automated Calculation**: The system automatically calculates target achievement percentages and standardized scores.
- **Workflow**: Multi-stage approval process for performance targets (Assign -> Submit -> Approve/Reject).
- **Weighting**: Supports weighted indicator contributions to overall department performance.

### 🔔 4. Real-time Notification System
- **Contextual Alerts**: Automatic notifications for target assignments, progress submissions, and approval status changes.
- **User Experience**: Unread count tracking and categorized notification items.

---

## 🛠️ Comprehensive Tech Stack
### **Backend (.NET 8)**
- **Framework**: ASP.NET Core Web API
- **Persistence**: PostgreSQL with EF Core
- **Identity**: Microsoft Identity with JWT Bearer Authentication
- **Mapping/Validation**: AutoMapper & FluentValidation
- **Diagnostics**: Serilog with Console/Seq sinks

### **Frontend (React 19)**
- **Bundler**: Vite
- **3D Engine**: Three.js / @react-three/fiber / @react-three/drei
- **UI Components**: Lucide-React for iconography, custom glassmorphic CSS
- **State Management**: React Context API & dedicated API clients with Interceptors

---

## 📂 Project Structure
```text
UniversityDashboardProject/
├── src/
│   ├── Domain/              # Core Entities, Enums & Logic
│   ├── Application/         # MediatR Handlers, DTOs, Use Cases
│   ├── Infrastructure/      # DB Context, Migrations, External Services
│   └── Presentation/
│       ├── WebApi/          # .NET REST API Controllers
│       └── frontend/        # React 19 Application (3D Dashboards)
└── UniversityDashboard.sln
```

---

## 🚦 Getting Started (English)

### 📋 Prerequisites
- **.NET 8 SDK**
- **Node.js** (v18+) & **npm**
- **PostgreSQL** instance running locally or remotely
- **Seq** (Optional, for advanced login visualization)

### 🔧 Installation & Setup

1.  **Clone & Navigate**:
    ```bash
    git clone https://github.com/thaldore/UniversityDashboardProject.git
    cd UniversityDashboardProject
    ```

2.  **Database Configuration**:
    - Locate `src/Presentation/WebApi/UniversityDashboard.WebApi/appsettings.json`.
    - Modify the `DefaultConnection` string:
      ```json
      "DefaultConnection": "Host=localhost;Database=UniversityDb;Username=your_user;Password=your_password"
      ```

3.  **Apply Migrations**:
    ```bash
    cd src/Infrastructure/UniversityDashboard.Infrastructure
    dotnet ef database update --startup-project ../../Presentation/WebApi/UniversityDashboard.WebApi
    ```

4.  **Run Backend**:
    ```bash
    cd src/Presentation/WebApi/UniversityDashboard.WebApi
    dotnet run
    ```
    *API will be available at `https://localhost:7111` and Swagger UI at `/swagger`.*

5.  **Run Frontend**:
    ```bash
    cd src/Presentation/frontend
    npm install
    npm run dev
    ```
    *Dashboard will be available at `http://localhost:5173`.*

---

# 🇹🇷 Türkçe (TR)

## 📌 Proje Konsepti
University Dashboard, akademik verilerin karmaşıklığını yönetmek için tasarlanmış merkezi bir platformdur. Yöneticilerin göstergeler tanımlamasına, departmanların periyodik veri girişi yapmasına ve sistemin önceden tanımlanmış hedeflere göre performans puanlarını otomatik olarak hesaplamasına olanak tanır. Ön yüz, verileri keşfetmek için **Three.js** tabanlı 3D görselleştirmeler sunar.

---

## 🏗️ Derinlemesine Mimari Bakış
Sistem, çekirdek iş mantığının harici çerçevelerden, veritabanlarından veya kullanıcı arayüzünden bağımsız kalmasını sağlayan **Clean Architecture** (Temiz Mimari) kullanılarak inşa edilmiştir.

### 🧩 Katman Sorumlulukları
| Katman | Açıklama | Temel Bileşenler |
| :--- | :--- | :--- |
| **Domain** | En iç katman. Saf iş mantığı ve durum. | Varlıklar (`Indicator`, `Chart`, `PerformanceTarget`), Enumlar, Alan Servisleri (`IPeriodCalculationService`). |
| **Application** | Akışı yönetir. "Kullanım Durumlarını" uygular. | MediatR Komut/Sorgu yapıları, DTO'lar, FluentValidation, AutoMapper Profilleri. |
| **Infrastructure** | Arayüzlerin somut uygulamaları. | `ApplicationDbContext` (EF Core), JWT Token Servisi, Identity Yönetimi. |
| **Presentation** | Uygulama giriş noktaları. | .NET 8 WebAPI Kontrolcüleri, React 19 SPA, Swagger dokümantasyonu. |

### ⚡ Davranışsal Desen: MediatR ile CQRS
Proje, performansı ve bakımı optimize etmek için "Yazma" (Komutlar) ile "Okuma" (Sorguları) birbirinden ayırır:
- **Komutlar (Commands)**: Her durum değişikliği (Örn: `SaveIndicatorDataCommand`), işlem bütünlüğünü ve doğrulamayı sağlayan özel bir "Handler" tarafından yönetilir.
- **Sorgular (Queries)**: Veri getirme işlemleri (Örn: `GetChartDataQuery`), hızlı yanıt süreleri sağlamak için optimize edilmiştir.
- **Çapraz Kesme Kaygıları**: Günlükleme (Serilog) ve Doğrulama (FluentValidation) işlem hattına entegre edilmiştir.

---

## 🚀 Öne Çıkan Özellikler

### 📊 1. 3D Etkileşimli Veri Görselleştirme
- **Teknoloji**: **Three.js** ve **React Three Fiber** ile geliştirildi.
- **Yetenekler**: Gerçek zamanlı gölge dökümü, dinamik ölçeklendirme ve hassas veri okuma için hover efektleri içeren etkileşimli 3D Sütun ve Fark grafikleri.
- **Durum Entegrasyonu**: Backend grafik sistemiyle doğrudan bağlantılıdır, dinamik dashboard yapılandırmalarına olanak tanır.

### 📈 2. Gelişmiş Gösterge Yönetimi
- **Hiyerarşik Yapı**: Departmanlar bazında göstergeleri detaylı kategorilerle yönetin.
- **Periyodik Veri Girişi**: `IPeriodCalculationService` kullanarak Çeyrek (Q1-Q4) ve Yıllık periyotları otomatik olarak hesaplayan akıllı sistem.
- **Taslak Sistemi**: Kullanıcılar verileri kesin göndermeden önce taslak olarak kaydedebilir.
- **Excel Dışa Aktarım**: Yöneticilerin tüm gösterge verilerini `.xlsx` formatında dışa aktarmasına olanak tanıyan entegre raporlama.

### 🎯 3. Performans ve Hedef Puanlama
- **Otomatik Hesaplama**: Sistem, hedef gerçekleştirme yüzdelerini ve standartlaştırılmış puanları otomatik olarak hesaplar.
- **İş Akışı**: Performans hedefleri için çok aşamalı onay süreci (Ata -> Gönder -> Onayla/Reddet).
- **Ağırlıklandırma**: Göstergelerin genel departman performansına ağırlıklı puan katkısını destekler.

### 🔔 4. Gerçek Zamanlı Bildirim Sistemi
- **Bağlamsal Uyarılar**: Hedef atamaları, ilerleme gönderimleri ve onay durumu değişiklikleri için otomatik bildirimler.
- **Kullanıcı Deneyimi**: Okunmamış bildirim takibi ve kategorize edilmiş bildirim öğeleri.

---

## 🛠️ Kapsamlı Teknoloji Yığını
### **Arka Uç (.NET 8)**
- **Framework**: ASP.NET Core Web API
- **Veritabanı**: PostgreSQL & EF Core
- **Kimlik Yönetimi**: JWT Bearer ile Microsoft Identity
- **Dönüşüm/Doğrulama**: AutoMapper & FluentValidation
- **Teşhis**: Console ve Seq entegreli Serilog

### **Ön Yüz (React 19)**
- **Derleyici**: Vite
- **3D Motoru**: Three.js / @react-three/fiber
- **Arayüz**: Lucide-React ikonları, özel glassmorphic CSS tasarımı
- **Durum Yönetimi**: React Context API ve Interceptor içeren API istemcileri

---

## 🚦 Başlangıç (Türkçe)

### 📋 Ön Gereksinimler
- **.NET 8 SDK**
- **Node.js** (v18+) & **npm**
- **PostgreSQL** veritabanı
- **Seq** (Opsiyonel, gelişmiş log görselleştirme için)

### 🔧 Kurulum ve Boyutlandırma

1.  **Klonlayın ve Klasöre Girin**:
    ```bash
    git clone https://github.com/thaldore/UniversityDashboardProject.git
    cd UniversityDashboardProject
    ```

2.  **Veritabanı Yapılandırması**:
    - `src/Presentation/WebApi/UniversityDashboard.WebApi/appsettings.json` dosyasını bulun.
    - `DefaultConnection` dizesini güncelleyin:
      ```json
      "DefaultConnection": "Host=localhost;Database=UniversityDb;Username=kullanici_adiniz;Password=sifreniz"
      ```

3.  **Veritabanını Hazırlayın (Migrations)**:
    ```bash
    cd src/Infrastructure/UniversityDashboard.Infrastructure
    dotnet ef database update --startup-project ../../Presentation/WebApi/UniversityDashboard.WebApi
    ```

4.  **Arka Ucu Başlatın**:
    ```bash
    cd src/Presentation/WebApi/UniversityDashboard.WebApi
    dotnet run
    ```
    *API `https://localhost:7111` adresinde, Swagger arayüzü ise `/swagger` yolunda çalışacaktır.*

5.  **Ön Yüzü Başlatın**:
    ```bash
    cd src/Presentation/frontend
    npm install
    npm run dev
    ```
    *Dashboard `http://localhost:5173` adresinden erişilebilir olacaktır.*

---

## 👨‍💻 Developer / Geliştirici
- **Developed by**: Tolga Çınar
- **GitHub Username**: [thaldore](https://github.com/thaldore)
- **Email**: t.cinar@example.com (Opsiyonel)
