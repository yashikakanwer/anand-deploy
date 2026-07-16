import ftplib
import sys

host = 'anandelectricals.in'
user = 'anaelectals'
password = r'065p(D4yw2[Tc5Rh'

try:
    ftp = ftplib.FTP(host, timeout=10)
    ftp.login(user, password)
    ftp.cwd('backend/backend')
    
    print("Reading remote stderr.log...")
    lines = []
    
    def handle_line(line):
        lines.append(line)
        
    ftp.retrlines('RETR stderr.log', handle_line)
    
    print("Last 50 lines of remote stderr.log:")
    for line in lines[-50:]:
        print(line)
        
    ftp.quit()
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
