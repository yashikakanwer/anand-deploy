import ftplib
import os
import sys

host = 'anandelectricals.in'
user = 'anaelectals'
password = r'065p(D4yw2[Tc5Rh'

local_dist = 'dist'
remote_root = 'public_html'

try:
    print(f"Connecting to cPanel FTP at {host}...")
    ftp = ftplib.FTP(host, timeout=30)
    ftp.login(user, password)
    print("Logged in successfully!")
    
    # 1. Clean up obsolete assets first
    print("Listing remote assets in public_html/assets...")
    remote_assets = []
    try:
        ftp.cwd(f"{remote_root}/assets")
        remote_assets = ftp.nlst()
        print(f"Found {len(remote_assets)} files on remote assets folder.")
    except Exception as e:
        print(f"Could not list or enter public_html/assets: {e}")
        # Try to make directory just in case it doesn't exist
        try:
            ftp.cwd("..")
            ftp.mkd(f"{remote_root}/assets")
            ftp.cwd(f"{remote_root}/assets")
            print("Created remote assets directory.")
        except Exception as ex:
            print(f"Error creating assets directory: {ex}")
            sys.exit(1)

    # Current built asset names
    local_assets_dir = os.path.join(local_dist, 'assets')
    local_assets_files = os.listdir(local_assets_dir)
    print("Local built assets:", local_assets_files)

    # Delete obsolete index files from remote public_html/assets
    for filename in remote_assets:
        if (filename.startswith('index-') and (filename.endswith('.js') or filename.endswith('.css'))):
            if filename not in local_assets_files:
                print(f"Deleting obsolete remote asset: {filename}")
                try:
                    ftp.delete(filename)
                except Exception as de:
                    print(f"Failed to delete {filename}: {de}")

    # 2. Upload all files from local dist/assets to remote public_html/assets
    for filename in local_assets_files:
        local_path = os.path.join(local_assets_dir, filename)
        print(f"Uploading {filename} to public_html/assets/{filename}...")
        with open(local_path, 'rb') as f:
            ftp.storbinary(f'STOR {filename}', f)
        print(f"Uploaded {filename} successfully.")

    # 3. Upload index.html to public_html/index.html
    ftp.cwd("../..") # Go back to root
    local_index_path = os.path.join(local_dist, 'index.html')
    print("Uploading index.html to public_html/index.html...")
    with open(local_index_path, 'rb') as f:
        ftp.storbinary(f'STOR {remote_root}/index.html', f)
    print("Uploaded index.html successfully.")

    ftp.quit()
    print("\nFTP Deploy completed successfully!")
except Exception as e:
    print(f"Deployment failed: {e}")
    sys.exit(1)
