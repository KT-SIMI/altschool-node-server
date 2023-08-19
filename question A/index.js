const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 8000

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url

  if (filePath === './') {
    filePath = './index.html'
  }

  const extname = path.extname(filePath)
  const contentType = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
  }[extname] || 'application/octet-stream'

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end(`<h1>404: Error Page</h1>`)
      } else {
        res.writeHead(500)
        res.end('Server Error')
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content)
    }
  })
})

server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
