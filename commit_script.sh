#!/bin/bash

function commit_step() {
    msg=$1
    shift
    for p in "$@"; do
        if ls $p 1> /dev/null 2>&1; then
            git add $p
        fi
    done
    git commit --allow-empty -m "$msg"
}

commit_step "01: Initial Setup" package.json package-lock.json tsconfig.json .gitignore .env.example idea.md classDiagram.md sequenceDiagram.md useCaseDiagram.md img/
commit_step "02: Database schema and ER diagram" prisma/schema.prisma ErDiagram.md
commit_step "03: Prisma client and configuration" prisma.config.ts src/index.ts
commit_step "04: Auth models and repository" src/repositories/user* src/models/user*
commit_step "05: JWT Auth service" src/services/auth* src/utils/jwt* src/utils/bcrypt*
commit_step "06: Hotel and Room models" src/repositories/hotel* src/repositories/room* src/models/hotel* src/models/room*
commit_step "07: Hotel management service" src/services/hotel*
commit_step "08: Room query service" src/services/room*
commit_step "09: Transactional booking repository" src/repositories/booking*
commit_step "10: Booking concurrency handling" src/services/booking*
commit_step "11: Review service" src/services/review* src/repositories/review*
commit_step "12: Express application setup" src/app.ts src/types/ src/middlewares/
commit_step "13: Auth and Error middleware" src/middlewares/auth* src/middlewares/error*
commit_step "14: Auth API controllers" src/controllers/auth* src/routes/auth*
commit_step "15: Hotel and Room API controllers" src/controllers/hotel* src/controllers/room* src/routes/hotel* src/routes/room*
commit_step "16: Booking API controllers" src/controllers/booking* src/routes/booking*
commit_step "17: Dynamic surge pricing engine" src/services/pricing* src/utils/pricing*
commit_step "18: Synthetic data seed script" prisma/seed.ts prisma/seeders/
commit_step "19: Vite React frontend setup" frontend/package.json frontend/package-lock.json frontend/vite.config.ts frontend/tsconfig.* frontend/index.html frontend/eslint.config.js frontend/public/ frontend/.gitignore frontend/README.md frontend/src/main.tsx frontend/src/vite-env.d.ts frontend/src/App.tsx
commit_step "20: Frontend API interceptors" frontend/src/api/ frontend/src/services/api.ts frontend/src/services/index.ts frontend/src/utils/
commit_step "21: Auth UI components" frontend/src/components/auth/ frontend/src/pages/Login* frontend/src/pages/Register* frontend/src/services/auth* frontend/src/context/auth*
commit_step "22: Hotel browsing UI" frontend/src/pages/Hotel* frontend/src/components/hotel* frontend/src/services/hotel* frontend/src/services/review* frontend/src/services/room*
commit_step "23: Booking and details UI" frontend/src/pages/Booking* frontend/src/components/booking* frontend/src/services/booking*
commit_step "24: User dashboard UI" frontend/src/pages/Dashboard* frontend/src/components/dashboard* frontend/src/components/Header* frontend/src/components/index.ts frontend/src/hooks/
git add .
git commit -m "25: Premium CSS design system"
