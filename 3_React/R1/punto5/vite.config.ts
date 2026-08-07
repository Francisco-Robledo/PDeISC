import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-json',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/save' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              const filePath = path.resolve(__dirname, 'registro.json');
              let records: any[] = [];
              if (fs.existsSync(filePath)) {
                try {
                  records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                } catch(e) {}
              }
              const newRecord = JSON.parse(body);
              records.push({ ...newRecord, timestamp: new Date().toISOString() });
              fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            });
          } else {
            next();
          }
        });
      }
    }
  ],
})
