# Campus Event Mangement 

## Getting Started
The techstack will include the following

| Layer        | Technology                 | Purpose                                                                 |
|--------------|----------------------------|-------------------------------------------------------------------------|
| **Frontend** | [Next.js (App Router)](https://nextjs.org/) | React framework for server-side rendering, routing, and client interactivity |
|              | [Tailwind CSS](https://tailwindcss.com/)    | Utility-first CSS framework for styling and responsive design           |
| **Backend**  | [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers) | Server-side API endpoints inside the Next.js app |
| **Database** | [SQLite](https://www.sqlite.org/)           | Lightweight relational database (file-based, great for prototyping/dev) |
| **ORM**      | [Prisma](https://www.prisma.io/)            | Type-safe ORM for database modeling and querying                        |
| **Runtime**  | [Node.js](https://nodejs.org/)              | JavaScript runtime for executing the Next.js app                        |
| **Package Manager** | [npm](https://www.npmjs.com/) | Dependency management and scripts |

---

## How to start (Two methods)
1. Download the codebase ```(.zip)```, extract and open the **event_management** folder.
### OR
2. Clone the repo to your local dev environment and open it.
- Open ```powershell/cmd prompt```
- Type 
```bash
npm run dev
```
- Open browser and go to URL <a href="https://localhost:3000/">https://localhost:3000/</a>

**Note:** The project can be locally hosted as it is using SQLlite which doesn't go well with vercel hosting, for hosting it on vercel or any other service we'll have to switch to postgreSQL or a similar alternative.
**Note:** As it is SQLlite the data is passed with the codebase, so there are no concerns about hosting database either (prevents clever-cloud or mongodb compass response delay).

## DB Approach