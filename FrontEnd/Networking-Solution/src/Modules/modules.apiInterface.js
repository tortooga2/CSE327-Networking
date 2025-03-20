import { UserStateManager } from "./module.userStateManager.js";

const API = {
    baseURL: null,
    Schema: null,
    UserManager: UserStateManager,

    Endpoints: null,

    EndpointEnum: null,

    Connect: async (baseURL, email, password, loginCallBack) => {
        UserStateManager.clearUser();
        const data = await UserStateManager.Login(baseURL, email, password);
        if (loginCallBack)
            loginCallBack({ ok: data.error ? false : true, error: data.error });
        UserStateManager.setUser("Logged in");

        const response = await (async () => {
            //DEBUGGING ONLY

            console.log("Session Token: ", data.user.session_token);
            const header = {
                "Content-Type": "application/json",
            };

            try {
                return await fetch(baseURL + "/schema", {
                    method: "GET",
                    credentials: "include",
                    headers: header,
                });
            } catch (error) {
                throw new Error("Failed to connect to the server", error);
            }
        })();

        if (!response) {
            throw new Error("Failed to connect to the server");
        }

        try {
            const data = await response.json();
            console.log(data);

            if (data.error) {
                throw new Error(data.error);
            }

            API.Schema = data;
        } catch (error) {
            console.log(error);
            throw new Error("Failed to parse the schema", error);
        }

        API.baseURL = baseURL;

        API.SetEndpoints(API.ParseSchemaForEndpoints(API.Schema));
    },

    Login: async (email, password) => {
        if (!API.UserManager) {
            throw new Error("UserManager not set");
        }
        API.UserManager.Login(email, password);
    },

    Signup: async (baseURL, email, password, callback) => {
        if (!API.UserManager) {
            throw new Error("UserManager not set");
        }
        const data = await API.UserManager.Signup(baseURL, email, password);
        if (!data.error) {
            API.UserManager.setUser("Logged in");
        }
        callback({ ok: data.error ? false : true, error: data.error });
    },

    SetUserManager: (UserManager) => {
        API.UserManager = UserManager;
    },

    GetSchema: () => {
        return API.Schema;
    },

    ParseSchemaForEndpoints: (schema) => {
        const endpoints = Object.keys(schema);
        const endpointsParsed = {};
        const ENUM = {};
        for (let endpoint of endpoints) {
            const endpoint_name = endpoint.split("/").pop();
            if (endpoint_name === "") {
                continue;
            }
            ENUM[endpoint_name.toUpperCase()] = endpoint_name;
            endpointsParsed[`${endpoint_name}`] = endpoint;
        }
        API.EndpointEnum = ENUM;
        return endpointsParsed;
    },

    SetEndpoints: (endpoints) => {
        API.EndPoints = endpoints;
    },

    Request: {
        Endpoint: null,
        Method: null,
        Headers: null,
        Parameters: null,
        Body: null,

        hasBody: null,
        hasParameters: null,
        possibleMethods: null,

        New(endpoint) {
            const newRequest = { ...this };
            const Endpoint = API.EndPoints[endpoint];
            if (!Endpoint) {
                throw new Error("Endpoint not found");
            }
            //set Endpoint
            newRequest.Endpoint = Endpoint;

            //set Method
            const Methods = Object.keys(API.Schema[Endpoint]);
            newRequest.possibleMethods = Methods;
            newRequest.Method = Methods[0];
            newRequest.Headers = API.Schema[Endpoint][Methods[0]].header;
            newRequest.hasParameters = API.Schema[Endpoint][Methods[0]]
                .parameters
                ? true
                : false;
            newRequest.hasBody = API.Schema[Endpoint][Methods[0]].body
                ? true
                : false;
            return newRequest;
        },

        SetMethod(method) {
            if (!this.possibleMethods.includes(method)) {
                throw new Error("Method not allowed");
            }
            this.Method = method;
            this.Headers = API.Schema[this.Endpoint][method].header;
            this.hasParameters = API.Schema[this.Endpoint][method].parameters
                ? true
                : false;
            this.hasBody = API.Schema[this.Endpoint][method].body
                ? true
                : false;
            return this;
        },

        SetParameters(parameters) {
            if (!this.hasParameters) {
                throw new Error("Parameters not allowed");
            }
            const schemaParameters =
                API.Schema[this.Endpoint][this.Method].parameters;
            const keys = Object.keys(schemaParameters);
            for (let key of keys) {
                if (!parameters[key]) {
                    throw new Error("Missing parameter");
                }
            }
            this.Parameters = parameters;
            return this;
        },

        SetBody(body) {
            if (!this.hasBody) {
                throw new Error("Body not allowed");
            }
            const schemaBody = API.Schema[this.Endpoint][this.Method].body;
            const keys = Object.keys(schemaBody);
            for (let key of keys) {
                if (!body[key]) {
                    throw new Error("Missing body parameter");
                }
            }
            this.Body = body;
            return this;
        },

        Print() {
            console.table({
                Request: {
                    Endpoint: this.Endpoint,
                    Method: this.Method,
                    Headers: this.Headers,
                    Parameters: this.Parameters,
                    Body: this.Body,
                    "Possible Methods": this.possibleMethods,
                    "Has Body": this.hasBody,
                    "Has Parameters": this.hasParameters,
                },
            });
        },

        async Send() {
            if (!this.Endpoint) {
                throw new Error("Endpoint not set");
            }
            if (!this.Method) {
                throw new Error("Method not set");
            }
            if (!this.Headers) {
                throw new Error("Headers not set");
            }
            if (this.hasBody && !this.Body) {
                throw new Error(
                    "This request requires a body, however none was set"
                );
            }
            if (this.hasParameters && !this.Parameters) {
                throw new Error("Parameters not set");
            }

            const response = await (async () => {
                if (this.hasParameters) {
                    this.Endpoint = this.Endpoint + "?";
                    const keys = Object.keys(this.Parameters);
                    for (let key of keys) {
                        this.Endpoint =
                            this.Endpoint + `${key}=${this.Parameters[key]}&`;
                    }
                    this.Endpoint = this.Endpoint.slice(0, -1);
                }

                try {
                    return await fetch(API.baseURL + this.Endpoint, {
                        method: this.Method,
                        headers: this.Headers,
                        body: this.hasBody ? JSON.stringify(this.Body) : null,
                    });
                } catch (error) {
                    throw new Error("Failed to send request", error);
                }
            })();
            if (!response) {
                throw new Error("Failed to send request");
            }
            const data = await response.json();
            return data;
        },
    },
};

async function test() {
    const baseURL = "http://localhost:3000/api";
    const email = "Aniya9@yahoo.com";
    const password = "TSUPNGMglBGCTld";
    await API.Connect(baseURL, email, password);

    console.log(API.Schema);
    console.log(API.EndPoints);

    const newRequest = API.Request.New("login").SetBody({
        email: "Aniya9@yahoo.com",
        password: "TSUPNGMglBGCTld",
    });
    newRequest.Print();
    const data = await newRequest.Send();
    console.log(data);
}

//test();

export default API;
