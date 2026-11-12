# Blue Harbor Task Manager

A compact full-stack task manager built for the Junior Full Stack Developer assessment.

> Work in progress — milestone 1: repository and application skeleton. Task CRUD functionality is not implemented yet.

## Stack
- `api/`: NestJS REST API (TypeScript), planned Prisma + SQLite storage
- `web/`: Next.js App Router (TypeScript), planned shadcn/ui components
- npm as package manager

## Prerequisites
- Node.js 22 LTS (use `.nvmrc` if you have nvm)
- npm 10+

## Getting started (milestone 1)
In separate terminals, from the repository root:

```bash
cd api
npm install
npm run start:dev
```

```bash
cd web
npm install
npm run dev
```

Then open http://localhost:3000. The API health endpoint is http://localhost:3001/health.

> Note: npm dependencies could not be installed or tested in the file-generation environment due to unavailable package-registry access. Run the install and smoke tests before committing this milestone.

## Planned API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/tasks` | List tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

Task fields: `id`, required `title`, optional `description`, `status` (`TODO`, `IN_PROGRESS`, `DONE`), optional `dueDate`, and `createdAt`.

## Milestones
- [ ] 1. Bootstrap `/api` and `/web`, smoke-test local startup, commit
- [ ] 2. Set up Prisma + SQLite schema and migration, commit
- [ ] 3. Build task CRUD endpoints, commit
- [ ] 4. Add validation, error handling, and tests, commit
- [ ] 5. Create task table and badges with shadcn/ui, commit
- [ ] 6. Implement create/edit dialogs, commit
- [ ] 7. Add delete confirmation, toast, loading/error states, commit
- [ ] 8. Add filters and due-date sorting, commit
- [ ] 9. Verify fresh clone, finalize documentation, commit

## How I used AI
AI assistance was used to plan the repository structure and draft the initial boilerplate. The developer will review and test each generated component, implement and adjust the application, and be prepared to explain it during review. Update this section with the actual tools used and changes made before submission.
