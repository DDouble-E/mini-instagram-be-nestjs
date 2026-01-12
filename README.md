## 🚀 Cách chạy Backend bằng Docker (Quick Start)

```bash
# 1. Clone backend
git clone <backend-repo-url>
cd mini-instagram-be-nestjs

# 2. Tạo file env
cp .env.example .env

# 3. Build & chạy backend + database
docker compose up --build

# 4. (Tuỳ chọn) Reset toàn bộ database
docker compose down -v
docker compose up --build