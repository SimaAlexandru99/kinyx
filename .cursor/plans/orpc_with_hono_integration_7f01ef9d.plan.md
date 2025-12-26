---
name: ORPC with Hono Integration
overview: Implement ORPC in Next.js 16 using Hono as the request handler layer, with Better Auth session extraction via Hono middleware and TanStack Query integration. Hono provides better middleware composition, type safety, and a more ergonomic API layer than raw Next.js route handlers.
todos: []
---

# ORPC +

Hono Implementation for Next.js 16 with Better Auth

## Why Hono?

Hono adds significant value to this stack:

- **Better Middleware**: More powerful middleware composition than raw Next.js handlers
- **Type Safety**: Excellent TypeScript inference for context and request/response types
- **Performance**: Lightweight and edge-compatible
- **ORPC Adapter**: ORPC has native Hono adapter support (`@orpc/server/hono`)
- **Better DX**: More expressive API than raw Next.js route handlers
- **Flexibility**: Can handle complex routing, middleware chains, and error handling elegantly

## Architecture Overview

```javascript
┌─────────────────┐
│  Client/React   │
│                 │
│  useQuery(      │
│    orpc.user    │
│    .me()        │
│  )              │
└────────┬────────┘
         │
         │ HTTP POST /api/rpc
         │
┌────────▼──────────────────────────┐
│  app/api/rpc/[[...rest]]/route.ts │
│  ──────────────────────────────── │
│  Next.js Route Handler            │
│  → Uses toNextJSHandler(Hono app) │
└────────┬──────────────────────────┘
         │
         │ Hono Handler
         │
┌────────▼──────────────────────────┐
│  server/rpc/app.ts                │
│  ──────────────────────────────── │
│  Hono App Instance                │
│  ┌─────────────────────────────┐  │
│  │ Middleware:                 │  │
│  │ 1. Extract session via      │  │
│  │    auth.api.getSession()    │  │
│  │ 2. Set session in context   │  │
│  └─────────────────────────────┘  │
│  ┌─────────────────────────────┐  │
│  │ ORPC Hono Adapter           │  │
│  │ → Handles RPC calls         │  │
│  └─────────────────────────────┘  │
└────────┬──────────────────────────┘
         │
         │ Procedure Execution
         │
┌────────▼──────────────────────────┐
│  server/rpc/router.ts             │
│  ──────────────────────────────── │
│  ORPC Router with procedures      │
│  - Context includes session       │
│  - Type-safe inputs/outputs       │
└───────────────────────────────────┘
```



## Implementation Steps

### 1. Install Hono

Add Hono to dependencies:

```bash
npm install hono
```



### 2. Create ORPC Router with Context

Create `server/rpc/router.ts`:

- Define context type with session (nullable for public procedures)
- Create router using `createRouter` from `@orpc/server`
- Add context helper to extract session from context
- Create example procedures:
- `user.me` - Get current authenticated user
- `user.hello` - Simple example procedure
- `post.list` - List posts (with optional auth)
- `post.create` - Create post (authenticated)

### 3. Create Hono App with ORPC Adapter

Create `server/rpc/app.ts`:

- Import Hono from `hono`
- Create Hono app instance
- Add middleware to extract Better Auth session:
- Use `auth.api.getSession()` with Hono request headers
- Store session in Hono context (`c.set('session', session)`)
- Use ORPC's Hono adapter to mount the router:
- Import from `@orpc/server/hono`
- Use `orpcToHono(router, { getContext })` pattern
- Pass context function that extracts session from Hono context

### 4. Create Next.js API Route Handler

Create `app/api/rpc/[[...rest]]/route.ts`:

- Use `toNextJSHandler` from `hono/nextjs` to convert Hono app to Next.js handler
- Export POST handler (ORPC uses POST for all RPC calls)
- The Hono app handles all the logic

### 5. Create ORPC Client

Create `lib/rpc-client.ts`:

- Create ORPC client using `createORPCClient` from `@orpc/client`
- Use `RPCLink` with fetch pointing to `/api/rpc`
- Export typed client for use in components

### 6. Create TanStack Query Utilities

Create `lib/rpc-query.ts`:

- Use `createORPCReactQueryUtils` from `@orpc/tanstack-query`
- Create utilities that integrate ORPC with TanStack Query
- Export `orpc` object for use in React components

### 7. Example Usage Component

Create example showing:

- How to use ORPC procedures with TanStack Query
- Type-safe queries with autocomplete
- Error handling patterns

## File Structure

```javascript
lib/
  rpc-client.ts        # ORPC client instance
  rpc-query.ts         # TanStack Query integration
server/
  rpc/
    router.ts          # ORPC router with procedures
    app.ts             # Hono app with middleware and ORPC adapter
    context.ts         # Type definitions for context (optional)
app/
  api/
    rpc/
      [[...rest]]/
        route.ts       # Next.js route handler (thin wrapper around Hono)
```



## Key Design Decisions

1. **Hono as Request Handler**: Hono provides better middleware composition and type safety than raw Next.js handlers. The route handler becomes a thin wrapper.
2. **Session Extraction in Hono Middleware**: Session is fetched once in Hono middleware using `auth.api.getSession()` with Hono's request headers, then stored in Hono context. This is cleaner than doing it in the route handler.
3. **ORPC Hono Adapter**: Use `@orpc/server/hono` adapter which provides native integration between ORPC and Hono, ensuring proper context passing.
4. **Context Flow**: 

- Hono middleware extracts session → stores in `c.set('session', session)`
- ORPC adapter's `getContext` function reads from Hono context
- Procedures receive typed context with session

5. **Type Safety**: Full end-to-end type safety:

- Hono context types
- ORPC router context types
- Client-side TypeScript inference
- React Query hook types

6. **Better Auth Integration**: Better Auth's `auth.api.getSession()` accepts a Headers object, which Hono provides through `c.req.raw.headers`.

## Hono Benefits in This Stack

1. **Middleware Chain**: Easy to add CORS, logging, rate limiting, etc.
2. **Error Handling**: Better error handling with Hono's error handling middleware
3. **Context Sharing**: Clean context passing between middleware and handlers
4. **Type Inference**: Excellent TypeScript support for context and requests
5. **Edge Compatible**: Can run on edge runtime if needed
6. **Testing**: Easier to test Hono apps independently

## Example Procedures

- **Public**: `hello()` - No auth required
- **Authenticated**: `user.me()` - Returns current user, requires session
- **Optional Auth**: `post.list()` - Works with or without auth
- **Authenticated**: `post.create()` - Requires session

## Migration Path

If you want to start without Hono, you can:

1. First implement ORPC with raw Next.js handlers (original plan)
2. Later migrate to Hono by:

- Installing Hono