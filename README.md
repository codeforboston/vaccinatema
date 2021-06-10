# Vaccinate MA

This is the application deployed to AWS Elastic Beanstalk for https://www.vaccinatema.com. It is written with [Express](https://expressjs.com), [React](https://reactjs.org), and [Next.js](https://nextjs.org).

## Setup
Get the AirTable API key from a team member and add it to your `.env` file.

```sh
cp .env.template .env
open .env
```

### Setup the Database
To setup a local copy of your database you should use a local Postgres instance.
You can set the credentials you want in .env then setup a local database to match.

```sh
createuser -s -P vaccinatema
# enter password you set in .env DB_CRED_PW
createdb -O vaccinatema vaccinatema_development
psql -U vaccinatema -d vaccinatema_development -f dbschema.sql
node db/migration.js
```

Then run the server locally.
```sh
npm install
npm run local
open http://127.0.0.1:3002/
```

## Deployment
Run `npm run lint` and fix any linting issues before pushing your branch
The `main` branch is automatically deployed to Code for Boston's AWS Elastic Beanstalk instance.

## Issue Tracking
Project Issues are tracked on [Trello](https://trello.com/b/BGnTPDSi/vaccinatema).

## Folder Structure
### `components`
`components` contains the React components that make up the pages. Its subdirectory, `subcomponents`, contains components that make up other components.

### `pages`
`pages` should contain `_app.js`, the entry point for `Next.js`, and one file per route. (e.g. The route `/eligibility` corresponds to a file called `eligibility.js`.) 
