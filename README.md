# Vaccinate MA

This is the application deployed to AWS Elastic Beanstalk for https://www.vaccinatema.com. It is written with [Express](https://expressjs.com), [React](https://reactjs.org), and [Next.js](https://nextjs.org).

## Setup
Get the AirTable API key from a team member and add it to your `.env` file.

```sh
cp .env.template .env
open .env
```

Then run the server locally.
```sh
npm install
npm run build
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
