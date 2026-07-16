import ftplib
import sys
import io
import time
import urllib.request

host = 'anandelectricals.in'
user = 'anaelectals'
password = r'065p(D4yw2[Tc5Rh'

try:
    print(f"Connecting to FTP at {host}...")
    ftp = ftplib.FTP(host, timeout=15)
    ftp.login(user, password)
    print("Logged in successfully!")
    
    # 1. Upload updated app.js
    ftp.cwd('backend/backend')
    print("Uploading app.js...")
    with open('backend/app.js', 'rb') as f:
        ftp.storbinary('STOR app.js', f)
    print("Uploaded app.js successfully!")
    
    # 2. Upload install_flag.txt
    print("Uploading install_flag.txt...")
    ftp.storbinary('STOR install_flag.txt', io.BytesIO(b"trigger"))
    print("Uploaded install_flag.txt successfully!")
    
    # 3. Touch restart.txt
    print("Touching restart.txt...")
    ftp.cwd('tmp')
    ftp.storbinary('STOR restart.txt', io.BytesIO(b"restart-for-npm-install"))
    print("Touched restart.txt successfully!")
    ftp.quit()
    
    # 4. Trigger request to run the script
    api_url = 'https://anandelectricals.in/api/products'
    print(f"Triggering NPM install by requesting: {api_url}...")
    try:
        req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
        # Timeout of 5s so we don't block. The installation will run in the background.
        urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        print(f"Expected request timeout/failure as npm install is running: {e}")
        
    # 5. Poll install.log to see the output
    print("Waiting 10 seconds for installation to begin...")
    time.sleep(10)
    
    for attempt in range(6):
        print(f"Checking install.log progress (attempt {attempt + 1}/6)...")
        try:
            ftp = ftplib.FTP(host, timeout=15)
            ftp.login(user, password)
            ftp.cwd('backend/backend')
            
            files = ftp.nlst()
            if 'install.log' in files:
                lines = []
                ftp.retrlines('RETR install.log', lines.append)
                print("\n=== install.log Content ===")
                for line in lines[-20:]:
                    print(line)
                print("===========================\n")
                
                # Check if done
                if any("completed successfully" in l or "ERROR" in l for l in lines):
                    print("NPM install process completed!")
                    ftp.quit()
                    break
            else:
                print("install.log not created yet...")
            ftp.quit()
        except Exception as poll_err:
            print(f"Error checking log: {poll_err}")
            
        time.sleep(10)

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
