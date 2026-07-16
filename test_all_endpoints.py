import urllib.request
import urllib.error
import json
import sys

endpoints = [
    'https://anandelectricals.in/api/products',
    'https://anandelectricals.in/api/projects',
    'https://anandelectricals.in/api/services',
    'https://anandelectricals.in/api/blogs',
    'https://anandelectricals.in/api/jobs'
]

success = True

for url in endpoints:
    try:
        print(f"Testing endpoint {url}...")
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        # Give it a slightly longer timeout of 10s for the first load (Passenger startup time)
        with urllib.request.urlopen(req, timeout=12) as response:
            status = response.status
            content = response.read().decode('utf-8')
            
            # Check JSON
            data = json.loads(content)
            print(f"  Status: {status} OK")
            print(f"  Received valid JSON array with {len(data)} items!")
            print(f"  First item preview: {str(data[0])[:120]}...")
    except urllib.error.HTTPError as e:
        print(f"  HTTP Error {e.code}: {e.reason}")
        success = False
    except Exception as e:
        print(f"  Error: {e}")
        success = False

if success:
    print("\nAll endpoints verified successfully!")
else:
    print("\nSome endpoints failed!")
    sys.exit(1)
