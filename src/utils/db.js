import axios from 'axios';
import productsData from '../data/products.json';
import projectsData from '../data/projects.json';
import servicesData from '../data/services.json';
import blogsData from '../data/blogs.json';

const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://anandelectricals.in/api';

// Create Axios Instance with timeout
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Automatically set Auth Header if token exists
api.interceptors.request.use((config) => {
  const adminUser = localStorage.getItem('anand_admin_user');
  if (adminUser) {
    try {
      const { token } = JSON.parse(adminUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error reading token from localStorage', e);
    }
  }
  return config;
});

// Cache variables for synchronous returns initialized with static fallbacks
let cache = {
  products: productsData || [],
  projects: projectsData || [],
  services: servicesData || [],
  blogs: blogsData || [],
  jobs: [],
  inquiries: [],
  applications: [],
  visitors: [],
};

export const db = {
  // 1. Boot initialization to pre-fetch all public data
  init: async () => {
    try {
      const [productsRes, projectsRes, servicesRes, blogsRes, jobsRes] = await Promise.all([
        api.get('/products'),
        api.get('/projects'),
        api.get('/services'),
        api.get('/blogs'),
        api.get('/jobs').catch(() => ({ data: [] })), // Catch if endpoint is not seeded yet
      ]);
      cache.products = productsRes.data;
      cache.projects = projectsRes.data;
      cache.services = servicesRes.data;
      cache.blogs = blogsRes.data;
      cache.jobs = jobsRes.data;
      console.log('Anand Electricals cached database initialized.');
    } catch (error) {
      console.error('Failed to initialize local data cache from API:', error);
    }
  },

  // 2. Fetch admin data (inquiries, applications) after login
  loadAdminData: async () => {
    try {
      const [inquiriesRes, applicationsRes, visitorsRes] = await Promise.all([
        api.get('/inquiries'),
        api.get('/applications'),
        api.get('/visitors'),
      ]);
      cache.inquiries = inquiriesRes.data;
      cache.applications = applicationsRes.data;
      cache.visitors = visitorsRes.data;
      console.log('Admin caches updated.');
    } catch (error) {
      console.error('Failed to fetch admin data from API:', error);
    }
  },

  // --- PRODUCTS ---
  getProducts: () => cache.products,
  saveProduct: async (product) => {
    try {
      // Optimistic update
      if (product.id) {
        const idx = cache.products.findIndex((p) => p.id === product.id);
        if (idx !== -1) cache.products[idx] = { ...cache.products[idx], ...product };
      } else {
        cache.products.push({ ...product, id: `prod-${Date.now()}` });
      }

      const res = await api.post('/products', product);
      cache.products = res.data;
      return cache.products;
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  },
  deleteProduct: async (id) => {
    try {
      cache.products = cache.products.filter((p) => p.id !== id);
      const res = await api.delete(`/products/${id}`);
      cache.products = res.data;
      return cache.products;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // --- PROJECTS ---
  getProjects: () => cache.projects,
  saveProject: async (project) => {
    try {
      if (project.id) {
        const idx = cache.projects.findIndex((p) => p.id === project.id);
        if (idx !== -1) cache.projects[idx] = { ...cache.projects[idx], ...project };
      } else {
        cache.projects.push({ ...project, id: `proj-${Date.now()}` });
      }

      const res = await api.post('/projects', project);
      cache.projects = res.data;
      return cache.projects;
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  },
  deleteProject: async (id) => {
    try {
      cache.projects = cache.projects.filter((p) => p.id !== id);
      const res = await api.delete(`/projects/${id}`);
      cache.projects = res.data;
      return cache.projects;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // --- SERVICES ---
  getServices: () => cache.services,
  saveService: async (service) => {
    try {
      if (service.id) {
        const idx = cache.services.findIndex((s) => s.id === service.id);
        if (idx !== -1) cache.services[idx] = { ...cache.services[idx], ...service };
      } else {
        cache.services.push({ ...service, id: `serv-${Date.now()}` });
      }

      const res = await api.post('/services', service);
      cache.services = res.data;
      return cache.services;
    } catch (error) {
      console.error('Error saving service:', error);
      throw error;
    }
  },
  deleteService: async (id) => {
    try {
      cache.services = cache.services.filter((s) => s.id !== id);
      const res = await api.delete(`/services/${id}`);
      cache.services = res.data;
      return cache.services;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  // --- BLOGS ---
  getBlogs: () => cache.blogs,
  saveBlog: async (blog) => {
    try {
      if (blog.id) {
        const idx = cache.blogs.findIndex((b) => b.id === blog.id);
        if (idx !== -1) cache.blogs[idx] = { ...cache.blogs[idx], ...blog };
      } else {
        cache.blogs.push({ ...blog, id: `blog-${Date.now()}` });
      }

      const res = await api.post('/blogs', blog);
      cache.blogs = res.data;
      return cache.blogs;
    } catch (error) {
      console.error('Error saving blog:', error);
      throw error;
    }
  },
  deleteBlog: async (id) => {
    try {
      cache.blogs = cache.blogs.filter((b) => b.id !== id);
      const res = await api.delete(`/blogs/${id}`);
      cache.blogs = res.data;
      return cache.blogs;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // --- INQUIRIES ---
  getInquiries: () => cache.inquiries,
  addInquiry: async (inquiry) => {
    try {
      const res = await api.post('/inquiries', inquiry);
      cache.inquiries.unshift(res.data);
      return res.data;
    } catch (error) {
      console.error('Error sending inquiry:', error);
      throw error;
    }
  },
  updateInquiryStatus: async (id, status) => {
    try {
      const idx = cache.inquiries.findIndex((i) => i.id === id);
      if (idx !== -1) cache.inquiries[idx].status = status;

      const res = await api.put(`/inquiries/${id}`, { status });
      cache.inquiries = res.data;
      return cache.inquiries;
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      throw error;
    }
  },
  deleteInquiry: async (id) => {
    try {
      cache.inquiries = cache.inquiries.filter((i) => i.id !== id);
      const res = await api.delete(`/inquiries/${id}`);
      cache.inquiries = res.data;
      return cache.inquiries;
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      throw error;
    }
  },

  // --- APPLICATIONS ---
  getApplications: () => cache.applications,
  addApplication: async (app) => {
    try {
      let res;
      // If there is an actual File object, send as Multipart Form Data
      if (app.cvFile) {
        const formData = new FormData();
        formData.append('name', app.name);
        formData.append('email', app.email);
        formData.append('phone', app.phone);
        formData.append('jobTitle', app.jobTitle);
        formData.append('resume', app.cvFile);
        
        res = await api.post('/applications', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/applications', app);
      }
      cache.applications.unshift(res.data);
      return res.data;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },
  updateApplicationStatus: async (id, status) => {
    try {
      const idx = cache.applications.findIndex((a) => a.id === id);
      if (idx !== -1) cache.applications[idx].status = status;

      const res = await api.put(`/applications/${id}`, { status });
      cache.applications = res.data;
      return cache.applications;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },
  deleteApplication: async (id) => {
    try {
      cache.applications = cache.applications.filter((a) => a.id !== id);
      const res = await api.delete(`/applications/${id}`);
      cache.applications = res.data;
      return cache.applications;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },
  downloadApplicationCV: (cvName) => {
    // Open standard file download endpoint protected by backend static serving or API download
    const adminUser = localStorage.getItem('anand_admin_user');
    let token = '';
    if (adminUser) {
      token = JSON.parse(adminUser).token;
    }
    // Return complete URL for download with token appended as query param if needed,
    // or just let frontend download using axios
    return `${API_URL}/applications/download/${cvName}?token=${token}`;
  },

  // --- JOBS ---
  getJobs: () => cache.jobs,
  saveJob: async (job) => {
    try {
      if (job.id) {
        const idx = cache.jobs.findIndex((j) => j.id === job.id);
        if (idx !== -1) cache.jobs[idx] = { ...cache.jobs[idx], ...job };
      } else {
        cache.jobs.push({ ...job, id: `job-${Date.now()}` });
      }

      const res = await api.post('/jobs', job);
      cache.jobs = res.data;
      return cache.jobs;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },
  deleteJob: async (id) => {
    try {
      cache.jobs = cache.jobs.filter((j) => j.id !== id);
      const res = await api.delete(`/jobs/${id}`);
      cache.jobs = res.data;
      return cache.jobs;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  // --- VISITORS ---
  getVisitors: () => cache.visitors,
  logPageVisit: async (page, device) => {
    try {
      const res = await api.post('/visitors', { page, device });
      return res.data;
    } catch (error) {
      console.error('Error logging page visit:', error);
    }
  },

  // --- AUTH & LOGIN ---
  getUsers: () => [], // No longer used client-side for security
  login: async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      if (res.data && res.data.token) {
        localStorage.setItem('anand_admin_user', JSON.stringify(res.data));
        return res.data;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('anand_admin_user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },
  logout: () => {
    localStorage.removeItem('anand_admin_user');
    cache.inquiries = [];
    cache.applications = [];
    cache.visitors = [];
  },
};
