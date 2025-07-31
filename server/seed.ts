import { storage } from './storage';
import { hashPassword } from './auth';

async function seedDatabase() {
  console.log('Veritabanı seed işlemi başlatılıyor...');

  try {
    // Program türlerini oluştur - duplicate check
    const programTypeData = [
      { name: 'Haftasonu', description: 'Hafta sonu programı' },
      { name: 'Yatılı', description: 'Yatılı program' },
      { name: 'Yetişkin', description: 'Yetişkin eğitim programı' }
    ];

    const programTypes = [];
    for (const data of programTypeData) {
      try {
        const existing = await storage.getProgramTypeByName(data.name);
        if (existing) {
          console.log(`Program türü zaten mevcut: ${data.name}`);
          programTypes.push(existing);
        } else {
          const created = await storage.createProgramType(data);
          programTypes.push(created);
        }
      } catch (error) {
        // If it fails due to unique constraint, try to get existing one
        const existing = await storage.getProgramTypeByName(data.name);
        if (existing) {
          programTypes.push(existing);
        } else {
          throw error;
        }
      }
    }

    // Sınıfları oluştur - duplicate check
    const classData = [
      { name: 'T1a', level: 1, programTypeId: programTypes[0].id },
      { name: 'T1b', level: 1, programTypeId: programTypes[0].id },
      { name: 'T2a', level: 2, programTypeId: programTypes[0].id },
      { name: 'T2b', level: 2, programTypeId: programTypes[1].id },
      { name: 'T3a', level: 3, programTypeId: programTypes[1].id },
      { name: 'T3b', level: 3, programTypeId: programTypes[2].id }
    ];

    const classes = [];
    for (const data of classData) {
      try {
        const existing = await storage.getClassByName(data.name);
        if (existing) {
          console.log(`Sınıf zaten mevcut: ${data.name}`);
          classes.push(existing);
        } else {
          const created = await storage.createClass(data);
          classes.push(created);
        }
      } catch (error) {
        // If it fails due to unique constraint, try to get existing one
        const existing = await storage.getClassByName(data.name);
        if (existing) {
          classes.push(existing);
        } else {
          throw error;
        }
      }
    }

    // Kullanıcıları oluştur (2 admin, 3 öğretmen, 3 veli) - duplicate check
    const hashedPassword = await hashPassword('123456');
    
    const userData = [
      { name: 'Ahmet Yılmaz', username: 'admin', email: 'admin@example.com', password: hashedPassword, role: 'ADMIN' as const },
      { name: 'Mehmet Özkan', username: 'admin2', email: 'admin2@example.com', password: hashedPassword, role: 'ADMIN' as const },
      { name: 'Fatma Özkan', username: 'ogretmen', email: 'ogretmen@example.com', password: hashedPassword, role: 'TEACHER' as const },
      { name: 'Ayşe Demir', username: 'ogretmen2', email: 'ogretmen2@example.com', password: hashedPassword, role: 'TEACHER' as const },
      { name: 'Zeynep Kaya', username: 'ogretmen3', email: 'ogretmen3@example.com', password: hashedPassword, role: 'TEACHER' as const },
      { name: 'Emine Yıldız', username: 'veli', email: 'veli@example.com', password: hashedPassword, role: 'PARENT' as const },
      { name: 'Hatice Şahin', username: 'veli2', email: 'veli2@example.com', password: hashedPassword, role: 'PARENT' as const },
      { name: 'Meryem Çelik', username: 'veli3', email: 'veli3@example.com', password: hashedPassword, role: 'PARENT' as const }
    ];

    const users = [];
    for (const data of userData) {
      try {
        const existing = await storage.getUserByUsername(data.username);
        if (existing) {
          console.log(`Kullanıcı zaten mevcut: ${data.username}`);
          users.push(existing);
        } else {
          const created = await storage.createUser(data);
          users.push(created);
        }
      } catch (error) {
        // If it fails due to unique constraint, try to get existing one
        const existing = await storage.getUserByUsername(data.username);
        if (existing) {
          users.push(existing);
        } else {
          throw error;
        }
      }
    }

    const admins = users.filter(u => u.role === 'ADMIN');
    const teachers = users.filter(u => u.role === 'TEACHER');
    const parentUsers = users.filter(u => u.role === 'PARENT');

    // Öğrencileri oluştur (her sınıfta 3 öğrenci - easier to review)
    const studentNames = [
      'Ahmet Yıldız', 'Ayşe Kaya', 'Mehmet Demir'
    ];

    const students = [];
    for (let classIndex = 0; classIndex < classes.length; classIndex++) {
      for (let studentIndex = 0; studentIndex < 3; studentIndex++) {
        const firstName = studentNames[studentIndex].split(' ')[0];
        const lastName = studentNames[studentIndex].split(' ')[1] + (classIndex + 1);
        
        const student = await storage.createStudent({
          firstName,
          lastName,
          classId: classes[classIndex].id
        });
        students.push(student);
      }
    }

    // Velileri öğrencilere bağla (her velinin bir öğrencisi olsun)
    for (let i = 0; i < Math.min(parentUsers.length, students.length); i++) {
      await storage.createParent({
        userId: parentUsers[i].id,
        studentId: students[i].id
      });
    }

    // Ders planları oluştur (her program türü için 10 hafta)
    const subjects = ['Kur\'an-ı Kerim', 'Hadis-i Şerif', 'Fıkıh', 'Siyer', 'Ahlak'];
    
    for (const programType of programTypes) {
      for (let week = 1; week <= 10; week++) {
        for (let level = 1; level <= 3; level++) {
          const subject = subjects[(week + level - 2) % subjects.length];
          await storage.createLessonPlan({
            week,
            subject,
            pagesFrom: (week - 1) * 10 + 1,
            pagesTo: week * 10,
            classLevel: level,
            programTypeId: programType.id
          });
        }
      }
    }

    // Her öğrenci için örnek ilerleme, devam ve davranış kayıtları oluştur
    for (const student of students.slice(0, 20)) { // İlk 20 öğrenci için
      for (let week = 1; week <= 5; week++) {
        // İlerleme kaydı
        const pagesPlanned = 30;
        const pagesDone = Math.floor(Math.random() * pagesPlanned) + 15; // 15-30 arası
        
        await storage.createProgress({
          studentId: student.id,
          week,
          pagesDone,
          pagesPlanned
        });

        // Devam kaydı
        const attendanceStatuses = ['geldi', 'gelmedi', 'mazeretli'] as const;
        const status = attendanceStatuses[Math.floor(Math.random() * 3)];
        
        await storage.createAttendance({
          studentId: student.id,
          week,
          status
        });

        // Davranış notu
        const behaviorComments = [
          'Çok başarılı, aktif katılım gösterdi',
          'İyi çalışıyor, biraz daha odaklanabilir', 
          'Mükemmel performans, tüm konularda başarılı',
          'Gelişim gösteriyor, devam etmeli',
          'Ödevlerini düzenli yapıyor'
        ];
        
        await storage.createBehavior({
          studentId: student.id,
          week,
          comment: behaviorComments[Math.floor(Math.random() * behaviorComments.length)]
        });
      }
    }

    console.log('Veritabanı seed işlemi başarıyla tamamlandı!');
    console.log(`- ${programTypes.length} program türü oluşturuldu`);
    console.log(`- ${classes.length} sınıf oluşturuldu`);
    console.log(`- ${admins.length + teachers.length + parentUsers.length} kullanıcı oluşturuldu`);
    console.log(`- ${students.length} öğrenci oluşturuldu`);
    console.log('Giriş bilgileri:');
    console.log('Admin: admin / 123456');
    console.log('Öğretmen: ogretmen / 123456');
    console.log('Veli: veli / 123456');

  } catch (error) {
    console.error('Seed işlemi sırasında hata:', error);
  }
}

export { seedDatabase };

// Run the seed function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seed script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}
