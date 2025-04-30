

## Table of Contents

-   [Setup](#setup)
-   [Development](#development)
-   [Documentation](#Documentation)
- 

# setup

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
DB_NAME = connectwork
DB_USR = postgres
DB_PASSWORD = 1234

REDIS_URL = 0.0.0.0:6379

TOKEN_EXP = 60 ##in seconds
```

To stop running your docker containers, run:

```
docker-compose down
```

Or stop them manually in the docker desktop application.

to restart them if we make changes to the SQL script in init-scripts/, run:

```
docker-compose down -v
docker-compose up -d
```
I have had an issue where the two folders docker creates data and redis, need to be deleted manually before the new init-tables.sql script is ran.
you can confirm that this is the bug happening if you see the message
```
PostgreSQL Database directory appears to contain a database; Skipping initialization
```
if you see this message, rerun docker-compose down -v and delete /data and /redis manually.

message discord if you need any help.

# development

Workflow: While you may use your own workflow, assuming its compatable with the team, you will generally start by going to trello. Find an item in the To-Do list that either you are assigned or with noone assigned to. Drag it over to the In-Progress section and assign yourself to it. Then, in github, create a branch. using the naming convension, "feature/{featurename}". Make sure that you are creating this branch from the latest main branch to avoid merge conflicts. Code up the feature all while commiting often. Then, once the feature is done, on github, submit a merge request to the dev branch. When its accepted the branch will be deleted.


# Documentation

- [Backend](#Backend)

## Backend

- [Authentication](#Authentication:)


### Authentication:
- [SignUp](#Signup)
- [Login](#Login)

#### Signup

Endpoint: ``` {baseUrl}/api/auth/signup/ ```
Method: POST
Required Fields: Body

This endpoint is pretty self explanatory. It expects a body with elements ```email``` and ```password```.

Request:

```
//Body
{
email: {{email}},
password: {{password}}
}
```

Successful Response: 

Status Code: 200

```
{
	message : {"User Account Succefully Created}
}
```

+ Session token send as a cookie. 

Failed Response: 

Status Code: 500
```
{ error: "Internal server error" }
```
Status Code: 409
```
{ error: "Email already exists" }
```
Status Code: 400
```
{ error: "Missing email or password" }
```



Example Usage:

```
await fetch({baseUrl}/api/auth/signup), {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"credentials": "same-origin",
	},
	body: JSON.stringify({
		email: {{Some email}},
		password: {{Some Password}}
	})
})
```

#### Login

Endpoint: ``` {baseUrl}/api/auth/login/ ```
Method: POST
Required Fields: Body

This endpoint is pretty self explanatory It expects the body content to be filled with an ```email``` and a ```password```.

Request:

```
//Body
{
email: {{email}},
password: {{password}}
}
```

Successful Response: 

Status Code: 200

```
{
	message : {"User Account Succefully Created}
}
```

+ Session token send as a cookie. 

Failed Response: 

Status Code: 500
```
{ error: "Internal server error" }
```
Status Code: 401
```
{ error: "Invalid credentials" }
```
Status Code: 400
```
{ error: "Missing email or password" }
```


Example Usage:

```
await fetch({baseUrl}/api/auth/login), {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"credentials": "same-origin",
	},
	body: JSON.stringify({
		email: {{Some email}},
		password: {{Some Password}}
	})
})
```


#### In Future Request, the Session Token should be included as a cookie using the credential header. 

### File Management:



#### Upload Helper:

Endpoint: ``` {baseurl}/api/file/upload-helper```

Method: GET

Required Fields:  count

Generates pre-signed URLs for uploading to our S3 bucket and returns them as an array. It also returns an array of keys to retrieve the files from the bucket later.  

Request:

```
//count is a query string
/api/file/upload-helper?count={{integer >= 1}}
```
Successful Response: 
Status Code: 200
```
{
	okay: true,
	urls: [],
	keys: [],
}
```
Failed Response:
Status Code: 400
```
{
	okay: false,
	error: "Bad request",
	message: "Count must be an integer greater than or equal to 1"
}
```
Status Code: 500
```
{
	okay: false,
	error: "Internal server error",
	message: "The server encountered an unexpected condition"
}
```

Example Usage:
```
await fetch(`{baseUrl}/api/file/upload-helper?count=${fileCount}`,
	{
		method: "GET",
		credentials: "include",
	}
)
```

#### File Verification:

Endpoint: ```{baseurl}/api/file/verify```

Method: POST

Required Fields:  Body

An endpoint to verify if a particular file was successfully uploaded to our S3 bucket. If it was, the file's metadata (such as the name, key, and owner id) is stored within our Postgres database. Returns the data of the uploaded files back to the client.

Request:

```
//Body
{
	keys: {{array of file keys}},
	fileNames: {{array of file names}}
}
```
Successful Response: 
Status Code: 201
```
{
	okay: true,
	message: "All files were successfully uploaded!"
	data: []
}
```

```
{
	okay: true,
	message: "Some files did not upload successfully"
	data: []
}
```
Failed Response:
Status Code: 400
```
{
	okay: false,
	error: "Bad request",
	message: "keys and fileNames must be arrays!"
}
```
Status Code: 500
```
{
	okay: false,
	error: "Internal server error",
	message: "The server encountered an unexpected condition"
}
```

Example Usage:
```
await fetch("/api/file/verify",
	{
		method: "POST",
		credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            keys: keys,
            fileNames: fileNames,
        }),
	}
)
```
