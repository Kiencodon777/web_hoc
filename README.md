# Kiến Học

Vanilla JavaScript SPA + Express, Supabase PostgreSQL, Resend OTP, JWT và đồng bộ đa thiết bị. SQLite vẫn dùng được khi phát triển trên máy.

**Chuyển sang Supabase + Cloudflare:** xem [CLOUD_MIGRATION_VI.md](CLOUD_MIGRATION_VI.md). Hướng dẫn Render bên dưới dành cho phương án SQLite cũ.

Đọc [DEPLOY_VI.md](DEPLOY_VI.md) để cấu hình email, chạy local, triển khai Render và trỏ `vietkienetet.id.vn` tại ZoneDNS.

```bash
npm ci
# Copy .env.example to .env and configure real secrets/email
npm test
npm start
```

Node.js 22. Frontend thật ở `dist/index.html`; Express chỉ phục vụ `dist/`. SQLite production cần ổ đĩa bền vững. `.openai/hosting.json` chỉ dành cho bản frontend trên Sites, không phải cấu hình chạy Express trên Render.
