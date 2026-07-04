const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Blog = require('../models/Blog');
const Job = require('../models/Job');
const Inquiry = require('../models/Inquiry');
const Application = require('../models/Application');
const Visitor = require('../models/Visitor');

const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has data. Skipping auto-seed.');
      return;
    }

    console.log('Database is empty. Seeding initial data dynamically...');

    // Load JSON files
    const blogsPath = path.join(__dirname, '../../src/data/blogs.json');
    const productsPath = path.join(__dirname, '../../src/data/products.json');
    const projectsPath = path.join(__dirname, '../../src/data/projects.json');
    const servicesPath = path.join(__dirname, '../../src/data/services.json');

    const blogs = fs.existsSync(blogsPath) ? JSON.parse(fs.readFileSync(blogsPath, 'utf-8')) : [];
    const products = fs.existsSync(productsPath) ? JSON.parse(fs.readFileSync(productsPath, 'utf-8')) : [];
    const projects = fs.existsSync(projectsPath) ? JSON.parse(fs.readFileSync(projectsPath, 'utf-8')) : [];
    const services = fs.existsSync(servicesPath) ? JSON.parse(fs.readFileSync(servicesPath, 'utf-8')) : [];

    // Seed admin
    const defaultUser = new User({
      username: 'admin',
      password: 'electrical@2026', // Will be hashed by pre-save middleware
      name: 'Super Admin',
      role: 'Admin'
    });
    await defaultUser.save();
    console.log('Seeded default admin user (admin / electrical@2026)');

    if (products.length) {
      await Product.insertMany(products);
      console.log(`Auto-seeded ${products.length} Products`);
    }
    if (projects.length) {
      await Project.insertMany(projects);
      console.log(`Auto-seeded ${projects.length} Projects`);
    }
    if (services.length) {
      await Service.insertMany(services);
      console.log(`Auto-seeded ${services.length} Services`);
    }
    if (blogs.length) {
      await Blog.insertMany(blogs);
      console.log(`Auto-seeded ${blogs.length} Blogs`);
    }

    // Initial Jobs
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
    console.log('Auto-seeded 2 Jobs');

    // Initial Inquiries (none by default, starts empty)

    // Initial Applications
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
      }
    ];
    await Application.insertMany(initialApplications);
    console.log('Auto-seeded 1 Application');

    // Initial Visitors
    const initialVisitors = [
      { ip: '192.168.1.45', page: '/', device: 'Mobile', date: new Date(Date.now() - 3600000 * 2) },
      { ip: '103.45.12.98', page: '/products', device: 'Desktop', date: new Date(Date.now() - 3600000 * 4) },
      { ip: '45.112.56.23', page: '/services', device: 'Desktop', date: new Date(Date.now() - 3600000 * 6) },
      { ip: '157.24.89.112', page: '/projects', device: 'Mobile', date: new Date(Date.now() - 3600000 * 8) },
      { ip: '103.45.12.98', page: '/contact', device: 'Desktop', date: new Date(Date.now() - 3600000 * 10) }
    ];
    await Visitor.insertMany(initialVisitors);
    console.log('Auto-seeded 5 Visitors');

    console.log('Auto-seeding completed successfully!');
  } catch (err) {
    console.error('Auto-seeding failed:', err.message);
  }
};

module.exports = autoSeed;
