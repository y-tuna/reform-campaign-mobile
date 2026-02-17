# 유세 비서 (Campaign Assistant) - Web Application

개혁신당 공천 후보자를 위한 캠페인 관리 서비스입니다. Next.js와 Supabase로 구축되었습니다.

## 서비스 개요

유세 비서는 공천 시스템(apply-reform)을 통해 최종 승인(status=pass)을 받은 후보자만 사용할 수 있는 캠페인 관리 플랫폼입니다.

## Development

### Prerequisites

- Node.js 18+ 
- npm

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Fill in your environment variables in `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel Deployment

This project is configured for deployment on Vercel with the following setup:

1. **Automatic Deployments**: 
   - Preview deployments for all branches
   - Production deployment from `main` branch

2. **Environment Variables**:
   - Set production variables in Vercel dashboard
   - Use `NEXT_PUBLIC_*` prefix for client-side variables

3. **Build Configuration**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key (server-only)

### Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Project Structure

```
apps/web/
├── app/              # Next.js App Router pages
├── public/           # Static assets
├── .env.example      # Environment variables template
├── .env.local        # Local development environment
├── next.config.mjs   # Next.js configuration
├── tsconfig.json     # TypeScript configuration
├── vercel.json       # Vercel deployment configuration
└── package.json      # Dependencies and scripts
```

## Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Supabase** - Backend as a Service
- **Vercel** - Deployment platform