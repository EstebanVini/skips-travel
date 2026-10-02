#!/bin/bash
OUT_DIR="/home/esteban/Documents/GitHub/skips-travel/public/images"

download_file() {
    local filename="$1"
    local title="$2"
    
    echo "Processing $title for $filename..."
    
    # Get image url
    local img_res=$(curl -s "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=$(jq -nr --arg t "$title" '$t|@uri')&pithumbsize=1000")
    local img_url=$(echo "$img_res" | jq -r '.query.pages[].thumbnail.source // empty')
    
    if [ -z "$img_url" ]; then
        echo "No image for $title"
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

download_file "cancun" "File:Cancun_Beach.jpg"
download_file "carnival_radiance" "File:Carnival Radiance in Ensenada 2023.jpg"
download_file "ovation_of_the_seas" "File:2025-02-23 Ovation of the Seas in Sydney.jpg"
download_file "carnival_breeze" "File:Carnival Breeze Overhead.jpg"
download_file "margaritaville_at_sea_islander" "File:Costa_Atlantica_2011_in_Geiranger_03.jpg"
