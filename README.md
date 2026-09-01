# 🚀 Linco LMS — Backend API

> **High-Performance NestJS API** powering the Linco Learning Management System.  
> Handles multi-provider authentication, course & exam lifecycle, Stripe payments, live streaming (Jitsi), cloud media storage (Azure Blob), BullMQ task queues, and generative AI features via Google Gemini.

---

## 🛠 Tech Stack & Architecture

- **Runtime & Framework:** Node.js (≥ 22.19.0), NestJS, TypeScript, SWC compiler
- **Database & ORM:** PostgreSQL 15, Prisma ORM
- **Caching & Async Queues:** Redis, BullMQ
- **Authentication:** JWT, Google OAuth 2.0, Firebase Admin
- **External Integrations:**
  - 💳 **Payments:** Stripe
  - 📹 **Live Streams:** Jitsi Meet
  - ☁️ **Media Storage:** Azure Blob Storage
  - 🤖 **AI Services:** Google Gemini API
- **Containerization & Orchestration:** Docker (Multi-stage), Kubernetes (MicroK8s), NGINX Ingress Controller

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine or server:

- **Node.js:** `^22.19.0`
- **Package Manager:** `npm` (`v10+`)
- **Container Engine:** Docker & Docker Compose
- **Cluster Tool:** `kubectl` configured with cluster context (e.g., MicroK8s)

---

## 💻 1. Local Development Setup

### 1.1 Clone & Install

```bash
# Clone the repository
git clone https://github.com/yazan420/linco-backend.git
cd linco-backend

# Install dependencies
npm install
```

### 1.2 Environment & Local Services

```bash
# Set up local environment variables
cp .env.example .env

# Spin up local PostgreSQL & Redis containers
docker compose up -d

# Generate Prisma Client & apply schema migrations
npx prisma generate
npx prisma migrate deploy
```

### 1.3 Start Development Server

```bash
# Start in watch mode with fast SWC compilation
npm run start:dev
```

- 🌐 **API Base URL:** `http://localhost:3000`
- 📖 **Interactive API Docs (Scalar UI):** `http://localhost:3000/docs`
- 🗄 **Prisma Studio (Local DB GUI):** `npx prisma studio` (available on `http://localhost:5555`)

---

## 🐳 2. Docker Workflow

The project uses an optimized multi-stage `Dockerfile` (builder stage with SWC + lean production image).

```bash
# Build the production image locally
docker build -t yazan420/linco-backend-app:latest .

# Run container locally with environment file
docker run -d \
  --name linco-backend \
  -p 3000:3000 \
  --env-file .env \
  yazan420/linco-backend-app:latest
```

> **Docker Hub Repository:** `yazan420/linco-backend-app`

---

## ☸️ 3. Kubernetes Deployment (MicroK8s)

All Kubernetes manifests are located in the `k8s/` directory.

### 3.1 Initial Setup & Secrets (One-Time)

Copy the secret templates and supply production credentials:

```bash
# Copy template files
cp k8s/00-firebase-secret.yaml.example k8s/00-firebase-secret.yaml
cp k8s/01-secrets.yaml.example          k8s/01-secrets.yaml

# Fill in your production values in both YAML files
```

### 3.2 One-Command Full Cluster Deploy

Once your secret YAML files are prepared, deploy the complete stack with a single command:

```bash
kubectl apply -f k8s/
```

---

### 3.3 Kubernetes Architecture & Manifest Overview

| Order | Manifest                  | Kind / Resource                   | Purpose                                                         |
| :---- | :------------------------ | :-------------------------------- | :-------------------------------------------------------------- |
| `00`  | `00-firebase-secret.yaml` | `Secret`                          | Firebase Admin SDK service account credentials                  |
| `01`  | `01-secrets.yaml`         | `Secret`                          | Database URLs, Stripe keys, JWT & Azure secrets                 |
| `02`  | `02-postgres.yaml`        | `StatefulSet` / `PVC` / `Service` | PostgreSQL 15 DB (2Gi Persistent Volume)                        |
| `03`  | `03-redis.yaml`           | `Deployment` / `Service`          | Redis cache & BullMQ task broker                                |
| `04`  | `04-backend.yaml`         | `Deployment` & `Service`          | App container + `run-migrations` init container + Prisma Studio |
| `05`  | `05-ingress.yaml`         | `Ingress` (NGINX)                 | Reverse proxy & routing for API & Studio                        |
| `06`  | `06-hpa.yaml`             | `HorizontalPodAutoscaler`         | Auto-scales backend (1–4 replicas, target 70% CPU)              |

---

### 3.4 Ingress Routing & Domains

| Domain               | Target Service    | Internal Port    | Max Body Size |
| :------------------- | :---------------- | :--------------- | :------------ |
| `api.lincolms.me`    | `backend-service` | `80` → `:3000`   | `50MB`        |
| `prisma.lincolms.me` | `prisma-service`  | `5555` → `:5555` | Standard      |

---

## 🔄 4. CI/CD Pipeline (GitHub Actions)

The automated deployment pipeline is configured in `.github/workflows/deploy.yml` and triggers automatically on every push to `main`:

```
Push to main ──► Buildx (with Cache) ──► Docker Hub Push ──► SSH into MicroK8s ──► Zero-Downtime Rollout
```

### Required GitHub Repository Secrets

Configure the following secrets in **Settings ➔ Secrets and variables ➔ Actions**:

- `DOCKERHUB_USERNAME`: Your Docker Hub username.
- `DOCKERHUB_TOKEN`: Docker Hub Personal Access Token.
- `SERVER_IP`: Production server IPv4 address.
- `SERVER_USER`: SSH username (e.g., `root` or `ubuntu`).
- `SSH_PRIVATE_KEY`: Private SSH key for server access.

---

## 🛠 5. Operations & Troubleshooting Cheat Sheet

### Rollout & Status

```bash
# Check deployment status
kubectl rollout status deployment/backend-deployment

# Trigger zero-downtime rolling restart (pulls latest image)
kubectl rollout restart deployment/backend-deployment
```

### Logs & Diagnostics

```bash
# Follow real-time backend logs
kubectl logs -f -l app=backend --tail=100

# View logs of the migration init-container if startup fails
kubectl logs -f deployment/backend-deployment -c run-migrations

# Check running Pods, Services, and Ingress
kubectl get pods,svc,ingress,hpa -o wide
```

---

## 📄 License

This project is proprietary software developed for the **Linco LMS Platform**. All rights reserved.
