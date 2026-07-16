import ftplib
import sys
import os
import io

host = 'anandelectricals.in'
user = 'anaelectals'
password = r'065p(D4yw2[Tc5Rh'

files_to_upload = [
    # Config files
    ('backend/config/db.js', 'backend/backend/config/db.js'),
    ('backend/config/fallbackDB.js', 'backend/backend/config/fallbackDB.js'),
    ('backend/config/dbHelper.js', 'backend/backend/config/dbHelper.js'),
    
    # Middleware
    ('backend/middleware/auth.js', 'backend/backend/middleware/auth.js'),
    
    # Routes
    ('backend/routes/auth.js', 'backend/backend/routes/auth.js'),
    ('backend/routes/products.js', 'backend/backend/routes/products.js'),
    ('backend/routes/projects.js', 'backend/backend/routes/projects.js'),
    ('backend/routes/services.js', 'backend/backend/routes/services.js'),
    ('backend/routes/blogs.js', 'backend/backend/routes/blogs.js'),
    ('backend/routes/jobs.js', 'backend/backend/routes/jobs.js'),
    ('backend/routes/inquiries.js', 'backend/backend/routes/inquiries.js'),
    ('backend/routes/applications.js', 'backend/backend/routes/applications.js'),
    ('backend/routes/visitors.js', 'backend/backend/routes/visitors.js'),
    
    # Fallback Data
    ('backend/data/blogs.json', 'backend/backend/data/blogs.json'),
    ('backend/data/products.json', 'backend/backend/data/products.json'),
    ('backend/data/projects.json', 'backend/backend/data/projects.json'),
    ('backend/data/services.json', 'backend/backend/data/services.json'),
    ('backend/data/jobs.json', 'backend/backend/data/jobs.json'),
    ('backend/data/applications.json', 'backend/backend/data/applications.json'),
    ('backend/data/inquiries.json', 'backend/backend/data/inquiries.json'),
    ('backend/data/visitors.json', 'backend/backend/data/visitors.json'),
    ('backend/data/users.json', 'backend/backend/data/users.json')
]

try:
    print(f"Connecting to FTP at {host}...")
    ftp = ftplib.FTP(host, timeout=20)
    ftp.login(user, password)
    print("Logged in successfully!")
    
    # Make sure backend/backend/data directory exists
    print("Ensuring backend/backend/data directory exists...")
    try:
        ftp.cwd('backend/backend/data')
    except:
        ftp.cwd('backend/backend')
        ftp.mkd('data')
        print("Created data directory.")
        
    # Go back to root
    ftp.cwd('/')
    
    # Upload files
    for local, remote in files_to_upload:
        if not os.path.exists(local):
            print(f"Warning: Local file {local} does not exist!")
            continue
            
        print(f"Uploading {local} -> {remote}...")
        with open(local, 'rb') as f:
            ftp.storbinary(f'STOR {remote}', f)
            
    # Touch restart.txt to restart Node.js app
    print("Restarting Passenger Node app...")
    ftp.cwd('backend/backend/tmp')
    ftp.storbinary('STOR restart.txt', io.BytesIO(b"restart-backend-fix"))
    print("Restarted successfully!")
    
    ftp.quit()
    print("All backend files uploaded successfully!")
    
except Exception as e:
    print(f"FTP Error: {e}")
    sys.exit(1)
