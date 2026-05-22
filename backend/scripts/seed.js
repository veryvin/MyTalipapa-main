import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Models
import User from '../models/User.js';
import Stall from '../models/Stall.js';
import Application from '../models/Application.js';
import Payment from '../models/Payment.js';
import Maintenance from '../models/Maintenance.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';

// Load config
dotenv.config();

const INITIAL_USERS = [
  { name: 'Juan Dela Cruz', username: 'operator', email: 'operator@talipapa.com', phone: '0912 345 6789', role: 'operator', password: '1234', address: 'Pandacan, Manila', status: 'active', stallId: 'D-01' },
  { name: 'Maria Santos', username: 'renter', email: 'maria@email.com', phone: '0917 234 5678', role: 'renter', password: '1234', address: 'Pandacan, Manila', status: 'active', stallId: 'A-12' },
  { name: 'Pedro Reyes', username: 'pedro', email: 'pedro@email.com', phone: '0918 345 6789', role: 'renter', password: '1234', address: 'Sta. Mesa, Manila', status: 'active', stallId: 'B-05' },
  { name: 'Ana Garcia', username: 'ana', email: 'ana@email.com', phone: '0919 456 7890', role: 'renter', password: '1234', address: 'Sampaloc, Manila', status: 'active', stallId: 'D-10' },
  { name: 'Carlos Mendoza', username: 'carlos', email: 'carlos@email.com', phone: '0920 567 8901', role: 'renter', password: '1234', address: 'Tondo, Manila', status: 'active', stallId: null },
  { name: 'Liza Mendoza', username: 'liza', email: 'liza@email.com', phone: '0921 678 9012', role: 'renter', password: '1234', address: 'Ermita, Manila', status: 'active', stallId: null },
];

const INITIAL_STALLS = [
  { _id: 'A-01', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'occupied', renter: 'Maria Santos', desc: 'Prime vegetable stall near entrance' },
  { _id: 'A-02', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'available', renter: null, desc: 'Great location with morning sun' },
  { _id: 'A-03', section: 'vegetables', size: '2m×2m', rent: 2000, status: 'available', renter: null, desc: 'Corner stall, high visibility' },
  { _id: 'A-04', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'reserved', renter: 'Ana Garcia', desc: 'Standard vegetable stall' },
  { _id: 'A-05', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'available', renter: null, desc: 'Near main pathway' },
  { _id: 'A-12', section: 'vegetables', size: '3m×2m', rent: 2500, status: 'occupied', renter: 'Maria Santos', desc: 'Stall for vegetables and fresh produce' },
  { _id: 'B-01', section: 'fish', size: '3m×2m', rent: 2800, status: 'available', renter: null, desc: 'Fish section with drainage' },
  { _id: 'B-02', section: 'fish', size: '3m×3m', rent: 3200, status: 'occupied', renter: 'Pedro Reyes', desc: 'Large fish stall' },
  { _id: 'B-05', section: 'fish', size: '3m×2m', rent: 2800, status: 'occupied', renter: 'Pedro Reyes', desc: 'Fish retail stall' },
  { _id: 'B-06', section: 'fish', size: '2m×2m', rent: 2300, status: 'available', renter: null, desc: 'Small fish stall' },
  { _id: 'C-01', section: 'meat', size: '3m×3m', rent: 3000, status: 'available', renter: null, desc: 'Meat section stall' },
  { _id: 'C-08', section: 'meat', size: '3m×2m', rent: 2600, status: 'available', renter: null, desc: 'Meat vendor stall' },
  { _id: 'D-01', section: 'dry', size: '3m×2m', rent: 2200, status: 'occupied', renter: 'Juan Dela Cruz', desc: 'Dry goods storage stall' },
  { _id: 'D-10', section: 'dry', size: '5m×3m', rent: 4500, status: 'occupied', renter: 'Ana Garcia', desc: 'Large dry goods stall' },
  { _id: 'D-11', section: 'dry', size: '3m×2m', rent: 2200, status: 'reserved', renter: 'Juan Dela Cruz', desc: 'Dry goods near exit' },
  { _id: 'E-01', section: 'snacks', size: '2m×2m', rent: 1800, status: 'available', renter: null, desc: 'Snacks and drinks stall' },
  { _id: 'E-03', section: 'snacks', size: '2m×2m', rent: 1800, status: 'available', renter: null, desc: 'Street food stall' },
  { _id: 'E-07', section: 'snacks', size: '3m×2m', rent: 2100, status: 'reserved', renter: null, desc: 'Cooked food stall' },
];

const INITIAL_APPLICATIONS = [
  { applicant: 'Ana Garcia', stallId: 'A-04', biz: 'Vegetable Retail', date: new Date('May 14, 2026'), status: 'pending', msg: 'I want to sell fresh vegetables from my farm' },
  { applicant: 'Maria Santos', stallId: 'A-12', biz: 'Vegetable Retail', date: new Date('May 15, 2026'), status: 'approved', msg: 'Experienced vegetable vendor' },
  { applicant: 'Pedro Reyes', stallId: 'B-05', biz: 'Fish Retail', date: new Date('May 15, 2026'), status: 'approved', msg: 'Fish vendor with 5 years experience' },
  { applicant: 'Carlos Mendoza', stallId: 'C-08', biz: 'Meat Vendor', date: new Date('May 16, 2026'), status: 'pending', msg: 'Certified meat vendor' },
  { applicant: 'Liza Mendoza', stallId: 'A-02', biz: 'Vegetable Retail', date: new Date('May 13, 2026'), status: 'rejected', msg: 'Small vegetable stand' },
];

const INITIAL_PAYMENTS = [
  { renter: 'Maria Santos', stallId: 'A-12', amount: 2500, due: new Date('Jun 5, 2026'), paid: new Date('May 4, 2026'), status: 'paid', month: 'May 2026' },
  { renter: 'Maria Santos', stallId: 'A-12', amount: 2500, due: new Date('May 5, 2026'), paid: new Date('Apr 5, 2026'), status: 'paid', month: 'Apr 2026' },
  { renter: 'Pedro Reyes', stallId: 'B-05', amount: 2800, due: new Date('Jun 5, 2026'), paid: null, status: 'unpaid', month: 'May 2026' },
  { renter: 'Ana Garcia', stallId: 'D-10', amount: 4500, due: new Date('Jun 5, 2026'), paid: new Date('May 3, 2026'), status: 'paid', month: 'May 2026' },
  { renter: 'Carlos Mendoza', stallId: 'D-11', amount: 2200, due: new Date('Jun 5, 2026'), paid: null, status: 'unpaid', month: 'May 2026' },
];

const INITIAL_MAINTENANCE = [
  { issue: 'Broken Light', location: 'Aisle 3', reporter: 'Juan Dela Cruz', priority: 'high', status: 'pending', date: new Date('May 15, 2026'), desc: 'The lights are out near the entrance corridor.' },
  { issue: 'Water Leak', location: 'CB Section', reporter: 'Pedro Reyes', priority: 'medium', status: 'in-progress', date: new Date('May 14, 2026'), desc: 'Pipes are dripping below the display sink.' },
  { issue: 'Damaged Floor', location: 'In front of D-05', reporter: 'Ana Garcia', priority: 'low', status: 'pending', date: new Date('May 14, 2026'), desc: 'Cracks in the concrete are presenting a small tripping hazard.' },
  { issue: 'Clogged Drain', location: 'Fish Section', reporter: 'Maria Santos', priority: 'medium', status: 'resolved', date: new Date('May 12, 2026'), desc: 'Main drainage grate is blocked by debris.' },
  { issue: 'Broken Signage', location: 'Entrance', reporter: 'Carlos Mendoza', priority: 'low', status: 'resolved', date: new Date('May 10, 2026'), desc: 'Directory board has fallen off its hook.' },
];

const INITIAL_ANNOUNCEMENTS = [
  { title: 'Market Cleanup Drive', category: 'general', priority: 'normal', date: new Date('May 15, 2026'), msg: 'Join us on May 20, 2026 for the monthly market cleanup drive. All vendors are required to participate.' },
  { title: 'New Rental Policy', category: 'reminder', priority: 'normal', date: new Date('May 10, 2026'), msg: 'Please be informed of the new rental policy effective June 1, 2026. Visit the admin office for details.' },
  { title: 'Water Interruption', category: 'emergency', priority: 'high', date: new Date('May 8, 2026'), msg: 'Water supply will be interrupted on May 18, 2026 from 8:00 AM - 12:00 PM. Please prepare accordingly.' },
  { title: 'Fire Safety Reminder', category: 'reminder', priority: 'normal', date: new Date('May 3, 2026'), msg: 'Please keep your area clean and be mindful of fire safety. Ensure all electrical connections are properly insulated.' },
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environmental variable not found in .env file.');
    }

    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Wipe current collections
    console.log('Cleaning existing records from database collections...');
    await User.deleteMany({});
    await Stall.deleteMany({});
    await Application.deleteMany({});
    await Payment.deleteMany({});
    await Maintenance.deleteMany({});
    await Announcement.deleteMany({});
    await Notification.deleteMany({});
    console.log('Database wiped clean.');

    // 2. Insert Users (we must pre-hash passwords or use save hooks, but direct insertMany bypasses pre-hooks unless done in loop)
    console.log('Seeding Users...');
    const usersToInsert = [];
    const salt = await bcrypt.genSalt(10);

    for (const u of INITIAL_USERS) {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      usersToInsert.push({
        ...u,
        password: hashedPassword,
      });
    }
    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`Seeded ${insertedUsers.length} Users successfully.`);

    // Map names to User ObjectIds for relational references
    const userMap = {};
    insertedUsers.forEach((user) => {
      userMap[user.name] = user._id;
    });

    // 3. Seed Stalls
    console.log('Seeding Stalls...');
    const insertedStalls = await Stall.insertMany(INITIAL_STALLS);
    console.log(`Seeded ${insertedStalls.length} Stalls successfully.`);

    // 4. Seed Applications (mapping applicant name to userId)
    console.log('Seeding Applications...');
    const applicationsToInsert = INITIAL_APPLICATIONS.map((app) => {
      const uId = userMap[app.applicant];
      if (!uId) {
        console.warn(`Warning: User ${app.applicant} not found in database. Seeder fallback to Juan Dela Cruz.`);
      }
      return {
        ...app,
        userId: uId || insertedUsers[0]._id,
      };
    });
    const insertedApplications = await Application.insertMany(applicationsToInsert);
    console.log(`Seeded ${insertedApplications.length} Applications successfully.`);

    // 5. Seed Payments
    console.log('Seeding Payments...');
    const insertedPayments = await Payment.insertMany(INITIAL_PAYMENTS);
    console.log(`Seeded ${insertedPayments.length} Payments successfully.`);

    // 6. Seed Maintenance
    console.log('Seeding Maintenance tickets...');
    const insertedMaintenance = await Maintenance.insertMany(INITIAL_MAINTENANCE);
    console.log(`Seeded ${insertedMaintenance.length} Maintenance tickets successfully.`);

    // 7. Seed Announcements
    console.log('Seeding Announcements...');
    const insertedAnnouncements = await Announcement.insertMany(INITIAL_ANNOUNCEMENTS);
    console.log(`Seeded ${insertedAnnouncements.length} Announcements successfully.`);

    // 8. Seed Notifications (dynamic dates)
    console.log('Seeding Notifications...');
    const now = new Date();
    
    // Create notifications for renter 'Maria Santos'
    const mariaId = userMap['Maria Santos'];
    const initialNotifications = [
      {
        userId: mariaId || null,
        icon: '📋',
        bg: '#e8f5e9',
        title: 'Application Approved',
        desc: 'Your application for Stall A-12 has been approved!',
        read: false,
        time: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        userId: null, // global
        icon: '📢',
        bg: '#fff3cd',
        title: 'New Announcement',
        desc: 'Market Cleanup Drive on May 20, 2026',
        read: false,
        time: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        userId: mariaId || null,
        icon: '💳',
        bg: '#e3f2fd',
        title: 'Payment Due',
        desc: 'Your monthly rent for Stall A-12 is due on June 5',
        read: true,
        time: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: mariaId || null,
        icon: '🔧',
        bg: '#fce4ec',
        title: 'Maintenance Update',
        desc: 'Your maintenance request has been received',
        read: true,
        time: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ];

    const insertedNotifications = await Notification.insertMany(initialNotifications);
    console.log(`Seeded ${insertedNotifications.length} Notifications successfully.`);

    console.log('Database Seeding Completed Successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error(`Database Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
