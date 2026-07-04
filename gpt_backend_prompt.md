# PROMPT FOR GPT: BUILD A SECURE MERN BACKEND FOR ANAND ELECTRICALS

Copy and paste the entire prompt below into GPT (like ChatGPT or Claude) to get the complete backend code and frontend integration steps.

---

```markdown
I have a React + Vite frontend application for an industrial electrical contracting and panel manufacturing business named "Anand Electricals". 

Currently, the frontend simulates a database using `localStorage` and a local JSON data cache inside a utility file `src/utils/db.js`. I want to replace this mock database with a real, secure backend using **Node.js, Express.js, MongoDB (Mongoose)**, and **JWT (JSON Web Token)** authentication for the admin panel.

Please write the complete backend code and provide the exact steps and code updates to connect my frontend React application to the new backend.

Here is the context, current data schemas, and the files in my project.

---

### 1. PROJECT FILES & DATA STRUCTURES

#### A. Data Schemas (currently in JSON files under `src/data/`)

1. **Blogs (`blogs.json`)**:
   - Fields: `id` (String), `slug` (String), `title` (String), `summary` (String), `content` (String), `author` (String), `date` (String/Date), `readTime` (String)

2. **Products (`products.json`)**:
   - Fields: `id` (String), `slug` (String), `name` (String), `shortDescription` (String), `description` (String), `specs` (Array of { name: String, value: String }), `features` (Array of Strings), `applications` (Array of Strings), `catalogName` (String), `image` (String)

3. **Projects (`projects.json`)**:
   - Fields: `id` (String), `slug` (String), `title` (String), `clientName` (String), `location` (String), `scope` (String), `completionYear` (String), `challenges` (String), `solutions` (String), `results` (String), `image` (String)

4. **Services (`services.json`)**:
   - Fields: `id` (String), `slug` (String), `title` (String), `description` (String), `features` (Array of Strings)

#### B. Simulated Admin Collections (currently managed in `src/utils/db.js` using localStorage)

1. **Inquiries**:
   - Fields: `id` (String), `name` (String), `company` (String), `email` (String), `phone` (String), `service` (String), `message` (String), `status` ('Pending', 'Contacted', 'Resolved'), `date` (ISO Date string)

2. **Applications** (Job submissions):
   - Fields: `id` (String), `name` (String), `email` (String), `phone` (String), `jobTitle` (String), `status` ('Pending', 'Shortlisted', 'Rejected', etc.), `date` (ISO Date string), `cvName` (String - filename of the resume PDF)

3. **Jobs** (Job postings):
   - Fields: `id` (String), `title` (String), `location` (String), `type` (String), `reqs` (String)

4. **Users** (Admin user for login):
   - Fields: `id` (String), `username` (String), `password` (String - needs to be hashed with bcrypt in the real backend), `name` (String), `role` (String, default: 'Admin')

---

### 2. BACKEND REQUIREMENTS

I need you to write the code for the backend. Please organize it into the following structure:
- `server.js` - Server entry point.
- `.env` - Environment variables configuration.
- `config/db.js` - MongoDB connection using Mongoose.
- `models/` - Mongoose Models for all schemas (User, Product, Project, Service, Blog, Inquiry, Application, Job).
- `middleware/auth.js` - JWT validation middleware to protect Admin routes.
- `routes/` - Express routers:
  - `auth.js` - Authentication routes (`/api/auth/login`, `/api/auth/me`).
  - `products.js`, `projects.js`, `services.js`, `blogs.js`, `jobs.js` - Public read access (`GET`), protected write access (`POST`, `PUT`, `DELETE`).
  - `inquiries.js` - Public submission (`POST`), protected read/write/delete (`GET`, `PUT`, `DELETE`).
  - `applications.js` - Public submission with resume file upload support (`POST` using `multer`), protected read/write/delete.

Please provide complete code files for the backend, incorporating:
1. Password hashing using `bcryptjs` for the Admin user.
2. Standard CORS configurations.
3. Express routes that match the API structures.
4. Error handling middleware.
5. A database seeding script (`scripts/seed.js`) to import my existing JSON files into MongoDB.

---

### 3. FRONTEND INTEGRATION REQUIREMENTS

Because my frontend pages currently call the mock `db` utility synchronously (e.g. `const productsData = db.getProducts();` at the top level of `Products.jsx`), changing the utility to make API calls will return Promises. I need:

1. **An Updated `src/utils/db.js`**:
   - Rewritten using `axios` to make HTTP requests to the backend (`http://localhost:5000/api`).
   - Standardizing JWT authentication. Save the token to `localStorage` on login, automatically attach the `Authorization: Bearer <token>` header to Axios requests if logged in, and handle token expiration/logout.
   - Providing helper functions for all endpoints (`getProducts()`, `saveProduct()`, `deleteProduct()`, etc.) matching the current API signature but returning promises.

2. **Frontend React File Refactoring Guide**:
   - Provide the code modifications for my pages so they fetch data asynchronously using `useState` and `useEffect`.
   - Specifically show how to update:
     - `src/components/layout/Navbar.jsx` (which does `const productsData = db.getProducts();` at the module top level)
     - `src/components/layout/Footer.jsx` (which does `const productsData = db.getProducts();` at the module top level)
     - `src/pages/Home.jsx` (calls `db.getProducts()`, `db.getProjects()`, `db.getServices()`)
     - `src/pages/Products.jsx` and `src/pages/ProductDetails.jsx`
     - `src/pages/Projects.jsx` and `src/pages/ProjectDetails.jsx`
     - `src/pages/Services.jsx`
     - `src/pages/Blogs.jsx` and `src/pages/BlogDetails.jsx`
     - `src/pages/Careers.jsx` (needs file upload for the resume file field!)
     - `src/components/sections/ContactForm.jsx`
     - `src/pages/Admin.jsx` (this is a big file, show how login/logout, loading, saving and deleting lists should handle the asynchronous promises returned by the new `db.js`).

Let's make sure the backend is robust, clean, and ready to deploy on systems like Render, Heroku, or digital ocean VPS, using a local or cloud Atlas MongoDB database.
```

---

## Guide on How to Use the Generated Code

Once GPT outputs the code:

1. **Initialize the Backend Project**:
   Create a new folder next to your frontend project named `backend` (or inside the root if you want a monorepo).
   Initialize npm and install backend dependencies:
   ```bash
   mkdir backend
   cd backend
   npm init -y
   npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer
   npm install --save-dev nodemon
   ```

2. **Create the Folder Structure**:
   Set up the following directories inside `backend/`:
   ```text
   backend/
   ├── config/
   │   └── db.js
   ├── models/
   │   ├── User.js
   │   ├── Product.js
   │   ├── Project.js
   │   ├── Service.js
   │   ├── Blog.js
   │   ├── Inquiry.js
   │   ├── Application.js
   │   └── Job.js
   ├── routes/
   │   ├── auth.js
   │   ├── products.js
   │   ├── projects.js
   │   ├── services.js
   │   ├── blogs.js
   │   ├── inquiries.js
   │   ├── applications.js
   │   └── jobs.js
   ├── middleware/
   │   └── auth.js
   ├── scripts/
   │   └── seed.js
   ├── uploads/          <-- Create this folder for uploads (resumes, etc.)
   ├── .env
   └── server.js
   ```

3. **Configure Environment Variables**:
   In your `backend/.env` file, configure your variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/anand_db  # or your MongoDB Atlas URI
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

4. **Seed the Database**:
   Place your frontend JSON data files into `backend/data/` (or copy them over) and run the seed script created by GPT to populate MongoDB with initial data.
   ```bash
   node scripts/seed.js
   ```

5. **Update and Run Frontend**:
   Replace the contents of `src/utils/db.js` with the Axios version provided by GPT. Make sure to refactor the React components/pages using the guide below to fetch data asynchronously inside `useEffect`. Run both servers concurrently:
   - Backend: `npm run dev` (running on port 5000)
   - Frontend: `npm run dev` (running on port 5173 or default)
