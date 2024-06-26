# Nexus

## Description

Online chat application made using ExpressJS and HandlebarsJS. Final semester project for CS546, Web Programming I.

## Run Locally

1. Clone the repository:

   ```console
   git clone https://github.com/ZhangTerrence/nexus.git
   ```

2. Create a .env file at the app's root. The file must have the following values:

   - NODE_ENV, the current environment of the node application ("prod" | "dev").
   - PORT, the port number at which the web server will be listening on.
   - MONGO_CONNECTION_STRING, the connection string for MongoDB.
   - SESSION_SECRET, the secret used when generating sessions.

3. Run the application in dev mode:

   ```console
   npm run dev
   ```

## Linting and Formatting

This project uses ESLint for its linting and Prettier for its formatting. To change configurations, go to .eslintrc.json and .prettierc.json for linting and formatting respectively.

### Available Scripts

```console
npm run lint:check
```

Checks if code satisfies ESLint linting configuration rules.

```console
npm run lint:fix
```

Fixes any errors that can be auto-fixed.

```console
npm run format:check
```

Checks if code satisfies Prettier formatting configuration rules.

```console
npm run format:fix
```

Formats the code.

## Seeding the Database

Simply run the following to seed the database.

```console
npm run seed
```
