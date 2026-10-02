import requests
import json
import os

queries = {
    "nuevo_vallarta": "Nuevo Nayarit",
    "huatulco": "Huatulco",
    "ixtapa_zihuatanejo": "Ixtapa",
    "los_cabos": "Cabo San Lucas",
    "mazatlan": "Mazatlán",
    "cancun": "Cancún",
    "carnival_radiance": "Carnival Radiance",
    "ovation_of_the_seas": "Ovation of the Seas",
    "carnival_breeze": "Carnival Breeze",
    "margaritaville_at_sea_islander": "Margaritaville at Sea Islander" 
}

headers = {
    'User-Agent': 'ImageBot/1.0 (test@example.com)'
}

S = requests.Session()
S.headers.update(headers)
URL = "https://en.wikipedia.org/w/api.php"

output_dir = "/home/esteban/Documents/GitHub/skips-travel/public/images/"

for filename, query in queries.items():
    print(f"Processing {query}...")
    try:
        search_params = {
            "action": "query",
            "format": "json",
            "list": "search",
            "srsearch": query,
            "utf8": 1,
            "srlimit": 1
        }
        r = S.get(url=URL, params=search_params, timeout=10)
        data = r.json()
        if not data.get("query", {}).get("search"):
            print(f"No results for {query}")
            continue
        
        title = data["query"]["search"][0]["title"]
        print(f"Found page: {title}")
        
        image_params = {
            "action": "query",
            "format": "json",
            "prop": "pageimages",
            "titles": title,
            "pithumbsize": 1000
        }
        r = S.get(url=URL, params=image_params, timeout=10)
        data = r.json()
        pages = data["query"]["pages"]
        
        image_url = None
        for page_id in pages:
            if "thumbnail" in pages[page_id]:
                image_url = pages[page_id]["thumbnail"]["source"]
                
        if image_url:
            print(f"Downloading {image_url} for {query}")
            img_data = S.get(image_url, timeout=10).content
            ext = image_url.split('.')[-1].split('?')[0]
            if ext.lower() not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                ext = 'jpg'
            out_path = os.path.join(output_dir, f"{filename}.{ext}")
            with open(out_path, 'wb') as handler:
                handler.write(img_data)
            print(f"Saved {out_path}")
        else:
            print(f"No image found for {query} ({title})")
    except Exception as e:
        print(f"Error for {query}: {e}")
