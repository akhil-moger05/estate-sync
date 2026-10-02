# EstateSync

Property paperwork made easy. Users apply online, Admin checks, Agents do the work.

**Stack:** React + Vite + Tailwind (frontend) and PocketBase (backend and database).

## Roles
| Role  | What they do |
|-------|--------------|
| User  | Registers, applies for a service, uploads a document, tracks progress |
| Admin | Approves agents, sends requests to the agent pool, reads support tickets |
| Agent | Accepts jobs, updates progress, marks job completed |

Flow: `User applies -> Admin reviews -> Agent accepts -> Progress updates -> Completed`
The user gets a notification at every step.

## Run on your computer

You need Node.js (18 or newer) and the PocketBase file.

**1. Install the frontend**
```
npm install
```

**2. Download PocketBase**
Go to https://pocketbase.io/docs and download it for your system.
Unzip it and put the `pocketbase` file inside the `pocketbase` folder of this project.

**3. Start PocketBase (keep this window open)**
```
cd pocketbase
./pocketbase serve          (Windows:  pocketbase.exe serve)
```
Make your own super admin (only once):
```
./pocketbase superuser upsert you@example.com YourStrongPass123
```

**4. Create tables and demo accounts (only once)**
Open a new terminal in the project folder.

Mac / Linux:
```
PB_ADMIN_EMAIL=you@example.com PB_ADMIN_PASSWORD=YourStrongPass123 npm run setup-db
```
Windows PowerShell:
```
$env:PB_ADMIN_EMAIL="you@example.com"; $env:PB_ADMIN_PASSWORD="YourStrongPass123"; npm run setup-db
```

**5. Start the website**
```
npm run dev
```
Open http://localhost:5173

## Demo accounts
| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@estatesync.com | Admin@12345 |
| Agent | agent@estatesync.com | Agent@12345 |
| User  | user@estatesync.com  | User@12345  |

Change these passwords before showing the project to many people.
Test OTP in Register is `1234` (demo only, no real SMS).

## Demo script for college (5 minutes)
1. Login as **User**, open Services, apply for "Khata Transfer" with a file.
2. Login as **Admin**, press "Send to Agent Pool".
3. Login as **Agent**, accept the job, change progress to Completed.
4. Login as **User** again, see the status and Notifications.
5. Show Register as Agent, then approve it in the Admin panel.

## Upload to GitHub
```
git init
git add .
git commit -m "EstateSync first version"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/estate-sync.git
git push -u origin main
```
First create an empty repo called `estate-sync` on github.com.
The `.gitignore` already hides `node_modules`, `.env`, and your database.

## Host online
1. **Backend:** PocketBase needs a server that stays on (it is one file plus a data folder).
   Use a small VPS, Fly.io, Railway, or a PocketBase host. Check which free plan is available today.
   Run `npm run setup-db` once with `PB_URL=https://your-pocketbase-link` set.
2. **Frontend:** On vercel.com or netlify.com, import the GitHub repo.
   Add this setting: `VITE_PB_URL = https://your-pocketbase-link`
   Build command `npm run build`, output folder `dist`.
3. If you only need it for college, running on your laptop (steps above) is the safest.

## Folder map
```
src/
  pages/        all screens (Home, Login, dashboards...)
  components/   Navbar, ProtectedRoute
  lib/          pb.js (database link), notify.js (notifications)
  utils/        servicesData.js (the 20 services)
pocketbase/setup.mjs   creates tables, rules, demo accounts
```
