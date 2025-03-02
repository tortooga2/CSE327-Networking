# CSE 327 Documentation

## Table of Contents

-   [Setup](#setup)
-   [Development](#development)
-   [How to work with git](#how-to-work-with-git)

# setting up node/vite

After Cloning the repo:

```
cd CSE-327-Repo
```

Then run:

```
npm install

npm run setup
```

Once that is completed validate your setup with:

```
npm run dev
```

### settings up docker:

Make sure you have docker installed and running on your machine. I recomend downloading the docker desktop application from the official docker website.
[Docker Desktop App download Link](https://www.docker.com/products/docker-desktop/)
Once that is installed, check to make sure docker is setup in your system by running:

```
docker --version
```
Now, with docker installed and running, you can start up your local database and redis containers, firstly, making sure that you terminals current working directory is CSE-327-Repo and you can see a file called docker-compose.yml:
Simply run:

```
docker-compose up -d
```
and you should see 3 containers starting up.

Now inside the foler Backend/ add a new file called .env. Then copy and past this into it:
```
DB_HOST = 0.0.0.0
DB_PORT = 5432
DB_NAME = postgres
DB_USR = postgres
DB_PASSWORD = postgres

REDIS_URL = 0.0.0.0:6379

TOKEN_EXP = 60 ##in seconds
```

message me Chase in discord for any help.

# development

Workflow: While you may use your own workflow, assuming its compatable with the team, you will generally start by going to trello. Find an item in the To-Do list that either you are assigned or with noone assigned to. Drag it over to the In-Progress section and assign yourself to it. Then, in github, create a branch. using the naming convension, "feature/{featurename}". Make sure that you are creating this branch from the latest main branch to avoid merge conflicts. Code up the feature all while commiting often. Then, once the feature is done, on github, submit a merge request to the dev branch. When its accepted the branch will be deleted.
