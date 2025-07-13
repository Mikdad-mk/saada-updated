const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/saada-students-union";

async function setupAuth() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Check if demo users already exist
    const existingUsers = await users.find({}).toArray();
    if (existingUsers.length > 0) {
      console.log('Users already exist in database. Skipping setup.');
      return;
    }
    
    // Create demo users
    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@saada.com',
        password: await bcrypt.hash('Admin123!', 12),
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          avatar: null,
          bio: 'System Administrator',
          phone: '',
          department: 'IT',
          year: '4th Year',
          studentId: 'ADM001',
        },
        preferences: {
          notifications: { email: true, push: true, sms: false },
          privacy: { profileVisibility: 'public', showEmail: false, showPhone: false },
        },
        stats: {
          quizzesTaken: 0,
          quizzesWon: 0,
          totalScore: 0,
          averageScore: 0,
          joinDate: new Date(),
        },
      },
      {
        name: 'Moderator User',
        email: 'moderator@saada.com',
        password: await bcrypt.hash('Moderator123!', 12),
        role: 'moderator',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          avatar: null,
          bio: 'Content Moderator',
          phone: '',
          department: 'Computer Science',
          year: '3rd Year',
          studentId: 'MOD001',
        },
        preferences: {
          notifications: { email: true, push: true, sms: false },
          privacy: { profileVisibility: 'public', showEmail: false, showPhone: false },
        },
        stats: {
          quizzesTaken: 0,
          quizzesWon: 0,
          totalScore: 0,
          averageScore: 0,
          joinDate: new Date(),
        },
      },
      {
        name: 'Regular User',
        email: 'user@saada.com',
        password: await bcrypt.hash('User123!', 12),
        role: 'user',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          avatar: null,
          bio: 'Student Member',
          phone: '',
          department: 'Engineering',
          year: '2nd Year',
          studentId: 'USR001',
        },
        preferences: {
          notifications: { email: true, push: true, sms: false },
          privacy: { profileVisibility: 'public', showEmail: false, showPhone: false },
        },
        stats: {
          quizzesTaken: 0,
          quizzesWon: 0,
          totalScore: 0,
          averageScore: 0,
          joinDate: new Date(),
        },
      },
    ];
    
    const result = await users.insertMany(demoUsers);
    console.log(`Created ${result.insertedCount} demo users:`);
    console.log('- Admin: admin@saada.com / Admin123!');
    console.log('- Moderator: moderator@saada.com / Moderator123!');
    console.log('- User: user@saada.com / User123!');
    
  } catch (error) {
    console.error('Setup failed:', error);
  } finally {
    await client.close();
  }
}

setupAuth(); 