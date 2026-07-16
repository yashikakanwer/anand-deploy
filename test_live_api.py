import urllib.request
import ssl

url = "https://anandelectricals.in/api"
print(f"Testing GET request to {url}...")

# Ignore SSL verification for testing
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=5) as response:
        print("Status code:", response.status)
        data = response.read().decode('utf-8')
        print("Data response:", data)
except Exception as e:
    print("Request failed:", e)
