# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
# 개발
pnpm i                    # 의존성 설치
pnpm build:shared         # shared 패키지 빌드 (dev 실행 전 필수)
pnpm dev                  # API (포트 4000)와 Web (포트 3000) 동시 실행

# 빌드
pnpm build                # 전체 빌드 (shared -> api, web 순서)
pnpm build:api            # API만 빌드
pnpm build:web            # Web만 빌드

# 테스트 (apps/api 디렉토리에서 실행)
cd apps/api
pnpm test                 # 단위 테스트 실행
pnpm test:watch           # 감시 모드로 테스트 실행
pnpm test -- --testPathPattern="app.controller"  # 특정 파일 테스트
pnpm test:e2e             # e2e 테스트 실행

# 린트 & 포맷팅
pnpm lint                 # 모노레포 전체 ESLint
pnpm format               # Prettier 포맷팅
```

## 아키텍처

pnpm 모노레포, 세 개의 워크스페이스:

- **apps/api** - NestJS 11 백엔드 (포트 4000), Passport JWT 인증
- **apps/web** - Next.js 16 프론트엔드, App Router (포트 3000), React 19, TailwindCSS 4
- **packages/shared** - 공유 타입, 상수, enum, 유틸리티 (tsup 빌드)

### 환경변수
- `apps/api/.env.development` - API 환경변수 (SUPABASE_URL, SUPABASE_JWT_SECRET_KEY 등)
- `apps/web/.env.development` - Web 환경변수 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY 등)

### 데이터베이스 (Supabase)
- `profiles` - 사용자 정보 (id, email, nickname, avatar_url, role)
- `attendance_logs` - 출퇴근 기록 (user_id, type, timestamp)

### 인증 흐름
1. **Web**: Supabase 이메일/비밀번호 로그인 -> 쿠키에 세션 저장 -> Next.js 미들웨어에서 세션 갱신
2. **API**: Passport JWT 전략으로 Supabase JWT 검증 (SupabaseStrategy)

### API 모듈 구조
- `AppModule` - 루트 모듈, ConfigModule(전역), AuthModule 임포트
- `AuthModule` - Passport JWT 인증, JwtAuthGuard 제공
- `SupabaseService` - Supabase 클라이언트 래퍼

### Web 라우트 구조 (App Router)
- `/` - 메인 페이지 (출퇴근 기록)
- `/login` - 로그인
- `/signup` - 회원가입
- `/error` - 에러 페이지

### Shared 패키지 사용법
```typescript
import { MAIN_TITLE } from '@sevenlinelabs-attendance/shared';
import { someType } from '@sevenlinelabs-attendance/shared/types';
import { someConstant } from '@sevenlinelabs-attendance/shared/constants';
import { someEnum } from '@sevenlinelabs-attendance/shared/enums';
import { someUtil } from '@sevenlinelabs-attendance/shared/utils';
```
