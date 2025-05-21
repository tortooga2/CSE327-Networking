

# Introduction
Hello! Just in case this project gets continued by another team, I wanted to write a little API reference/guide/documentation or whatever. Hopefully, this should make your life a little easier when you try to understand our codebase.
	-Chris

## Table of Contents
 - [API Reference Guide](#API-Reference)
 - [Additional Thoughts](#Thoughts)

## API-Reference
### Authentication (Author: Chase)

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

```
#### In Future Request, the Session Token should be included as a cookie using the credential header.


### File Management (Author: Chris)
- [Upload Helper](#Upload-Helper)
- [Verify Files](#Verify-Files)  

#### Upload-Helper:

  

Endpoint: ``` {baseurl}/api/file/upload-helper```

  

Method: GET

  

Required Fields: count

  

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

  

#### Verify-Files:
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