# 🏫 University Dashboard Project

Welcome to the **University Dashboard Project**, a robust, modern, and high-performance management system designed to track university performance indicators, charts, and notifications. This project was developed entirely by **[Your Name/GitHub Username]**.

---

## 🌎 Language Selection / Dil Seçimi
- [English (#-english-en)](#-english-en)
- [Türkçe (#-türkçe-tr)](#-türkçe-tr)

---

# 🇺🇸 English (EN)

## 📌 Project Overview
The University Dashboard is a comprehensive web application providing real-time data visualization and performance tracking for academic institutions. It enables administrators and users to monitor Key Performance Indicators (KPIs), visualize data through dynamic charts, and manage institutional performance periods.

## 🏗️ Architecture
This project is built following **Clean Architecture** principles to ensure high maintainability, scalability, and testability.

### 🧩 Clean Architecture Layers
1.  **Domain**: Contains core entities, enums, and domain logic (e.g., `Indicator`, `Chart`, `PerformancePeriod`).
2.  **Application**: Implements business rules and use cases. This layer is independent of external concerns.
3.  **Infrastructure**: Handles data persistence (PostgreSQL with EF Core), external service integrations, and cross-cutting concerns (e.g., Token Service, Auth Service).
4.  **Presentation (WebAPI)**: The entry point of the backend system, exposing RESTful endpoints.
5.  **Frontend**: A modern React-based user interface.

### ⚡ CQRS Pattern (Command Query Responsibility Segregation)
The backend leverages the **CQRS pattern** using the **MediatR** library. 
- **Commands**: Separate logic for operations that modify state (Create, Update, Delete).
- **Queries**: Optimized logic for data retrieval (Read).
This separation allows for a more focused and scalable handling of complex business operations.

## 🛠️ Tech Stack
### Backend
- **Framework**: .NET 8 Web API
- **ORM**: Entity Framework Core
- **Database**: PostgreSQL
- **Patterns**: Clean Architecture, CQRS, Repository Pattern
- **Libraries**: MediatR, Serilog, AutoMapper, FluentValidation, JWT Authentication

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: React Context API
- **Styling**: CSS3 (Modular & Global)
- **Visualization**: Chart.js, React-Chartjs-2, Three.js (for 3D elements)
- **Icons**: Lucide-React
- **HTTP Client**: Axios

## 📂 Project Structure
- `src/Domain`: Core entities and enums.
- `src/Application`: CQRS Handlers, DTOs, and Interfaces.
- `src/Infrastructure`: Persistence and Service implementations.
- `src/Presentation/WebApi`: API Controllers and Configuration.
- `src/Presentation/frontend`: React application source code.

---

# 🇹🇷 Türkçe (TR)

## 📌 Proje Özeti
University Dashboard (Üniversite Dashboard), akademik kurumlar için gerçek zamanlı veri görselleştirme ve performans takibi sağlayan kapsamlı bir web uygulamasıdır. Yöneticilerin ve kullanıcıların Temel Performans Göstergelerini (KPI) izlemelerine, dinamik grafikler aracılığıyla verileri görselleştirmelerine ve kurumsal performans dönemlerini yönetmelerine olanak tanır.

Bu projenin tüm geliştirme süreci tek başıma gerçekleştirilmiştir.

## 🏗️ Mimari Yapı
Bu proje, sürdürülebilirlik, ölçeklenebilirlik ve test edilebilirliği sağlamak amacıyla **Clean Architecture (Temiz Mimari)** prensipleri takip edilerek inşa edilmiştir.

### 🧩 Temiz Mimari Katmanları
1.  **Domain (Alan)**: Çekirdek varlıkları (Entity), enumları ve alan mantığını içerir (Örn: `Indicator`, `Chart`, `PerformancePeriod`).
2.  **Application (Uygulama)**: İş kurallarını ve kullanım durumlarını (Use Cases) uygular. Bu katman dış etkenlerden bağımsızdır.
3.  **Infrastructure (Altyapı)**: Veri kalıcılığını (EF Core ile PostgreSQL), dış servis entegrasyonlarını ve çapraz kesen ilgileri (Örn: Token Servisi, Auth Servisi) yönetir.
4.  **Presentation (Sunum - WebAPI)**: Arka uç sisteminin giriş noktasıdır ve RESTful uç noktalarını sunar.
5.  **Frontend (Ön Yüz)**: Modern React tabanlı kullanıcı arayüzü.

### ⚡ CQRS Deseni (Command Query Responsibility Segregation)
Back-end tarafında, **MediatR** kütüphanesi kullanılarak **CQRS deseni** uygulanmıştır.
- **Commands (Komutlar)**: Durumu değiştiren işlemler (Oluşturma, Güncelleme, Silme) için ayrı mantık.
- **Queries (Sorgular)**: Veri alımı (Okuma) için optimize edilmiş mantık.
Bu ayrım, karmaşık iş operasyonlarının daha odaklı ve ölçeklenebilir bir şekilde yönetilmesini sağlar.

## 🛠️ Teknoloji Yığını
### Back-end (Arka Uç)
- **Framework**: .NET 8 Web API
- **ORM**: Entity Framework Core
- **Veritabanı**: PostgreSQL
- **Desenler**: Clean Architecture, CQRS, Repository Deseni
- **Kütüphaneler**: MediatR, Serilog, AutoMapper, FluentValidation, JWT Yetkilendirme

### Ön Yüz (Frontend)
- **Framework**: React 19 (Vite)
- **Durum Yönetimi**: React Context API
- **Stil**: CSS3
- **Görselleştirme**: Chart.js, React-Chartjs-2, Three.js (3D bileşenler için)
- **İkonlar**: Lucide-React
- **HTTP İstemci**: Axios

## 📂 Proje Yapısı
- `src/Domain`: Temel varlıklar ve enumlar.
- `src/Application`: CQRS İşleyicileri (Handlers), DTO'lar ve Arayüzler.
- `src/Infrastructure`: Veri tabanı ve Servis uygulamaları.
- `src/Presentation/WebApi`: API Kontrolcüleri ve Yapılandırma.
- `src/Presentation/frontend`: React uygulaması kaynak kodları.

---

## 🚀 Getting Started / Başlangıç

### Prerequisites / Gereksinimler
- .NET 8 SDK
- Node.js (v18+)
- PostgreSQL

### Installation / Kurulum
1.  **Repository'yi klonlayın**:
    ```bash
    git clone https://github.com/your-username/UniversityDashboardProject.git
    ```
2.  **Veritabanı Yapılandırması**:
    - `appsettings.json` içerisindeki `ConnectionStrings` bölümünü kendi PostgreSQL bilgilerinizle güncelleyin.
3.  **Back-end'i Çalıştırın**:
    ```bash
    cd src/Presentation/WebApi/UniversityDashboard.WebApi
    dotnet run
    ```
4.  **Front-end'i Çalıştırın**:
    ```bash
    cd src/Presentation/frontend
    npm install
    npm run dev
    ```

---

## 📧 Contact / İletişim
**Developed by:** [Your Name]
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your Profile]
