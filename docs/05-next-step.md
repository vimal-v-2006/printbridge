# 05 - Next Step

## Recommended next build step

Start with `shared/` and `backend/` first.

Why:
- the whole app depends on stable contracts
- printer agents need a backend to register against
- frontend becomes much easier once API contracts exist

## Immediate implementation order

1. Define shared types:
   - Agent
   - Printer
   - PrintJob
   - PrintSettings
2. Create backend API skeleton
3. Add agent registration flow
4. Add printer sync flow
5. Add dummy frontend against mock data

## Suggested MVP stack decision

- Frontend: Next.js + Tailwind
- Backend: Fastify + TypeScript
- Agent: Node.js + TypeScript
- Shared: TypeScript + Zod
- Database: PostgreSQL

This gives a modern, clean, maintainable setup with strong type sharing.
