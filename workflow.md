# 🗳️ Election Assistant — MVP Workflow

**Tech Stack:** Google Gemini · Firebase · Next.js · Tailwind CSS · Google Cloud  
**Goal:** Help users understand the election process, timelines, and steps interactively.

---

## 1. Product Vision

A conversational + visual assistant that guides citizens through the entire election lifecycle — from voter registration to result announcements — using AI-driven Q&A, interactive timelines, and step-by-step walkthroughs.

---

## 2. Core MVP Features

| Feature | Description | Priority |
|---|---|---|
| AI Chat (Gemini) | Natural language Q&A on election processes | P0 |
| Interactive Timeline | Visual, clickable election phases | P0 |
| Step-by-Step Guides | Voting steps, registration, candidate filing | P0 |
| Country/State Selector | Localized election info | P1 |
| Quick Answer Cards | FAQs surfaced proactively | P1 |
| Session History | Firebase-stored conversation history | P1 |
| Admin Panel | Manage election data & content | P2 |

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   USER BROWSER                      │
│              Next.js + Tailwind CSS                 │
│   ┌──────────────┐  ┌──────────┐  ┌─────────────┐  │
│   │  AI Chat UI  │  │ Timeline │  │  Step Guide │  │
│   └──────┬───────┘  └────┬─────┘  └──────┬──────┘  │
└──────────┼───────────────┼───────────────┼──────────┘
           │               │               │
           ▼               ▼               ▼
┌─────────────────────────────────────────────────────┐
│              Next.js API Routes (BFF)               │
│         /api/chat   /api/timeline   /api/steps      │
└──────────┬──────────────────────────────────────────┘
           │
     ┌─────┴──────────────────────────────┐
     │                                    │
     ▼                                    ▼
┌────────────────┐              ┌─────────────────────┐
│  Google Gemini │              │  Firebase           │
│  (AI Answers)  │              │  - Firestore (data) │
│  gemini-pro    │              │  - Auth (users)     │
└────────────────┘              │  - Analytics        │
                                └─────────────────────┘
                                         │
                                         ▼
                                ┌─────────────────────┐
                                │   Google Cloud Run  │
                                │   (Hosting)         │
                                └─────────────────────┘
```

---

## 4. Data Models (Firestore)

### `elections` collection
```json
{
  "id": "india-general-2024",
  "country": "India",
  "type": "General Election",
  "year": 2024,
  "phases": [...],
  "steps": [...],
  "faqs": [...]
}
```

### `phases` (sub-collection / array)
```json
{
  "id": "voter-registration",
  "title": "Voter Registration",
  "description": "...",
  "startDate": "2024-01-01",
  "endDate": "2024-02-28",
  "status": "completed | active | upcoming",
  "resources": ["url1", "url2"]
}
```

### `sessions` collection (chat history)
```json
{
  "sessionId": "uuid",
  "userId": "anonymous | uid",
  "country": "India",
  "messages": [
    { "role": "user", "content": "...", "timestamp": "..." },
    { "role": "assistant", "content": "...", "timestamp": "..." }
  ]
}
```

---

## 5. Page Structure (Next.js App Router)

```
app/
├── page.tsx                  # Landing / home
├── chat/
│   └── page.tsx              # AI Chat interface
├── timeline/
│   └── page.tsx              # Interactive election timeline
├── guides/
│   ├── page.tsx              # All guides index
│   ├── register/page.tsx     # How to register to vote
│   ├── voting-day/page.tsx   # Voting day steps
│   └── candidates/page.tsx   # How candidates file
├── api/
│   ├── chat/route.ts         # Gemini chat endpoint
│   ├── timeline/route.ts     # Election data endpoint
│   └── sessions/route.ts     # Save/load chat sessions
└── components/
    ├── ChatWindow.tsx
    ├── ElectionTimeline.tsx
    ├── StepCard.tsx
    ├── FAQCard.tsx
    └── CountrySelector.tsx
```

---

## 6. Gemini Integration Flow

```
User types question
        │
        ▼
POST /api/chat
        │
        ▼
Build system prompt:
  - Role: "Election process expert"
  - Context: Current election data from Firestore
  - Rules: Only answer election-related queries
  - Format: Return structured JSON { answer, relatedSteps[], sources[] }
        │
        ▼
Call Gemini Pro API (streaming preferred)
        │
        ▼
Parse response → stream to UI
        │
        ▼
Save conversation to Firebase session
```

### System Prompt Template
```
You are an expert election process guide for {COUNTRY}.
Current election context: {ELECTION_DATA}

Answer questions about:
- Voter registration process and deadlines
- Polling day procedures
- Candidate filing requirements
- Vote counting and result timelines
- Rights of voters

Rules:
- Only answer election-related questions
- Be factual and neutral — never express political opinions
- If unsure, say so and recommend official sources
- Format answers clearly with steps when applicable
- Always cite official sources where possible

Respond in JSON: { "answer": "...", "relatedTopics": [...], "officialLinks": [...] }
```

---

## 7. Development Phases

### Phase 1 — Foundation (Week 1–2)
- [ ] Next.js project setup with Tailwind
- [ ] Firebase project: Firestore + Auth configured
- [ ] Gemini API key connected and tested
- [ ] Basic chat UI (send message, receive response)
- [ ] Seed Firestore with one country's election data

### Phase 2 — Core Features (Week 3–4)
- [ ] Interactive Timeline component (clickable phases)
- [ ] Step-by-step guide pages (3 guides minimum)
- [ ] Country/election selector
- [ ] Session persistence with Firebase
- [ ] FAQ quick-cards on homepage

### Phase 3 — Polish & Deploy (Week 5–6)
- [ ] Streaming Gemini responses
- [ ] Mobile-responsive UI
- [ ] Error states and fallbacks
- [ ] Google Cloud Run deployment
- [ ] Firebase Analytics integration
- [ ] Basic SEO (metadata, OG tags)

---

## 8. API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/chat` | Send message to Gemini, get answer |
| GET | `/api/timeline?country=India` | Get election phases for country |
| GET | `/api/guides` | List all step-by-step guides |
| POST | `/api/sessions` | Create new chat session |
| GET | `/api/sessions/:id` | Load session history |

---

## 9. Environment Variables

```env
# Gemini
GEMINI_API_KEY=

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Next.js Public
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# App
NEXT_PUBLIC_DEFAULT_COUNTRY=India
```

---

## 10. Deployment (Google Cloud)

```
Build: next build
Deploy: Cloud Run (containerized Next.js)
Database: Firestore (managed, no infra needed)
Auth: Firebase Auth
CDN: Firebase Hosting (static assets) OR Cloud CDN
Monitoring: Google Cloud Logging + Firebase Analytics
```

### Dockerfile (minimal)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 11. MVP Success Metrics

| Metric | Target (Month 1) |
|---|---|
| Time to first answer | < 3 seconds |
| Questions answered accurately | > 90% (manual review) |
| Session completion rate | > 60% |
| Mobile usability score | > 85 (Lighthouse) |
| Daily active users | 100+ |

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Gemini gives incorrect election info | Ground responses with Firestore data as context |
| Data goes stale (election rules change) | Admin panel for content updates (Phase 2) |
| Multi-country complexity | Start with 1–2 countries, build schema to scale |
| Sensitive/political responses | Strict system prompt rules, no opinion generation |
| Cost overrun (Gemini API) | Cache frequent Q&A pairs in Firestore |

---

*Last updated: MVP Planning Phase*
