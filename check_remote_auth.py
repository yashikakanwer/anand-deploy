import ftplib
import io

host = 'anandelectricals.in'
user = 'anaelectals'
password = r'065p(D4yw2[Tc5Rh'

try:
    print(f"Connecting to FTP at {host}...")
    ftp = ftplib.FTP(host, timeout=20)
    ftp.login(user, password)
    print("Logged in successfully!\n")
    
    # 1. Read remote users.json
    print("--- Reading remote data/users.json ---")
    try:
        users_io = io.BytesIO()
        ftp.retrbinary('RETR backend/backend/data/users.json', users_io.write)
        users_content = users_io.getvalue().decode('utf-8')
        print(users_content)
    except Exception as e:
        print(f"Could not read users.json: {e}")

    # 2. Read remote .env
    print("\n--- Reading remote .env ---")
    try:
        env_io = io.BytesIO()
        ftp.retrbinary('RETR backend/backend/.env', env_io.write)
        env_content = env_io.getvalue().decode('utf-8')
        print(env_content)
    except Exception as e:
        print(f"Could not read .env: {e}")

    # 3. Read remote config/autoSeed.js
    print("\n--- Reading remote config/autoSeed.js (Seed logic) ---")
    try:
        seed_io = io.BytesIO()
        ftp.retrbinary('RETR backend/backend/config/autoSeed.js', seed_io.write)
        seed_content = seed_io.getvalue().decode('utf-8')
        # print first few lines of seed script
        for line in seed_content.split('\n')[30:45]:
            print(line)
    except Exception as e:
        print(f"Could not read autoSeed.js: {e}")

    ftp.quit()
except Exception as e:
    print(f"FTP Error: {e}")
