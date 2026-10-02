#!/bin/bash
OUT_DIR="/home/esteban/Documents/GitHub/skips-travel/public/images"
mkdir -p "$OUT_DIR"

download_image() {
    local filename="$1"
    local query="$2"
    
    echo "Processing $query..."
    
    # 1. Search page
    local search_res=$(curl -s "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=$(jq -nr --arg q "$query" '$q|@uri')&utf8=1&srlimit=1")
    local title=$(echo "$search_res" | jq -r '.query.search[0].title // empty')
    
    if [ -z "$title" ]; then
        echo "No results for $query"
        return
    fi
    
    echo "Found page: $title"
    
    # 2. Get image url
    local img_res=$(curl -s "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=$(jq -nr --arg t "$title" '$t|@uri')&pithumbsize=1000")
    local img_url=$(echo "$img_res" | jq -r '.query.pages[].thumbnail.source // empty')
    
    if [ -z "$img_url" ]; then
        echo "No image for $query"
        return
    fi
    
    echo "Downloading $img_url..."
    
    local ext="${img_url##*.}"
    ext="${ext%%\?*}"
    case "${ext,,}" in
        jpg|jpeg|png|webp|gif) ;;
        *) ext="jpg" ;;
    esac
    
    curl -s -L -A "ImageBot/1.0" "$img_url" -o "$OUT_DIR/${filename}.${ext}"
    echo "Saved $OUT_DIR/${filename}.${ext}"
}

download_image "nuevo_vallarta" "Nuevo Nayarit"
download_image "huatulco" "Huatulco"
download_image "ixtapa_zihuatanejo" "Ixtapa"
download_image "los_cabos" "Cabo San Lucas"
download_image "mazatlan" "Mazatlán"
download_image "cancun" "Cancún"
download_image "carnival_radiance" "Carnival Radiance"
download_image "ovation_of_the_seas" "Ovation of the Seas"
download_image "carnival_breeze" "Carnival Breeze"
download_image "margaritaville_at_sea_islander" "Costa Atlantica"
