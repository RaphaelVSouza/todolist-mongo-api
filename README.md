# TodoList MongoDB

Simply TodoList api with Nodejs and a User Authentication system.

## Installation

First, we need to download [docker](https://docs.docker.com/get-docker/) to run the databases.

### Starting mongo database

After install docker, run this command in terminal to create a mongoDB container.

```bash
docker run --name mycontainername -p 27017:27017 -e AUTH=no -d mongo
```

### Starting redis database

After install docker, run this command in terminal to create a redis container.

```bash
docker run --name mynewcontainername -p 6379:6379 -d redis:alpine
```

## Installing the dependencies

Download and install [node](https://nodejs.org/en/download/), open your terminal and go to the project directory and run the command

```bash
npm install
```

to install the dependencies

## Usage

### Environment variables

Rename the '.env.example' in the root directory to '.env' , open the file and fill like this:

```environment
NODE_ENV=development

TOKEN_SECRET=mysupersecretkey
TOKEN_EXPIRES=7d

##You can choose local or s3, if you're not in production I recommend local
STORAGE_TYPE=local

MONGO_URL=mongodb://localhost/DB_TODOLIST

SERVER_HOST=http://localhost:
PORT=3001

##You can create an account in https://mailtrap.io/ and put your SMTP credentials
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=

REDIS_HOST=localhost
REDIS_PORT=6379


##Create an account on https://sentry.io/signup/ for pick your sentry DNS, or just comment sentry() on app.js
SENTRY_DNS=

##For use a S3 bucket you need a AWS account and use your credentials https://aws.amazon.com/
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
AWS_BUCKET_NAME=


SERVER_PORT=3000

REDIS_HOST=localhost
REDIS_PORT=6379
```

### Starting your server

With the terminal on the root directory of the project, run

```bash
npm run dev
```

to start the express server.

### Starting the queue

Open another terminal on the project root directory and run

```bash
npm run dev:queue
```

## Testing the API endpoints

Enter on /docs on your browser to access the swagger documentation.

## License

[MIT](https://choosealicense.com/licenses/mit/)
