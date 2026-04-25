# API reference

Base URL: `${NEXT_PUBLIC_API_URL}`. All bodies are JSON unless noted.

## Health

### `GET /api/health`

```json
{ "ok": true, "service": "portfolio-api", "uptime": 1234.5 }
```

## Contact

### `POST /api/contact`

Body:

```json
{
  "name": "Ada",
  "email": "ada@example.com",
  "subject": "Hi",                // optional
  "message": "I've been admiring your work…",
  "website": ""                   // honeypot — leave empty
}
```

Responses: `201 { "ok": true, "id": "..." }` · `400` validation · `429` rate-limited.

## Analytics

### `POST /api/analytics/event`

Body:

```json
{
  "type": "pageview",             // required
  "path": "/",                    // optional
  "referrer": "https://google.com", // optional
  "sessionId": "uuid",            // optional but recommended
  "metadata": { "any": "json" }   // optional
}
```

Response: `204 No Content`.

## Projects

### `GET /api/projects?featured=true`

```json
{ "items": [ { "id": "...", "slug": "edge-inference-gateway", ... } ] }
```

### `GET /api/projects/:slug`

Returns a single project or `404`.

## AI

### `POST /api/ai/chat`

Body:

```json
{
  "sessionId": "uuid",            // optional
  "conversationId": "cuid",       // optional, returned by the server on first call
  "messages": [
    { "role": "user", "content": "What was your hardest scaling challenge?" }
  ]
}
```

Response:

```json
{ "conversationId": "cuid", "reply": "..." }
```

Errors: `503` AI not configured · `429` rate-limited.

### `POST /api/ai/recommendations`

Body:

```json
{ "interests": ["ai", "graph"], "limit": 3 }
```

Response:

```json
{
  "items": [
    { "id":"...", "slug":"graph-observability", "title":"...", "tagline":"...", "tags":[...], "score": 2 }
  ]
}
```

## Admin

### `POST /api/admin/login`

Body:

```json
{ "email": "admin@example.com", "password": "your-password" }
```

Response: `{ "token": "...", "expiresIn": 43200 }`. Use as `Authorization: Bearer <token>` on the routes below.

### `GET /api/admin/messages?limit=50&cursor=<id>`

Returns `{ items: ContactMessage[], nextCursor: string | null }`.

### `POST /api/admin/messages/:id/read`

Marks a message as read. Returns the updated message.

### `GET /api/admin/analytics/summary`

```json
{
  "windowDays": 30,
  "total": 1234,
  "byType": [{ "type": "pageview", "count": 700 }, ...],
  "byDay": [{ "day": "2026-04-01T00:00:00Z", "count": 42 }, ...]
}
```
