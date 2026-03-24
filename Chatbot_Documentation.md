# Elparaiso Garden Kisii — AI Chatbot Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend — Edge Function](#backend--edge-function)
4. [Frontend — React Component](#frontend--react-component)
5. [Data Flow](#data-flow)
6. [UI Components](#ui-components)
7. [Streaming Implementation](#streaming-implementation)
8. [Quick Actions & Suggestions](#quick-actions--suggestions)
9. [Error Handling](#error-handling)
10. [Configuration & Environment](#configuration--environment)

---

## 1. Overview

The chatbot is a **floating AI assistant** that acts as a virtual waiter for Elparaiso Garden Kisii. It is powered by **Google Gemini 1.5 Flash** via a Supabase Edge Function, providing real-time streamed responses about the restaurant's menu, prices, location, hours, and reservation guidance.

**Key Capabilities:**
- Answer menu and pricing questions (with full menu data in the system prompt)
- Guide customers to make reservations
- Provide direct Call and WhatsApp links
- Offer food and drink recommendations
- Stream responses token-by-token for a smooth conversational feel

---

## 2. Architecture

```
┌─────────────────────┐
│   React Frontend    │
│  (Chatbot.tsx)      │
│                     │
│  User types message │
│         │           │
│         ▼           │
│  fetch() POST ──────┼──────► Supabase Edge Function
│  with SSE stream    │        supabase/functions/chat/index.ts
│         │           │              │
│         │           │              ▼
│  Read stream ◄──────┼─────  Google Gemini API
│  Token-by-token     │       (gemini-1.5-flash)
│         │           │       streamGenerateContent
│         ▼           │
│  Update UI in       │
│  real-time          │
└─────────────────────┘
```

**Tech Stack:**
- **Frontend:** React 18, TypeScript, Framer Motion, react-markdown
- **Backend:** Deno (Supabase Edge Function)
- **AI Model:** Google Gemini 1.5 Flash (via `streamGenerateContent` SSE endpoint)
- **Communication:** Server-Sent Events (SSE) streaming

---

## 3. Backend — Edge Function

**File:** `supabase/functions/chat/index.ts`

### 3.1 System Prompt

The edge function contains a comprehensive **system prompt** that defines the chatbot's personality and knowledge base:

- **Role:** Friendly virtual assistant / virtual waiter
- **Business Info:** Name, location (Kisii, Kenya), hours (24/7), phone, WhatsApp
- **Full Menu:** Grills, Drinks, and Quick Bites with KES prices and popular item markers (⭐)
- **Payment Methods:** M-Pesa, Visa, Mastercard
- **Behavioral Rules:**
  - Warm, friendly, conversational tone
  - Use emojis sparingly (🍖🍹🔥)
  - Recommend popular items
  - Direct to reservations section, phone, or WhatsApp for bookings
  - Admit when unsure and suggest calling/WhatsApp

### 3.2 API Call to Gemini

The function maps incoming messages to Gemini's expected format:
- `"assistant"` role → `"model"` (Gemini's convention)
- `"user"` role → `"user"`

Each message's content is wrapped as `{ parts: [{ text: content }] }`.

**Request to Gemini:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=<API_KEY>
```

**Payload:**
```json
{
  "contents": [/* mapped messages */],
  "systemInstruction": { "parts": [{ "text": "<SYSTEM_PROMPT>" }] },
  "generationConfig": {
    "temperature": 0.7,
    "topP": 0.8,
    "topK": 40
  }
}
```

- **`temperature: 0.7`** — Moderately creative responses
- **`topP: 0.8`** — Nucleus sampling for balanced variety
- **`topK: 40`** — Considers top 40 tokens at each step

### 3.3 CORS Headers

The function includes permissive CORS headers allowing cross-origin requests with the required Supabase client headers. `OPTIONS` preflight requests return immediately with these headers.

### 3.4 Error Handling (Backend)

| Status | Meaning | Response |
|--------|---------|----------|
| 429 | Rate limited by Gemini | `"Rate limit reached. Please wait a moment."` |
| Other non-OK | Gemini API error | `"AI service error"` |
| Exception | Internal failure | Error message with 500 status |

The raw SSE stream from Gemini is **proxied directly** back to the frontend (`return new Response(response.body, ...)`), so no re-parsing happens server-side.

---

## 4. Frontend — React Component

**File:** `src/components/Chatbot.tsx`

### 4.1 State Management

| State Variable | Type | Purpose |
|---------------|------|---------|
| `open` | `boolean` | Whether the chat window is visible |
| `messages` | `Message[]` | Full conversation history (`{ role, content, timestamp }`) |
| `input` | `string` | Current text input value |
| `loading` | `boolean` | Whether a response is being streamed |
| `hasNewMessage` | `boolean` | Shows notification badge when chat is closed |

### 4.2 Message Type

```typescript
type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
```

### 4.3 Initial State

The chat opens with a pre-seeded welcome message from the assistant introducing itself as the virtual waiter and inviting the user to ask about menu, prices, reservations, etc.

---

## 5. Data Flow

### Step-by-Step Message Flow:

1. **User types message** → `input` state updates
2. **User submits** (Enter key or Send button) → `sendMessage(text)` called
3. **User message added** to `messages` array immediately (optimistic UI)
4. **Input cleared**, `loading` set to `true`
5. **POST request** sent to edge function with full conversation history (role + content only, no timestamps)
6. **SSE stream** begins — tokens arrive incrementally
7. **Each token** is appended to `assistantSoFar` string
8. **State updated** — either creates a new assistant message or updates the last one
9. **Stream ends** → `loading` set to `false`
10. **If chat is closed** during response → `hasNewMessage` badge appears

### Conversation Context:

The **entire conversation history** is sent with every request, enabling the AI to maintain context across the conversation. Messages are mapped to `{ role, content }` before sending (timestamps stripped).

---

## 6. UI Components

### 6.1 Floating Action Button (FAB)
- Fixed position: bottom-right corner (`bottom-6 right-6`)
- Gold gradient background (`gold-gradient` class)
- Animated icon swap between `MessageCircle` ↔ `X` using `AnimatePresence`
- **Pulse ring animation** when closed (draws attention)
- **Red notification badge** when `hasNewMessage` is true and chat is closed
- Spring animations on hover (scale 1.08) and tap (scale 0.92)

### 6.2 Chat Window
- Appears with spring animation (opacity, translateY, scale)
- **Responsive width:** `calc(100vw - 1.5rem)` on mobile, `400px` on sm+ screens
- **Height:** `min(75vh, 600px)`
- Rounded corners, border with primary color accent, deep shadow

### 6.3 Header
- Gold gradient background
- Avatar with "EP" initials and green online indicator dot
- Title: "Elparaiso Assistant" with "Online • Ready to help" subtitle
- Close button (X icon)
- **Quick action bar** with 4 pill buttons: Call, WhatsApp, Location, 24/7 Open

### 6.4 Message Bubbles
- **User messages:** Gold gradient background, rounded with bottom-right corner less rounded
- **Assistant messages:** Muted background with border, bottom-left corner less rounded, includes "EP" avatar
- Markdown rendering for assistant messages via `react-markdown`
- Timestamps displayed below each message in 9px muted text
- Fade-in + slide-up animation on new messages

### 6.5 Typing Indicator
- Three bouncing dots with staggered animation delays (0ms, 150ms, 300ms)
- Shown when `loading` is true
- Includes the assistant avatar for visual consistency

### 6.6 Quick Suggestions
- Shown only when conversation has ≤2 messages and not loading
- 5 suggestion chips with emoji labels:
  - 🍖 Recommendations → "What do you recommend?"
  - 📋 View Menu → "Show me the menu"
  - 📅 Book a Table → "I'd like to book a table"
  - 📍 Location → "Where are you located?"
  - 💰 Prices → "What are your prices?"
- Clicking a chip sends the associated text as a user message
- Fade-in animation with 0.3s delay

### 6.7 Input Area
- Text input with muted background and border
- Send button with gold variant, disabled when loading or input is empty
- "Powered by AI • Elparaiso Garden Kisii" footer text

---

## 7. Streaming Implementation

The frontend implements **SSE (Server-Sent Events) parsing** to render tokens as they arrive:

### Parsing Logic:

```
1. Read chunks from ReadableStream via reader.read()
2. Decode bytes to text, append to textBuffer
3. Process line-by-line (split on "\n"):
   a. Skip empty lines and SSE comments (lines starting with ":")
   b. Skip non-data lines (must start with "data: ")
   c. Check for "[DONE]" signal → stop
   d. Parse JSON from "data: {json}" lines
   e. Extract: parsed.choices[0].delta.content
   f. If content exists → append to assistantSoFar → update state
4. On JSON parse failure → put line back in buffer (partial chunk)
5. Continue until reader signals done
```

### State Update Strategy:

The component uses a smart update pattern to avoid creating duplicate assistant messages:

```typescript
setMessages((prev) => {
  const last = prev[prev.length - 1];
  // If last message is already an assistant message beyond the user's messages
  if (last?.role === "assistant" && prev.length > allMessages.length) {
    // Update existing assistant message content
    return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
  }
  // Otherwise, create new assistant message
  return [...prev, { role: "assistant", content: assistantSoFar, timestamp: new Date() }];
});
```

This ensures only **one assistant message** is created per response, updated progressively as tokens stream in.

---

## 8. Quick Actions & Suggestions

### Quick Actions (Header Bar)

| Action | Behavior |
|--------|----------|
| **Call** | Opens phone dialer: `tel:+254700000000` |
| **WhatsApp** | Opens WhatsApp chat: `https://wa.me/254700000000?text=Hello...` |
| **Location** | Scrolls to the `#menu` section and closes chat |
| **24/7 Open** | Non-interactive badge (green styling, `cursor-default`) |

### Quick Suggestions (Chat Body)

Displayed as tappable chips when the conversation is fresh (≤2 messages). Each sends a pre-defined message that the AI responds to naturally based on its system prompt knowledge.

---

## 9. Error Handling

### Frontend Error Recovery:

When the fetch request fails or the stream encounters an error:
- A fallback assistant message is displayed with:
  - Apology text
  - Direct **phone link** (clickable `tel:` link)
  - Direct **WhatsApp link** (clickable `wa.me` link)
- `loading` is set to `false`
- The user can continue chatting (retry by sending another message)

### Backend Error Scenarios:

| Scenario | Handling |
|----------|----------|
| Missing `GEMINI_API_KEY` | Throws error → 500 response |
| Gemini returns 429 | Returns 429 with rate limit message |
| Gemini returns other error | Logs error, returns generic error message |
| General exception | Returns 500 with error details |

---

## 10. Configuration & Environment

### Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `VITE_SUPABASE_URL` | `.env` (frontend) | Base URL for edge function calls |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` (frontend) | Authorization header for edge function |
| `GEMINI_API_KEY` | Supabase secrets (backend) | Google Gemini API authentication |

### Edge Function URL

Constructed dynamically:
```typescript
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
```

### Dependencies Used

| Package | Purpose |
|---------|---------|
| `react` | Core UI framework |
| `framer-motion` | Animations (FAB, chat window, messages) |
| `react-markdown` | Markdown rendering in assistant messages |
| `lucide-react` | Icons (MessageCircle, X, Send, Phone, MapPin, Clock, Sparkles) |
| `@radix-ui/react-avatar` | Avatar component |
| `@radix-ui/react-scroll-area` | Scrollable message area |

### Auto-Scroll Behavior

- `scrollToBottom()` is called whenever `messages` array changes
- Uses `setTimeout(..., 50)` to ensure DOM has updated before scrolling
- `scrollRef` is attached to the message container div
- Input auto-focuses when chat window opens

---

## Summary

The chatbot is a well-architected, two-tier system:

1. **Backend (Edge Function):** Proxies requests to Gemini with a rich system prompt containing the full restaurant knowledge base. Streams SSE responses directly back to the client with no intermediate processing.

2. **Frontend (React Component):** A polished, animated chat UI that parses SSE streams token-by-token, renders markdown responses, and provides quick-access actions (Call, WhatsApp, Menu scroll, Reservations scroll) for a seamless customer experience.

The design prioritizes **real-time feel** (streaming), **accessibility** (direct action buttons), and **graceful degradation** (fallback contact info on errors).
