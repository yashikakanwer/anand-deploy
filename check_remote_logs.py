import ftplib
import io

host = 'anandelectricals.in'
user = 'anaelectals'
password = r'065p(D4yw2[Tc5Rh'

try:
    print(f"Connecting to FTP at {host}...")
    ftp = ftplib.FTP(host, timeout=20)
    ftp.login(user, password)
    print("Logged in successfully!")
    
    ftp.cwd('backend/backend')
    print("\nReading entire stderr.log:")
    log_io = io.BytesIO()
    try:
        ftp.retrbinary('RETR stderr.log', log_io.write)
        lines = log_io.getvalue().decode('utf-8').split('\n')
        # Print last 50 lines
        for line in lines[-50:]:
            print(line)
    except Exception as e:
        print(f"Could not read stderr.log: {e}")
        
    ftp.quit()
except Exception as e:
    print(f"FTP Error: {e}")
