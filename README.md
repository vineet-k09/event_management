# Campus Event Organizer 

## The techstack

| Layer        | Technology                 | Purpose                                                                 |
|--------------|----------------------------|-------------------------------------------------------------------------|
| **Frontend** | [Next.js (App Router)](https://nextjs.org/) | React framework for server-side rendering, routing, and client interactivity |
|              | [Tailwind CSS](https://tailwindcss.com/)    | Utility-first CSS framework for styling and responsive design           |
| **Backend**  | [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers) | Server-side API endpoints inside the Next.js app |
| **Database** | [SQLite](https://www.sqlite.org/)           | Lightweight relational database (file-based, great for prototyping/dev) |
| **ORM**      | [Prisma](https://www.prisma.io/)            | Type-safe ORM for database modeling and querying                        |
| **Runtime**  | [Node.js](https://nodejs.org/)              | JavaScript runtime for executing the Next.js app                        |
| **Package Manager** | [npm](https://www.npmjs.com/) | Dependency management and scripts |

(Table layout is AI generated)

---

## How to start (Two methods)
1. Download the codebase ```(.zip)```, extract and open the **event_management** folder.
### OR
2. Clone the repo to your local dev environment and open it.
- Open ```powershell/cmd prompt```
- Execute 
```bash
npm i
```
_**Note:** Make sure you are in the same directory as ```package.json```_
- Type 
```bash
npm run dev
# First compile will be slow, look for compiling / in the console
```
- Open browser and go to URL <a href="https://localhost:3000/">https://localhost:3000/</a>

_**Note:** The project can be locally hosted as it is using SQLite which doesn't go well with vercel hosting, for hosting it on vercel or any other service we'll have to switch to postgreSQL or a similar alternative._
<br>

_**Note:** As it is SQLite the data is passed with the codebase, so there are no concerns about hosting database either (prevents clever-cloud or mongodb compass response delay)._

## DB Approach
<img src="screenshots/1.png" alt="schema" />

1. The approach was quite straight forward, with main goal to have one user to belong to atleast one university, and by default they will create events for that university
2. university --> user (1-n) --> events (1-n) --> registrations (1-n)
3. user --> registration (1-1)

Refer to DB setup [here](prisma/DB.md) or check out the ```/prisma``` folder

## API & CRUD
Very basic api routes are used for creating users, events etc.
Below code snippet shows **GET**, **POST** methods for users model.
```ts
//src/app/api/users/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/users
export async function GET() {
    const users = await prisma.user.findMany()
    return NextResponse.json(users)
}

// POST /api/users
export async function POST(req: Request){
    const body = await req.json()
    const user = await prisma.user.create({data:body})
    return NextResponse.json(user, {status: 201})
}
```
_**Note:** prisma here refers to the ```PrismaClient``` for quering during dev._

To populate the data simple API ```(/api/populate/)``` were used along with postman
<img src="screenshots/2.png" alt="postmanPNG" />

---

## Frontend

### Events
<img src="screenshots/3.png" alt="events"/>
<img src="screenshots/4.png" alt="events"/>
Event had this following type - 

```ts
type Event = {
    id: number;
    title: string;
    description: string;
    date: string;
    status: string;
    university: {
        name: string;
    };
};
```
While rest of the university and the event owner fields were avoided as they were not required to be shown. (Although they were sent throught the response).

The main logic of Event page relied on the ```getEventStatus(event: Event, regs: any[], userId: number)``` function
Conditionally the following situations were portrayed - 
- If registered -> Present/Absent
- If not registered -> render Register button
- If not registered -> post event date already -> Registration Over

***IMPORTANT:*** The ```user.role = "ADMIN"``` was used as the deciding factor if the user can change attendance or not, thus every event, irrespective of user specific university can be changed by the user. <br />
The above is not an ideal method, instead the ```user.id``` is matched with ```event.user.id``` to conditionally allow managing attendance

---

### Attendance
<img src="screenshots/5.png" alt="attendecce" />

This page mainly uses POST methods mapped with ```registration.user.id``` each registration has attendance column with boolean value for Present(True) and Absent(False)

```ts
const params = useParams();
const eventId = params.id;
```
The above let's us use the ```attendees/[id]/page.tsx``` browser route, allowing us to dynamically change the content of the page based on the event id passed. <br />
***Note:*** This, along with many other, page are ```user.id``` and ```user.role``` specific while its not asserted in this application, it's necessary to take care of loose ends, preventing user from accessing open end points.

---

## IMPORTANT
- ### ```.env``` is uploaded for the sole purpose of functionality, as the website is not going to be deployed.
- ### Make sure to download ```node_modules``` using 
```bash
npm run i
```
### or the app won't run. (Look for Module not found error).
- ### In case of database error, check the [DB.md](prisma/DB.md) here.

---

<div align="center">
&#123; &#125; with ♡ by <a href="https://github.com/vineet-k09">Vineet</a>.
</div>
