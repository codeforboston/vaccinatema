# Vaccinate MA

This is the application deployed to AWS Elastic Beanstalk for https://www.vaccinatema.org/. It is written in express.js and JavaScript.

## Setup
Get the AirTable API key from a team member and add it to your `.env` file.

```sh
cp .env.template .env
open .env
```

Then run the server locally.
```sh
npm install
npm start
open http://127.0.0.1:3002/
```

## Deployment
The `main` branch is automatically deployed to Code for Boston's AWS Elastic Beanstalk instance.