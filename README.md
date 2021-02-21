# Vaccinate MA

This is the application deployed to AWS Elastic Beanstalk for https://www.vaccinatema.com. It is written with [Express](https://expressjs.com), [EJS](https://ejs.co), and JavaScript. We are working on replacing EJS with [React](https://reactjs.org), using [Next.js](https://nextjs.org).

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
The `main` branch is automatically deployed to Code for Boston's AWS Elastic Beanstalk instance.

## Issue Tracking
Project Issues are tracked on [Trello](https://trello.com/b/BGnTPDSi/vaccinatema).

## Folder Structure
### `components`
`components` contains the React components that make up the pages. Its subdirectory, `subcomponents`, contains components that make up other components.

### `pages`
`pages` should contain `_app.js`, the entry point for `Next.js`, and one file per route. (e.g. The route `/eligibility` corresponds to a file called `eligibility.js`.) 

While we are in the process of porting the frontend to React, we keep the pages in a subdirectory, `dev`, so they can be accessed at `/dev/foo` while the existing EJS pages can still be accessed at `/foo`.

### `views`
`views` contains EJS files that will eventually be replaced with the React pages from `pages`.
