# 🌾 AiRicePest Project Summary

## Quick Info

**Project**: AI Rice Disease Recognition System  
**Version**: 0.1.0  
**Type**: Full-Stack Web Application  
**License**: MIT

---

## Architecture Overview

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │         │   Backend    │         │   Database   │
│  Next.js 16  │ ◄────► │  Flask 2.3   │ ◄────► │ MariaDB/MySQL│
│  Port 3000   │  HTTP   │  Port 4000   │  SQL    │   Port 3306  │
└──────────────┘         └──────────────┘         └──────────────┘
     React                   Python                    Tables:
  TypeScript               SQLAlchemy              - users
  Tailwind CSS             JWT Auth                - knowledge_base
  shadcn/ui                bcrypt                  - history
                                                   - feedbacks
                                                   - recognition_details
```

---

## Key Features

### 🔐 Authentication System
- JWT-based secure login/register
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- 24-hour token expiration

### 📸 AI Recognition
- Image upload for disease identification
- Confidence scoring
- History tracking
- Detailed result pages with treatment solutions

### 📚 Knowledge Base
- 18 pre-seeded rice diseases and pests
- Comprehensive information:
  - Disease characteristics & symptoms
  - Prevention methods (4 types)
  - High-quality images
  - Lifecycle & transmission info

### 💬 User Feedback
- Submit feedback with text and images
- Admin review and status management
- File upload support (multipart/form-data)

### 🎨 UX Features
- Multi-language support (EN/CN)
- 4 theme options (Light, Dark, Blue, Green)
- Responsive design (mobile-friendly)
- Dark mode support

### 👨‍💼 Admin Panel
- User management (CRUD operations)
- System statistics dashboard
- Feedback management
- Knowledge base CMS

---

## Tech Stack at a Glance

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Radix UI |
| **Backend** | Python 3.11+, Flask 2.3, SQLAlchemy 2.0, Flask-CORS |
| **Database** | MariaDB/MySQL 5.7+, PyMySQL driver |
| **Authentication** | JWT (PyJWT + Flask-JWT-Extended), bcrypt |
| **Deployment** | Node.js 20+, Gunicorn (production) |

---

## Project Structure (Simplified)

```
airicepest/
├── app/                   # Next.js pages (sign-in, knowledge, history, etc.)
├── backend/               # Flask API (Active Backend - Port 4000)
│   ├── routes/            # API endpoints (auth, knowledge, recognition, etc.)
│   ├── static/uploads/    # User-uploaded files
│   ├── models.py          # Database ORM models
│   ├── app.py             # Flask entry point
│   └── requirements.txt   # Python dependencies
├── components/            # React UI components & providers
├── lib/                   # Utilities (API config, Tailwind utils)
├── server/                # (Optional) SQL schemas & seed data
│   └── sql/               # schema.sql, seed.sql
├── .env.local             # Frontend environment variables
├── README.md              # Full documentation (bilingual)
├── quickstart.sh          # Quick start script (Linux/Mac)
└── quickstart.bat         # Quick start script (Windows)
```

---

## Quick Start (30 seconds)

### Prerequisites
- Node.js 20+
- Python 3.11+
- MariaDB/MySQL 5.7+

### Setup
```bash
# 1. Install dependencies
npm install
cd backend && pip install -r requirements.txt && cd ..

# 2. Setup database
mysql -u root -p -e "CREATE DATABASE airicepest CHARACTER SET utf8mb4;"
mysql -u root -p airicepest < server/sql/schema.sql
mysql -u root -p airicepest < server/sql/seed.sql

# 3. Configure environment
# Create .env.local: NEXT_PUBLIC_API_URL=http://localhost:4000
# Configure backend/.env with DB credentials

# 4. Run (Linux/Mac)
./quickstart.sh

# OR run manually:
# Terminal 1: cd backend && python app.py
# Terminal 2: npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

### Test Accounts
- **User**: `farmer_john` / `password123`
- **Admin**: `admin` / `admin123`

---

## API Endpoints Summary

### Public
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User (JWT Required)
- `GET /api/profile` - Get/update user profile
- `GET /api/knowledge` - Browse disease database
- `POST /api/recognize` - Upload image for recognition
- `GET /api/history` - View recognition history
- `POST /api/feedback` - Submit feedback (with file upload)

### Admin (Admin Role Required)
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/feedbacks` - Feedback management
- `POST /api/admin/knowledge` - Knowledge base CMS

---

## Database Schema

### Main Tables
1. **users** - User accounts (id, username, email, role, password_hash)
2. **knowledge_base** - Disease encyclopedia (18 entries with full metadata)
3. **history** - Recognition records (id, date, image_url, disease_name, confidence)
4. **recognition_details** - Detailed results (description, cause, solution_steps)
5. **feedbacks** - User feedback (user_id, text, image_urls, status)

---

## Configuration Files

| File | Purpose |
|------|---------|
| `.env.local` | Frontend API URL (NEXT_PUBLIC_API_URL) |
| `backend/.env` | DB credentials, JWT secret key |
| `next.config.ts` | Next.js build configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `tsconfig.json` | TypeScript compiler options |

---

## Development Workflow

### Adding a New Feature
1. **Frontend**: Create page in `app/` folder
2. **Backend**: Add route in `backend/routes/`
3. **Database**: Update models in `backend/models.py`
4. **API Config**: Add endpoint to `lib/api-config.ts`
5. **i18n**: Add translations to `components/language-provider.tsx`

### Testing Flow
1. Start backend: `cd backend && python app.py`
2. Start frontend: `npm run dev`
3. Login with test account
4. Test feature in browser
5. Check backend logs for API calls
6. Verify database changes in MySQL

---

## Deployment Checklist

### Frontend (Next.js)
- [ ] Run `npm run build`
- [ ] Set `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Deploy to Vercel/Netlify or run `npm start`

### Backend (Flask)
- [ ] Set `debug=False` in `backend/app.py`
- [ ] Generate secure `SECRET_KEY` in `backend/.env`
- [ ] Use Gunicorn: `gunicorn -w 4 -b 0.0.0.0:4000 app:app`
- [ ] Setup reverse proxy (Nginx) for HTTPS
- [ ] Configure firewall (allow 4000)

### Database
- [ ] Use strong passwords
- [ ] Regular backups
- [ ] Enable SSL connections
- [ ] Optimize indexes for large tables

---

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` |
| Port 4000 in use | `lsof -ti:4000 \| xargs kill -9` |
| CORS errors | Check `backend/app.py` CORS origins |
| JWT token expired | Re-login (token valid 24h) |
| DB connection failed | Verify MySQL running, check `backend/.env` |
| Module not found (Python) | `cd backend && pip install -r requirements.txt` |
| Module not found (Node) | `rm -rf node_modules && npm install` |

---

## Performance Notes

### Expected Response Times (Dev)
- Authentication: ~200ms
- Knowledge base: ~150ms (18 items)
- Recognition upload: ~500ms (mock, actual ML model will vary)
- History list: ~100ms
- Admin stats: ~250ms

### Optimization Opportunities
- Add Redis for session caching
- Implement pagination for large datasets
- CDN for static assets (images)
- Database query optimization (indexes)
- Frontend code splitting (dynamic imports)

---

## Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication with expiration
- ✅ CORS configuration
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Role-based access control
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: HTTPS enforcement
- ⚠️ TODO: Input sanitization on frontend

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic CRUD operations
- ✅ Authentication system
- ✅ Knowledge base browsing
- ✅ User feedback

### Phase 2 (Planned)
- [ ] Real AI model integration (TensorFlow/PyTorch)
- [ ] Image preprocessing pipeline
- [ ] Model training interface
- [ ] Batch recognition

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Real-time chat support
- [ ] Weather integration
- [ ] Field location mapping
- [ ] Community forum

---

## Resources

- **Full Documentation**: `README.md`
- **API Reference**: Section "API Endpoints" in README
- **Database Schema**: `server/sql/schema.sql`
- **Seed Data**: `server/sql/seed.sql`
- **Old Docs**: `docs/archive/`

---

## Support

- **Issues**: [Open GitHub Issue]
- **Email**: [your-email@example.com]
- **Documentation**: See `README.md` for detailed guides

---

**Last Updated**: 2024-11-20  
**Maintained By**: AiRicePest Team
