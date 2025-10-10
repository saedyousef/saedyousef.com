#!/bin/bash

# Simple HTTP server for local testing
# Usage: ./server.sh [port]
# Default port: 8096

PORT=${1:-8096}

echo "Starting local server on http://localhost:$PORT"
echo "Press Ctrl+C to stop"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
# Fallback to Node.js if available
elif command -v node &> /dev/null; then
    node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{let filePath='.'+(req.url==='/'?'/index.html':req.url);const extname=String(path.extname(filePath)).toLowerCase();const mimeTypes={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpg','.gif':'image/gif','.svg':'image/svg+xml','.ico':'image/x-icon'};const contentType=mimeTypes[extname]||'application/octet-stream';fs.readFile(filePath,(error,content)=>{if(error){if(error.code=='ENOENT'){res.writeHead(404);res.end('404 Not Found');}else{res.writeHead(500);res.end('500 Internal Server Error');}}else{res.writeHead(200,{'Content-Type':contentType});res.end(content,'utf-8');}});}).listen($PORT,()=>console.log('Server running at http://localhost:$PORT/'))"
# Fallback to PHP if available
elif command -v php &> /dev/null; then
    php -S localhost:$PORT
else
    echo "Error: No suitable HTTP server found!"
    echo "Please install Python 3, Node.js, or PHP"
    exit 1
fi
