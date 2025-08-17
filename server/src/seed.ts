
import { db } from './db/connection.js';
import { 
  users, 
  teachers, 
  parents, 
  students, 
  studentParents, 
  classes, 
  curriculumItems, 
  schedulePatterns 
} from './db/schema.js';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';

async function seedDemoData() {
  console.log('🌱 Starting seed process...');

  try {
    // Hash password for demo users
    const hashedPassword = await argon2.hash('admin123');

    // 1. Create admin user
    console.log('Creating admin user...');
    const [adminUser] = await db.insert(users)
      .values({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        address: 'Admin Address 123',
        phone: '+49 123 456 7890'
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          password: hashedPassword,
          name: 'Admin User'
        }
      })
      .returning();

    console.log(`✅ Admin user: ${adminUser.name} (ID: ${adminUser.id})`);

    // 2. Create teacher user + teacher profile
    console.log('Creating teacher user...');
    const [teacherUser] = await db.insert(users)
      .values({
        email: 'teacher@example.com',
        password: hashedPassword,
        name: 'Fatma Öğretmen',
        role: 'TEACHER',
        address: 'Teacher Address 456',
        phone: '+49 123 456 7891'
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          password: hashedPassword,
          name: 'Fatma Öğretmen'
        }
      })
      .returning();

    const [teacher] = await db.insert(teachers)
      .values({
        userId: teacherUser.id
      })
      .onConflictDoUpdate({
        target: teachers.userId,
        set: {
          userId: teacherUser.id
        }
      })
      .returning();

    console.log(`✅ Teacher: ${teacherUser.name} (User ID: ${teacherUser.id}, Teacher ID: ${teacher.id})`);

    // 3. Create parent user + parent profile
    console.log('Creating parent user...');
    const [parentUser] = await db.insert(users)
      .values({
        email: 'parent@example.com',
        password: hashedPassword,
        name: 'Ayşe Anne',
        role: 'PARENT',
        address: 'Parent Address 789',
        phone: '+49 123 456 7892'
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          password: hashedPassword,
          name: 'Ayşe Anne'
        }
      })
      .returning();

    const [parent] = await db.insert(parents)
      .values({
        userId: parentUser.id
      })
      .onConflictDoUpdate({
        target: parents.userId,
        set: {
          userId: parentUser.id
        }
      })
      .returning();

    console.log(`✅ Parent: ${parentUser.name} (User ID: ${parentUser.id}, Parent ID: ${parent.id})`);

    // 4. Create class
    console.log('Creating class...');
    const [classRecord] = await db.insert(classes)
      .values({
        name: 'T1-A'
      })
      .onConflictDoNothing()
      .returning();

    // If class already exists, get it
    let finalClass = classRecord;
    if (!classRecord) {
      [finalClass] = await db.select().from(classes).where(eq(classes.name, 'T1-A'));
    }

    console.log(`✅ Class: ${finalClass.name} (ID: ${finalClass.id})`);

    // 5. Create 3 students
    console.log('Creating students...');
    const studentData = [
      { firstName: 'Ahmet', lastName: 'Yılmaz', gender: 'MALE' as const },
      { firstName: 'Zeynep', lastName: 'Demir', gender: 'FEMALE' as const },
      { firstName: 'Mehmet', lastName: 'Kaya', gender: 'MALE' as const }
    ];

    const createdStudents = [];
    for (const studentInfo of studentData) {
      const [student] = await db.insert(students)
        .values({
          firstName: studentInfo.firstName,
          lastName: studentInfo.lastName,
          gender: studentInfo.gender,
          organization: 'Demo Teşkilat',
          address: `${studentInfo.firstName} Address`,
          phone: '+49 123 456 7893',
          classId: finalClass.id
        })
        .onConflictDoNothing()
        .returning();

      if (student) {
        createdStudents.push(student);
        console.log(`✅ Student: ${student.firstName} ${student.lastName} (ID: ${student.id})`);
      }
    }

    // 6. Link all students to the parent
    console.log('Creating student-parent relationships...');
    for (const student of createdStudents) {
      await db.insert(studentParents)
        .values({
          studentId: student.id,
          parentId: parent.id,
          relation: 'parent'
        })
        .onConflictDoNothing();
      
      console.log(`✅ Linked student ${student.firstName} to parent ${parentUser.name}`);
    }

    // 7. Create curriculum items
    console.log('Creating curriculum items...');
    const curriculumData = [
      { name: 'Elif-Cüz' },
      { name: 'Temel Bilgiler' }
    ];

    const createdCurriculumItems = [];
    for (const curriculumInfo of curriculumData) {
      const [curriculumItem] = await db.insert(curriculumItems)
        .values({
          name: curriculumInfo.name
        })
        .onConflictDoNothing()
        .returning();

      if (curriculumItem) {
        createdCurriculumItems.push(curriculumItem);
        console.log(`✅ Curriculum Item: ${curriculumItem.name} (ID: ${curriculumItem.id})`);
      }
    }

    // 8. Create schedule patterns for Saturday and Sunday
    console.log('Creating schedule patterns...');
    const scheduleData = [
      { 
        weekday: 6, // Saturday
        startTimeMin: 10 * 60, // 10:00 AM in minutes
        durationMin: 60, // 1 hour
        location: 'Classroom A'
      },
      { 
        weekday: 0, // Sunday
        startTimeMin: 10 * 60, // 10:00 AM in minutes
        durationMin: 60, // 1 hour
        location: 'Classroom B'
      }
    ];

    const createdSchedulePatterns = [];
    for (const scheduleInfo of scheduleData) {
      const [schedulePattern] = await db.insert(schedulePatterns)
        .values({
          classId: finalClass.id,
          teacherId: teacher.id,
          weekday: scheduleInfo.weekday,
          startTimeMin: scheduleInfo.startTimeMin,
          durationMin: scheduleInfo.durationMin,
          location: scheduleInfo.location,
          active: true
        })
        .onConflictDoNothing()
        .returning();

      if (schedulePattern) {
        createdSchedulePatterns.push(schedulePattern);
        const dayName = scheduleInfo.weekday === 6 ? 'Saturday' : 'Sunday';
        console.log(`✅ Schedule Pattern: ${dayName} 10:00-11:00 (ID: ${schedulePattern.id})`);
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Admin User ID: ${adminUser.id}`);
    console.log(`- Teacher User ID: ${teacherUser.id}, Teacher ID: ${teacher.id}`);
    console.log(`- Parent User ID: ${parentUser.id}, Parent ID: ${parent.id}`);
    console.log(`- Class ID: ${finalClass.id}`);
    console.log(`- Students: ${createdStudents.map(s => `${s.firstName} (${s.id})`).join(', ')}`);
    console.log(`- Curriculum Items: ${createdCurriculumItems.map(c => `${c.name} (${c.id})`).join(', ')}`);
    console.log(`- Schedule Patterns: ${createdSchedulePatterns.map(sp => sp.id).join(', ')}`);
    
    console.log('\n🔑 Login credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Teacher: teacher@example.com / admin123');
    console.log('Parent: parent@example.com / admin123');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemoData();
}

export { seedDemoData };
