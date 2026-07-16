import ftplib
import sys
import os

host = 'anandelectricals.in'
user = 'anaelectals'
password = r'065p(D4yw2[Tc5Rh'

files_to_upload = [
    ('dist/index.html', 'public_html/index.html'),
    ('dist/assets/index-CpcL92k_.js', 'public_html/assets/index-CpcL92k_.js')
]

try:
    print(f"Connecting to cPanel FTP at {host}...")
    ftp = ftplib.FTP(host, timeout=15)
    ftp.login(user, password)
    print("Logged in successfully!")
    
    for local_path, remote_path in files_to_upload:
        if not os.path.exists(local_path):
            print(f"Error: Local file {local_path} not found!")
            continue
            
        print(f"Uploading {local_path} to {remote_path}...")
        with open(local_path, 'rb') as f:
            ftp.storbinary(f'STOR {remote_path}', f)
        print(f"Uploaded {remote_path} successfully!")
        
    ftp.quit()
    print("All uploads completed successfully!")
except Exception as e:
    print(f"Error during upload: {e}")
    sys.exit(1)
