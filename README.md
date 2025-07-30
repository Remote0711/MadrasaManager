# İslami Okul Yönetim Sistemi

Bu proje, hafta sonu İslami okul için geliştirilen kapsamlı bir yönetim sistemidir. React, TypeScript, Express.js ve PostgreSQL kullanılarak geliştirilmiştir.

## Özellikler

### Rol Tabanlı Erişim
- **Yönetici (ADMIN)**: Kullanıcı, sınıf, öğrenci ve ders planı yönetimi
- **Öğretmen (TEACHER)**: Haftalık ilerleme, devam durumu ve davranış takibi
- **Veli (PARENT)**: Çocuğun ilerleme ve devam durumunu görüntüleme

### Temel Özellikler
- Kullanıcı kimlik doğrulama ve yetkilendirme
- Öğrenci kayıt ve yönetim sistemi
- Sınıf ve program türü yönetimi
- Haftalık ders planı oluşturma
- İlerleme takibi (%90+ yeşil, %50-89 sarı, %50 altı kırmızı)
- Devam durumu kaydı (geldi, gelmedi, mazeretli)
- Davranış notları
- Responsive tasarım (mobil, tablet, desktop)

### Program Türleri
- **Haftasonu**: Hafta sonu programı
- **Yatılı**: Yatılı program
- **Yetişkin**: Yetişkin eğitim programı

## Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL
- npm veya yarn

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Çevre değişkenlerini ayarlayın:**
   `.env` dosyası oluşturun ve veritabanı bağlantı bilgilerini ekleyin:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/islamic_school"
   SESSION_SECRET="your-secret-key"
   ```

3. **Veritabanı şemasını oluşturun:**
   ```bash
   npm run db:push
   ```

4. **Örnek verileri yükleyin:**
   ```bash
   npx tsx server/seed.ts
   ```

5. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

Uygulama `http://localhost:5000` adresinde çalışacaktır.

## Demo Kullanıcı Bilgileri

Seed script çalıştırıldıktan sonra aşağıdaki demo hesapları kullanılabilir:

- **Yönetici**: admin1@islamiokul.com / 123456
- **Öğretmen**: ogretmen1@islamiokul.com / 123456
- **Veli**: veli1@islamiokul.com / 123456

## Veritabanı Yapısı

### Ana Tablolar
- `users`: Kullanıcı bilgileri ve rolleri
- `program_types`: Program türleri (Haftasonu, Yatılı, Yetişkin)
- `classes`: Sınıf bilgileri
- `students`: Öğrenci bilgileri
- `parents`: Veli-öğrenci ilişkileri
- `lesson_plans`: Haftalık ders planları
- `progress`: İlerleme kayıtları
- `attendance`: Devam durumu kayıtları
- `behavior`: Davranış notları

### Sınıf Yapısı
- T1a, T1b: 1. seviye sınıfları
- T2a, T2b: 2. seviye sınıfları
- T3a, T3b: 3. seviye sınıfları

## Geliştirme

### Teknoloji Yığını
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **Veritabanı**: PostgreSQL, Drizzle ORM
- **Kimlik Doğrulama**: Express Session, bcrypt
- **Form Yönetimi**: React Hook Form
- **API İstekleri**: TanStack Query

### Proje Yapısı
