require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const connectDB = require('../config/db');

// Models
const User = require('../models/User');
const Product = require('../models/Product');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Blog = require('../models/Blog');
const Inquiry = require('../models/Inquiry');
const Application = require('../models/Application');
const Job = require('../models/Job');

const seedData = async () => {
  try {
    await connectDB();

    // 1. Clear Existing Data
    await User.deleteMany();
    await Product.deleteMany();
    await Project.deleteMany();
    await Service.deleteMany();
    await Blog.deleteMany();
    await Inquiry.deleteMany();
    await Application.deleteMany();
    await Job.deleteMany();

    console.log('Database cleared.');

    // 2. Load JSON files
    const blogsPath = path.join(__dirname, '../../src/data/blogs.json');
    const productsPath = path.join(__dirname, '../../src/data/products.json');
    const projectsPath = path.join(__dirname, '../../src/data/projects.json');
    const servicesPath = path.join(__dirname, '../../src/data/services.json');

    const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf-8'));
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'));
    const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

    // 3. Seed Users
    const defaultUser = new User({
      username: 'admin',
      password: 'password123', // Will be hashed by userSchema.pre('save')
      name: 'Super Admin',
      role: 'Admin'
    });
    await defaultUser.save();
    console.log('Seeded default admin user (admin / password123)');

    // 4. Seed Products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} Products`);

    // 5. Seed Projects
    await Project.insertMany(projects);
    console.log(`Seeded ${projects.length} Projects`);

    // 6. Seed Services
    await Service.insertMany(services);
    console.log(`Seeded ${services.length} Services`);

    // 7. Seed Blogs
    await Blog.insertMany(blogs);
    console.log(`Seeded ${blogs.length} Blogs`);

    // 8. Seed Initial Jobs (from db.js)
    const initialJobs = [
      {
        id: 'senior-commissioning',
        title: 'Senior Electrical Commissioning Engineer',
        location: 'Jaipur (On-site travel)',
        type: 'Full-Time',
        reqs: 'B.Tech/Diploma in Electrical Engineering with 4+ years validating HT substations or MCC panel commissioning.'
      },
      {
        id: 'estimation-proposals',
        title: 'Estimation & Proposals Engineer',
        location: 'Jaipur HQ',
        type: 'Full-Time',
        reqs: '2+ years reading electrical drawings and preparing BOM bills of materials for industrial tender bids.'
      }
    ];
    await Job.insertMany(initialJobs);
    console.log(`Seeded ${initialJobs.length} Jobs`);

    // 9. Seed Initial Inquiries
    const initialInquiries = [
      {
        id: 'inq-1',
        name: 'Rajesh Kumar',
        company: 'Tata Projects Ltd',
        email: 'rajesh@tataprojects.com',
        phone: '+91 98765 43210',
        service: 'PLC Control Panels',
        message: 'Need estimation for a water treatment plant in Udaipur. Power specification: 415V AC, 3-phase, 50Hz. Load capacity: 150 kW.',
        status: 'Pending',
        date: new Date('2026-06-25T14:30:00.000Z')
      },
      {
        id: 'inq-2',
        name: 'Suresh Patel',
        company: 'Adani Solar',
        email: 'suresh.p@adani.com',
        phone: '+91 91234 56789',
        service: 'APFC Panels',
        message: 'Looking for a quotation of 350 KVAR APFC Panel with detuned reactors. Power factor needs to be maintained above 0.98. RIICO industrial area, Jaipur.',
        status: 'Contacted',
        date: new Date('2026-06-26T09:15:00.000Z')
      },
      {
        id: 'inq-3',
        name: 'Vikram Singh',
        company: 'Jaipur Rugs Co',
        email: 'vikram.singh@jaipurrugs.com',
        phone: '+91 99887 76655',
        service: 'Motor Control Centers (MCC)',
        message: 'We are expanding our spinning unit and need 2 motor control centers. 12 motor outputs (5.5 kW - 22 kW) with smart soft starters.',
        status: 'Resolved',
        date: new Date('2026-06-24T11:00:00.000Z')
      }
    ];
    await Inquiry.insertMany(initialInquiries);
    console.log(`Seeded ${initialInquiries.length} Inquiries`);

    // 10. Seed Initial Applications
    const initialApplications = [
      {
        id: 'app-1',
        name: 'Rahul Verma',
        email: 'rahul.verma@outlook.com',
        phone: '+91 88776 65544',
        jobTitle: 'Senior Electrical Commissioning Engineer',
        status: 'Shortlisted',
        date: new Date('2026-06-25T16:45:00.000Z'),
        cvName: 'rahul_verma_resume.pdf'
      },
      {
        id: 'app-2',
        name: 'Neha Sharma',
        email: 'neha.sharma@gmail.com',
        phone: '+91 77665 54433',
        jobTitle: 'Estimation & Proposals Engineer',
        status: 'Pending',
        date: new Date('2026-06-26T10:20:00.000Z'),
        cvName: 'neha_sharma_cv.pdf'
      }
    ];
    await Application.insertMany(initialApplications);
    console.log(`Seeded ${initialApplications.length} Applications`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error Seeding Data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
