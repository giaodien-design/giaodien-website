# 🎓 Learning Cheatsheet - Giaodien Website

## 📋 Checklist học tập cho người mới

### 🎯 **Giai đoạn 1: Hiểu cơ bản (Tuần 1-2)**

#### ✅ **Cấu trúc project**
- [ ] Hiểu được ý nghĩa của từng thư mục chính
- [ ] Biết được file nào chứa cấu hình gì
- [ ] Hiểu được luồng hoạt động từ Frontend → API → Database

#### ✅ **Tech Stack cơ bản**
- [ ] **Next.js**: Framework React, hiểu App Router
- [ ] **TypeScript**: JavaScript với type safety
- [ ] **Tailwind CSS**: Utility-first CSS framework
- [ ] **Prisma**: ORM để làm việc với database
- [ ] **Docker**: Container chứa PostgreSQL database
- [ ] **PostgreSQL**: Relational database lưu trữ dữ liệu

#### ✅ **Commands quan trọng**
```bash
# Chạy development server
pnpm dev

# Build production
pnpm build

# Database commands
pnpm db:generate    # Tạo Prisma client
pnpm db:push        # Đồng bộ schema với DB
pnpm db:studio      # Mở Prisma Studio (GUI)
pnpm db:seed        # Chạy dữ liệu mẫu

# Docker commands (Database Management)
docker ps                    # Kiểm tra containers đang chạy
docker compose up -d         # Khởi động PostgreSQL container
docker compose down          # Tắt PostgreSQL container
docker compose ps            # Kiểm tra trạng thái containers
```

### 🎯 **Giai đoạn 2: Frontend (Tuần 3-4)**

#### ✅ **React Components**
- [ ] Hiểu được cấu trúc component trong `src/components/ui/`
- [ ] Biết cách import và sử dụng components
- [ ] Hiểu được props và state trong React

#### ✅ **Next.js App Router**
- [ ] Hiểu được `layout.tsx` - layout chung (bao bọc toàn website)
- [ ] Hiểu được `page.tsx` - trang cụ thể (mapping với URL)
- [ ] Hiểu được `route.ts` - API endpoint (backend API)
- [ ] Biết được file-based routing (cấu trúc thư mục = URL)
- [ ] Phân biệt Server Component vs Client Component ("use client")
- [ ] Biết cách tạo route mới (trang mới, API mới)

#### ✅ **Styling với Tailwind**
- [ ] Hiểu được utility classes (mt-4, p-6, etc.)
- [ ] Biết cách responsive design (md:, lg:)
- [ ] Hiểu được color system và spacing

### 🎯 **Giai đoạn 3: Backend & Database (Tuần 5-6)**

#### ✅ **Prisma Schema**
- [ ] Hiểu được cấu trúc `schema.prisma`
- [ ] Biết được cách định nghĩa models (App, Screen)
- [ ] Hiểu được relationships (1-n, n-n)

#### ✅ **API Routes**
- [ ] Hiểu được cấu trúc API trong `src/app/api/`
- [ ] Biết cách tạo endpoint mới
- [ ] Hiểu được HTTP methods (GET, POST, PUT, DELETE)

#### ✅ **Database Operations**
- [ ] Biết cách query data với Prisma
- [ ] Hiểu được include/select để optimize queries
- [ ] Biết cách handle errors

### 🎯 **Giai đoạn 4: Advanced (Tuần 7-8)**

#### ✅ **TypeScript Types**
- [ ] Hiểu được types trong `src/types/`
- [ ] Biết cách tạo custom types
- [ ] Hiểu được Prisma types generation

#### ✅ **Error Handling**
- [ ] Biết cách handle API errors
- [ ] Hiểu được loading states
- [ ] Biết cách validate data

#### ✅ **Performance**
- [ ] Hiểu được code splitting
- [ ] Biết cách optimize images
- [ ] Hiểu được caching strategies

## 🔍 **File/Folder Quick Reference**

### 📁 **Cấu hình**
| File | Mục đích | Khi nào cần sửa |
|------|----------|-----------------|
| `package.json` | Dependencies & scripts | Thêm thư viện mới |
| `tailwind.config.ts` | Tailwind configuration | Custom colors/themes |
| `next.config.ts` | Next.js settings | Environment variables |
| `tsconfig.json` | TypeScript settings | Path aliases |

### 📁 **Source Code**
| Thư mục | Mục đích | Nội dung chính |
|---------|----------|----------------|
| `src/app/` | Next.js App Router | Pages & API routes |
| ├── `layout.tsx` | Root layout | HTML, fonts, metadata |
| ├── `page.tsx` | Homepage | Trang chủ (/)
| ├── `globals.css` | Global styles | CSS toàn cục |
| └── `api/` | API routes | Backend endpoints |
| `src/components/` | Reusable components | UI components |
| `src/lib/` | Utilities | Helper functions |
| `src/types/` | Type definitions | TypeScript types |
| `prisma/` | Database schema | Models & migrations |

## 🚀 **Development Workflow**

### 1. **Bắt đầu development**
```bash
# Clone và install
pnpm install

# BƯỚC QUAN TRỌNG: Khởi động database trước
# Kiểm tra Docker Desktop có đang chạy không
docker ps

# Nếu không có container, khởi động PostgreSQL
docker compose up -d

# Kiểm tra lại
docker ps  # Phải thấy container giaodien-postgres

# Chạy development server
pnpm dev
```

### 2. **Thay đổi database schema**
```bash
# 1. Sửa prisma/schema.prisma
# 2. Generate client
pnpm db:generate

# 3. Push changes to DB
pnpm db:push
```

### 3. **Thêm component mới**
```bash
# 1. Tạo file trong src/components/ui/
# 2. Export component
# 3. Import và sử dụng
```

### 4. **Tạo trang mới với App Router**
```bash
# Tạo trang About
mkdir src/app/about
touch src/app/about/page.tsx

# Tạo API mới
mkdir src/app/api/users
touch src/app/api/users/route.ts
```

### 5. **App Router File Naming**
| File | URL | Mục đích |
|------|-----|----------|
| `page.tsx` | `/` | Trang chủ |
| `about/page.tsx` | `/about` | Trang About |
| `api/apps/route.ts` | `/api/apps` | API endpoint |
| `layout.tsx` | - | Root layout |

## 🎯 **Learning Goals**

### **Ngắn hạn (1-2 tuần)**
- [ ] Có thể chạy được project
- [ ] Hiểu được cấu trúc cơ bản
- [ ] Có thể sửa đổi UI đơn giản

### **Trung hạn (1 tháng)**
- [ ] Có thể thêm trang mới
- [ ] Hiểu được database operations
- [ ] Có thể tạo API endpoint

### **Dài hạn (2-3 tháng)**
- [ ] Có thể phát triển feature mới hoàn chỉnh
- [ ] Hiểu được best practices
- [ ] Có thể optimize performance

## 📚 **Resources để học**

### **Next.js**
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)

### **React**
- [React Documentation](https://react.dev)
- [React Tutorial](https://react.dev/learn)

### **TypeScript**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### **Prisma**
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)

### **Tailwind CSS**
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com)

## 🆘 **Common Issues & Solutions**

### **Database connection issues**
```bash
# Check if PostgreSQL is running
docker ps
# or
docker compose ps

# Nếu container không chạy, khởi động lại
docker compose up -d

# Reset database (CẨN THẬN: Sẽ mất hết data)
pnpm db:push --force-reset
```

### **🐳 Docker Issues**
```bash
# Lỗi: Cannot connect to Docker daemon
# Giải pháp: Bật Docker Desktop

# Lỗi: Port 5432 already in use
# Giải pháp: Kiểm tra PostgreSQL local có đang chạy không
ps aux | grep postgres

# Nếu có PostgreSQL local, dừng nó:
brew services stop postgresql@14

# Hoặc dùng port khác trong docker-compose.yml
```

### **🔍 Tại sao cần Docker?**
- **Dự án cần PostgreSQL database** để lưu trữ dữ liệu apps và screens
- **Docker chứa database** - không có Docker = không có dữ liệu hiển thị
- **API sẽ lỗi** khi không kết nối được database
- **Website hiển thị loading mãi** hoặc error message

### **TypeScript errors**
```bash
# Regenerate Prisma types
pnpm db:generate

# Check TypeScript
npx tsc --noEmit
```

### **Build errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 🎯 **Database Management Checklist**

### **📋 Khi bắt đầu làm việc:**
- [ ] Bật Docker Desktop
- [ ] Chạy `docker ps` để kiểm tra containers
- [ ] Nếu không có container, chạy `docker compose up -d`
- [ ] Chạy `pnpm dev` để khởi động website
- [ ] Mở http://localhost:3000 để kiểm tra

### **📋 Khi kết thúc làm việc:**
- [ ] Chạy `docker compose down` để tắt database
- [ ] Tắt Docker Desktop (optional)
- [ ] Tiết kiệm tài nguyên máy

### **🚨 Lưu ý quan trọng:**
- **Luôn khởi động database trước** khi chạy `pnpm dev`
- **Kiểm tra port 5432** không bị conflict với PostgreSQL local
- **Data được persist** trong Docker volume, không mất khi restart
- **Nếu có lỗi kết nối**, kiểm tra Docker Desktop có đang chạy không

---

💡 **Tip**: Hãy bắt đầu từ việc hiểu cấu trúc, sau đó thử nghiệm với những thay đổi nhỏ. Đừng ngại hỏi mentor khi gặp khó khăn!
