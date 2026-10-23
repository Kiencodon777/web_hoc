# Kiến Học

Vanilla JavaScript SPA + Node.js/Express + SQLite, Resend OTP, JWT và đồng bộ đa thiết bị.

Đọc [DEPLOY_VI.md](DEPLOY_VI.md) để cấu hình email, chạy local, triển khai Render và trỏ `vietkienetet.id.vn` tại ZoneDNS.

```bash
npm ci
# Copy .env.example to .env and configure real secrets/email
npm test
npm start
```

Node.js 22. Frontend thật ở `dist/index.html`; Express chỉ phục vụ `dist/`. SQLite production cần ổ đĩa bền vững. `.openai/hosting.json` chỉ dành cho bản frontend trên Sites, không phải cấu hình chạy Express trên Render.
