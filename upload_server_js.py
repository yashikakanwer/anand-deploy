import ftplib
import sys
import os
import io
import urllib.request
import urllib.error

host = 'anandelectricals.in'
user = 'anaelectals'
password = r'065p(D4yw2[Tc5Rh'

try:
    print(f"Connecting to FTP at {host}...")
    ftp = ftplib.FTP(host, timeout=15)
    ftp.login(user, password)
    print("Logged in successfully!")
    
    # 1. Upload updated server.js
    local_path = 'backend/server.js'
    remote_path = 'backend/backend/server.js'
    print(f"Uploading {local_path} -> {remote_path}...")
    with open(local_path, 'rb') as f:
        ftp.storbinary(f'STOR {remote_path}', f)
    print("Uploaded server.js successfully!")
    
    # 2. Touch restart.txt
    print("Touching restart.txt to restart application...")
    ftp.cwd('backend/backend/tmp')
    ftp.storbinary('STOR restart.txt', io.BytesIO(b"restart-with-debug-logging"))
    print("Touched restart.txt successfully!")
    ftp.quit()
    
    # 3. Request API to trigger startup and generate debug.log
    api_url = 'https://anandelectricals.in/api/products'
    print(f"Triggering app startup by requesting: {api_url}...")
    try:
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        # Give it a short 6-second timeout so we don't hang if it's broken
        with urllib.request.urlopen(req, timeout=6) as response:
            print("Response status:", response.status)
            print("Response body preview:", response.read().decode('utf-8')[:200])
    except Exception as e:
        print(f"Request failed (this is expected if it hangs or throws error): {e}")
        
    # 4. Connect again and download debug.log to see the console output of the app!
    print("Connecting again to download debug.log...")
    ftp = ftplib.FTP(host, timeout=15)
    ftp.login(user, password)
    ftp.cwd('backend/backend')
    
    # Check if debug.log exists
    files = ftp.nlst()
    if 'debug.log' in files:
        print("debug.log found! Downloading...")
        with open('remote_debug.log', 'wb') as f:
            ftp.retrbinary('RETR debug.log', f.write)
        print("Downloaded debug.log successfully!")
    else:
        print("debug.log was NOT generated. Node.js app did not run or write to it.")
        
    ftp.quit()

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
