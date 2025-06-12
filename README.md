# 🌍 MapApp - Peer-to-Peer Mapping & Reporting Platform

## 🚀 Project Overview

This app is a collaborative, real-time map platform designed to allow users to submit, confirm, and manage location-based reports. The platform supports features such as role-based access control, live map updates via Socket.IO, user-generated report submissions, voting mechanisms, and customizable map settings for admin users.

The goal is to create a trustworthy system for reporting and confirming data points on a shared map. This could be used for community tracking, sightings, hazard awareness, or crowdsourced alerts.

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

## 🌐 Environment Variables

Ensure the following `.env` variables are set:

```
BETTER_AUTH_SECRET=...              # Randomly generated secret key
BETTER_AUTH_URL=...                 # Base URL of app
DATABASE_URL=postgresql://...       # Your Postgres connection
NEXT_PUBLIC_MAPTILER_KEY=...        # MapTiler API Key
```

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

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Set up your `.env` file

```bash
BETTER_AUTH_SECRET= #Create a secret key for this app
BETTER_AUTH_URL=http://localhost:3000 #Base URL of your app
DB_HOST=localhost
#DB_USER=<!--replace with your database user name-->
#DB_PWD=<!--replace with your database password-->
DB_NAME=

# If using Mapbox API, set Mapbox API key here
NEXT_PUBLIC_MAPTILER_KEY=

DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"
```

3. Seed PostgreSQL database: seed file coming shortly!

4. Run websocket server, essentially plug-and-play here: https://github.com/openmapapp/websocket. This allows new posts to automatically be pushed to users without needing to refresh.

5. Optional: Run TileServer-GL (using Docker per their [github](https://github.com/maptiler/tileserver-gl) is easiest on Windows/Linux, though gives me some trouble on MacOS) using free vector tiles of your area from [maptiler](https://data.maptiler.com/downloads/north-america/). Alternatively, use maptiler's existing API which you can register for online for free (at least within their data usage limits), though this reduces the control over your own data. Right now, the default is the maptiler API; you just set it in your .env file and it's good to go. If you want to use TileServer-GL, update the MapComponent.tsx file by uncommenting line 99 and commenting out line 100.

6. Run the development server:

```bash
npm run dev
```

7. Navigate to `http://localhost:3000` — you should be able to register and explore the app if visitor mode is open

If you have any issues, let me know!
