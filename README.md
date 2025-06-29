# 🌍 MapApp - Peer-to-Peer Mapping & Reporting Platform

## 🚀 Project Overview

This app is a collaborative, real-time map platform designed to allow users to submit, confirm, and manage location-based reports. The platform supports features such as role-based access control, live map updates via Socket.IO, user-generated report submissions, voting mechanisms, and customizable map settings for admin users.

The goal is to create a trustworthy system for reporting and confirming data points on a shared map. This could be used for community tracking, sightings, hazard awareness, or crowdsourced alerts. You can find screenshots of the current state of the project at the bottom of this readme.

---

## 🧱 Tech Stack

- **Frontend**: Next.js App Router, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Next.js API routes + server actions
- **Authentication**: [better-auth](better-auth.com)
- **Database**: PostgreSQL (via Prisma)
- **Real-time Communication**: Socket.IO (with custom server)
- **Map Rendering**: `react-map-gl` with MapLibre + MapTiler (customizable)
- **Form Management**: `react-hook-form` + `zod`
- **UI Components**: shadcn/ui + Radix UI + Lucide Icons

---

## 📁 Project Structure

```
│── actions → Server actions (e.g., updateSettings, postReport)
│── app
│   ├── (pages)                 → All pages except "/"
│   │   ├── admin
│   │   ├── moderator
│   │   ├── sign-in
│   │   └── sign-up
│   ├── api
│   │   ├── auth
│   │   └── global-settings
│   ├── components              → Custom components
│   │   ├── auth
│   │   ├── layout
│   │   ├── map
│   │   ├── settings
│   ├── globals.css
│   ├── layout.tsx
│   ├── lib                     → Auth client and utilities
│   ├── page.tsx
│── components                  → Shadcn components
│   └── ui
│── db.ts
│── lib
│   └── utils.ts
│── middleware.ts               → Route access logic
│── prisma
│   └── schema.prisma
├── public
```

---

## 🔐 Access & Permissions

Permissions are controlled by a combination of:

- Middleware-based route protection (`middleware.ts`)
- Role-based access control (`requireRole` server action)
- Global Settings:
  - `registrationMode`: open | invite | closed
  - `mapOpenToVisitors`: boolean
  - `submitReportsOpen`: boolean
  - `votesOpenToVisitors`: boolean

Invite-based registration is supported and validated before calling the BetterAuth signUp function.

---

## 🔄 Live Features

- **Map updates in real-time** with Socket.IO
- **Report voting & confirmation logic**
- **Editable reports by owner/admin/mods**
- **Custom map settings** like bounds, zoom, and mapStyle
- **User roles** admin, moderator, user
- **Registration flows** with invite link support
- **Public/private map modes** depending on settings

---

## 🛠 Current TODOs (as of onboarding)

### Security

- [ ] Ensure all server actions are protected by `requireRole`
- [ ] Ensure API route protection
- [ ] Make sure user input is sanitized from both a typescript and a security perspective
- [ ] Add email confirmations for new users
- [ ] Add optional feature to allow users to register with just a username, if email address privacy is a concern

### Functionality

- [x] More role management tools (e.g., promote to mod)
- [x] Bulk changes to user modifications on the admin panel
- [x] Add filter/sort options to user table
- [x] Add blog functionality with rich text editor and minimal CMS
- [x] Add easily editable About page
- [ ] Export historical map data as CSV (or other?)
- [x] Add Markers admin settings section so admin can set categories, pictures, and fields
- [x] Update schema to reflect difference between report item that has left vs incorrect report
- [ ] Filter reports by type, etc.
- [x] Add Activity updates pane

### UI

- [x] Admin user panel UI improvements
- [x] Standardize UI across site
- [x] Make sure "Home" button accessible in admin panel
- [x] Make mobile friendly
- [x] Make sure animations work for adding and removing pins, and on load. On load, pins should drop in staggered.
- [ ] Fine tune WYSIWYG editor and about/blog UI

### Other

- [ ] Make thorough documentation
- [ ] Make deployable using docker containers

---

## 👥 Onboarding Notes for Collaborators

To get started:

### 1. Clone the repo and install dependencies:

```bash
git clone https://github.com/openmapapp/mapapp.git
cd mapapp
npm install
```

### 2. Set up your `.env` file. DB information is required twice, first for BetterAuth to access, second (at the bottom) for prisma.

```bash
# BetterAuth config
BETTER_AUTH_SECRET= #Create a secret 32-character key for this app
BETTER_AUTH_URL=http://localhost:3000 #Base URL of your app

# PostgreSQL connection info (used by BetterAuth)
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DB_PORT=5432

# If using Mapbox API, set Mapbox API key here
NEXT_PUBLIC_MAPTILER_KEY=

# Prisma Database info
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
```

You can change these creds to anything you want, but the Podman setup below uses them, so update accordingly.

### 3. Set Up PostgreSQL with Podman and Import Pre-Populated Database

Instead of seeding manually, this project uses a complete .sql database snapshot. To load it:

#### Step 3.1: Make sure Podman is installed

Install from: https://podman.io/getting-started/installation

#### Step 3.2: Start PostgreSQL in Podman

```bash
podman run -d \
  --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  docker.io/library/postgres:latest
```

#### Step 3.3 : Import the Database Dump

Find the full_db.sql file in the project root:

```bash
  podman cp full_dump.sql postgres:/full_dump.sql
  podman exec -it postgres bash
  psql -U postgres -d postgres -f /full_dump.sql
  exit
```

This creates all tables and inserts data including GlobalSettings, User, Account, and ReportType

#### Step 3.4: Confirm Import (Optional)

```bash
  podman exec -it postgres psql -U postgres -d postgres -c '\dt'
```

### 4. Run websocket server (Optional, but Recommended)

This allows real-time updates of new posts without refreshing.

Clone and run this project:
https://github.com/openmapapp/websocket.
You can start before or after running MapApp - both work.

### 5. Optional: Run TileServer-GL

#### Option A: Use Maptiler's Free API

Simply set NEXT_PUBLIC_MAPTILER_KEY in your .env and that's it.

#### Option B: Run your Own Tile Server

Follow [TileServer-GL's instructions](https://github.com/maptiler/tileserver-gl) using Docker. Recommend for Linux/Windows; a bit finicky on macOS with apple silicon. Then update the MapComponent.tsx file by uncommenting line 99 and commenting out line 100. If you go this route, you can use free vector tiles of your area from [maptiler](https://data.maptiler.com/downloads/north-america/).

### 6. Run the development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000`

### 7. Default Login (Optional)

If you used the provided SQL dump, a default test user is already created:

```makefile
Email: test@test.com
Password: thisisatest
```

If you have any issues, let me know!

## Screenshots

Homepage showing the site's main features
![Homepage with features](./screenshots/MapWithFeatures.png)

How a user submits a report
![Report submission form](./screenshots/SubmitReport.png)

Access options set by the site admins
![Access settings panel](./screenshots/AccessSettingsPanel.png)

Admin panel to set report options
![Report type settings panel](./screenshots/ReportTypesPanel.png)

Panel for admins to create a new report type
![Create report type form](./screenshots/CreateReportPanel.png)

Admin panel for changing map defaults
![Panel for admins to set map defaults](./screenshots/MapSettingsPanel.png)

Admin panel for managing users
![User settings panel](./screenshots/UserSettingsPanel.png)
