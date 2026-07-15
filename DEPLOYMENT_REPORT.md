# Deployment Report: Anand Electricals

This document details the issues resolved during the troubleshooting and deployment of the Anand Electricals Vite/React application on the server.

---

## 1. Root Cause Analysis

### Issue A: "Coming Soon" Page Overriding React App
* **Cause:** By default, Apache web servers prioritize `index.php` over `index.html` (due to standard `DirectoryIndex` settings). 
* **Details:** The directory root `/public_html` contained both `index.html` (the React app) and a default `index.php` (HostGator/cPanel "Coming Soon" page). The server served `index.php` first, preventing visitors from seeing the React app.

### Issue B: Blank White Page on React App Mount
* **Cause 1 - Hanging API Calls:** The frontend React code in `src/utils/db.js` executed `db.init()`, which performed multiple asynchronous `api.get` requests in a `Promise.all` call without any timeout configured.
* **Cause 2 - Database Port Block (Firewall):** Shared hosting environments (such as HostGator cPanel) block outbound TCP connections on non-standard ports (like port `27017` used by MongoDB Atlas) by default.
* **Cause 3 - Process Crash Loop:** On connection failure to MongoDB Atlas, the backend config called `process.exit(1)`. Passenger kept spawning Node, which kept trying to connect, timing out, and exit-crashing. Because Passenger was crash-looping and the frontend Axios instance had no timeout, the API calls hung indefinitely, preventing the React application from mounting and causing a blank screen.
* **Cause 4 - Startup File Entrypoint Mismatch:** The default cPanel Node startup file `app.js` only did `require('./server.js')` but did not export the Express application module (`module.exports = app`), causing Passenger to hang while trying to route incoming HTTP traffic.

---

## 2. Changes Made & Files Modified

### Frontend Changes
* **[`src/utils/db.js`](file:///C:/Users/yashi/Documents/deepesh%20rk/ANAND/src/utils/db.js):**
  1. Configured a **5-second timeout** on the Axios instance (`timeout: 5000`) so that API queries fail fast instead of hanging indefinitely.
  2. Imported local static JSON files (`products.json`, `projects.json`, etc.) from the [`src/data/`](file:///C:/Users/yashi/Documents/deepesh%20rk/ANAND/src/data) directory to initialize the application cache.
  3. Wrapped `db.init()`'s API calls so that if they fail or time out, the cache retains the static JSON data, allowing the page to mount and render default content successfully.

### Backend Changes
* **[`backend/server.js`](file:///C:/Users/yashi/Documents/deepesh%20rk/ANAND/backend/server.js):**
  1. Commented out the `connectDB()` call on startup. This stops Node from attempting to reach MongoDB Atlas on startup and avoids Passenger process crashes.
* **[`backend/config/db.js`](file:///C:/Users/yashi/Documents/deepesh%20rk/ANAND/backend/config/db.js):**
  1. Disabled command buffering globally (`mongoose.set('bufferCommands', false)`) so that queries fail immediately instead of hanging if there is no database connection.
  2. Replaced `process.exit(1)` with a warning log and graceful return so that connection failures do not crash-loop Passenger.
* **[`app.js`](file:///C:/Users/yashi/Documents/deepesh%20rk/ANAND/app.js) (Created locally and uploaded to `/backend/backend/app.js`):**
  1. Updated the entrypoint script to correctly export the Express app for Passenger (`const app = require('./server.js'); module.exports = app;`).

---

## 3. Files Uploaded to Server

The following updated files were uploaded to the FTP server:
* `/public_html/index.html` (Points to the new JS build)
* `/public_html/assets/index-CGv9MLnf.js` (The compiled Vite React JS bundle)
* `/public_html/assets/index-D2haIx-g.css` (The compiled css stylesheet)
* `/backend/backend/server.js` (Backend entrypoint with disabled connection block)
* `/backend/backend/config/db.js` (Database configuration without exit-crashes and command buffering)
* `/backend/backend/app.js` (Startup file exporting the Express app)

---

## 4. Verification Performed

1. **Asset Load Verification:** Verified that the main HTML file (`index.html`) and the new JS/CSS bundles returned a status of **HTTP 200** immediately (response time <0.2 seconds).
2. **API Timeout Gracefulness:** Verified that `/api/products` and the root API routes do not cause the frontend to freeze. The frontend Axios timeout triggers after 5 seconds, mounting the homepage successfully.
3. **Homepage Render Verification:** Verified that the homepage renders correctly with products, projects, services, and blogs displayed using the static fallback JSON data.

---

## 5. Future Recommendations

1. **Contact Form / Admin Database:** 
   * Since port `27017` is blocked by the host firewall, any forms or admin modifications will save locally inside `/backend/backend/data/*.json` files rather than MongoDB Atlas. 
   * If you require database connectivity to MongoDB Atlas in the future, you should contact HostGator/cPanel support to **open outbound TCP port 27017** on the firewall, or switch to an HTTP-based database service (like Firebase, Supabase, or MongoDB Atlas Data API) which operates over standard HTTP port `443` and bypasses hosting firewall blocks.
2. **Obsolete Chunks Cleanup:** 
   * When rebuilding the React app, Vite creates unique JS filenames. Regularly clean up `/public_html/assets/` to delete obsolete `index-*.js` files and save disk space.
