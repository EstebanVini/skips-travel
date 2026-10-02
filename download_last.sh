#!/bin/bash
OUT_DIR="/home/esteban/Documents/GitHub/skips-travel/public/images"
title="File:Costa Atlantica DSC09523.JPG"
filename="margaritaville_at_sea_islander"
img_res=$(curl -s "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=$(jq -nr --arg t "$title" '$t|@uri')&pithumbsize=1000")
img_url=$(echo "$img_res" | jq -r '.query.pages[].thumbnail.source // empty')
curl -s -L -A "ImageBot/1.0" "$img_url" -o "$OUT_DIR/${filename}.jpg"
echo "Saved $OUT_DIR/${filename}.jpg"
