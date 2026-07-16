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
    log_io = io.BytesIO()
    try:
        ftp.retrbinary('RETR stderr.log', log_io.write)
        content = log_io.getvalue().decode('utf-8')
        print("\n--- Printing All Startup/Crash Errors in stderr.log ---")
        lines = content.split('\n')
        # Find lines containing "Error:" or stack trace starts
        for i, line in enumerate(lines):
            if "Error" in line or "Exception" in line or "EACCES" in line or "EROFS" in line:
                # print context of 5 lines before and 10 lines after
                print(f"--- Error found at line {i} ---")
                for j in range(max(0, i-5), min(len(lines), i+15)):
                    print(f"{j}: {lines[j]}")
                print("-" * 40)
    except Exception as e:
        print(f"Could not read stderr.log: {e}")
        
    ftp.quit()
except Exception as e:
    print(f"FTP Error: {e}")
