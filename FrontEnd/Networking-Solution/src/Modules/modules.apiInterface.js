import { UserStateManager } from "./module.userStateManager.js";

const API = {
    baseURL: null,
    Schema: null,
    UserManager: UserStateManager,

    Endpoints: null,

    EndpointEnum: null,

    Connect: async (baseURL, email, password) => {
        UserStateManager.clearUser();
        const data = await UserStateManager.Login(baseURL, email, password);
        UserStateManager.setUser("Logged in");

        const response = await (async () => {
            //DEBUGGING ONLY
            let header = {
                "Content-Type": "application/json",
                Cookie: `sessionToken=${data.user.session_token}`,
            };

            try {
                return await fetch(baseURL + "/schema/", {
                    method: "GET",
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
            API.Schema = await response.json();
        } catch (error) {
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

    Signup: async (email, password) => {
        if (!API.UserManager) {
            throw new Error("UserManager not set");
        }
        API.UserManager.Signup(email, password);
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
            const response = await (async () => {
                try {
                    return await fetch(API.baseURL + this.Endpoint, {
                        method: this.Method,
                        headers: this.Headers,
                        body: JSON.stringify(this.Body),
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

    const staticRequest = API.Request.New("login").SetMethod("POST").SetBody({
        email: "Aniya9@yahoo.com",
        password: "TSUPNGMglBGCTld",
    });
    staticRequest.Print();
    const data = await staticRequest.Send();
    console.log(data);
}

test();

export default API;
