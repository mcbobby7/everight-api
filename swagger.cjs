module.exports = {
  openapi: "3.0.3", // present supported openapi version
  info: {
    title: "Everightlab", // short title.
    description: "Supplement APIs for Everightlab", //  desc.
    version: "1.0.0", // version number
    contact: {
      name: "Philip O", // your name
      email: "philip@midrasconsulting.com", // your email
      url: "midrasconsulting.com", // your website
    },

    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },

  servers: [
    {
      url: "http://localhost:9200",
      // url: "https://mighty-citadel-36380.herokuapp.com/",
      description: "Local server", // name
    },
  ],

  // tags: [
  //   {
  //     name: "Supplement APIs for Everight Lab",
  //   },
  // ],

  components: {
    schemas: {
      newTemplate: {
        required: ["title", "messageBody"],
        type: "object", // data type
        properties: {
          title: {
            type: "string",
            description: "Template title",
          },
          messageBody: {
            type: "string", // data-type
            description: "Template body", // desc
          },
        },
      },

      updateTemp: {
        required: ["id", "title", "messageBody"],
        type: "object", // data type
        properties: {
          id: {
            type: "number",
            format: "int32",
            description: "Template Id",
          },
          title: {
            type: "string",
            description: "Template Title",
          },
          messageBody: {
            type: "string", // data-type
            description: "Template body", // desc
          },
        },
      },

      usersDataTemp: {
        required: ["templateId", "SenderName", "UsersData"],
        type: "object", // data type
        properties: {
          templateId: {
            type: "number", // data-type
            format: "int32",
            description: "message to be sent", // desc
          },

          senderName: {
            type: "string", // data type
            format: "string",
            description: "Sender's name", // desc
          },

          UsersData: {
            type: "string", // data type
            format: "string",
            description: "array of users object", // desc
          },
        },
      },

      usersGeneratedTemp: {
        required: ["minAge", "maxAge", "gender", "startDate","endDate"],
        type: "object", // data type
        properties: {
          minAge: {
            type: "integer", // data-type
            format: "int32",
            description: "user's minimum age", // desc
          },
          maxAge: {
            type: "integer", // data-type
            format: "int32",
            description: "user's maximum age", // desc
          },

          gender: {
            type: "string", // data type
            format: "string",
            description: "user's gender", // desc
          },

          startDate: {
            type: "string", // data type
            format: "date",
            description: "registration start date", // desc
          },

          endDate: {
            type: "string", // data type
            format: "date",
            description: "registration end date", // desc
          },
        },
      },
      

      phoneNumber: {
        required: ["phone"],
        type: "string", // data type
        description: "client phone number", // desc
        example: "0813xxxxxxx", // example of an accountNumber
      },

      generalResponse: {
        type: "string", // data type
        description: "Common response", // desc
        example: "Request submitted successfully", // example of an accountNumber
      },

      Error: {
        type: "object", //data type
        properties: {
          message: {
            type: "string", // data type
            description: "Error message", // desc
            example: "Not found", // example of an error message
          },
          internal_code: {
            type: "string", // data type
            description: "Error internal code or Invalid parameters", // desc
            example: "Invalid parameters", // example of an error internal code
          },
        },
      },
    },
  },

  paths: {
    "/api/Notifications/addTemplate": {
      post: {
        tags: ["Template Operations"],
        summary: "API for adding a new template",
        requestBody: {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/newTemplate",
              },
            },
            "text/json": {
              schema: {
                $ref: "#/components/schemas/newTemplate",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },

    "/api/Notifications/updateTemplate": {
      post: {
        tags: ["Template Operations"],
        summary: "API for updating a template",
        requestBody: {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/updateTemp",
              },
            },
            "text/json": {
              schema: {
                $ref: "#/components/schemas/updateTemp",
              },
            },
            "application/json": {
              schema: {
                $ref: "#/components/schemas/updateTemp",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },

    "/api/Notifications/fetchTemplate/{id}": {
      get: {
        tags: ["Template Operations"],
        summary: "API for getting a notification template",
        parameters: [
          {
            name: "id",
            in: "path",
            schema: {
              type: "string",
              nullable: true,
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },

    "/api/Notifications/fetchAllTemplates": {
      get: {
        tags: ["Template Operations"],
        summary: "API for getting a notification template",
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },

    "/api/Users/getCelebrants": {
      get: {
        tags: ["Users Operations"],
        summary: "API for getting a notification template",
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },

    "/api/Users/getAllUsers": {
      get: {
        tags: ["Users Operations"],
        summary: "API for getting a notification template",
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },

    "/api/Users/generateUsers": {
      get: {
        tags: ["Users Operations"],
        summary: "API for generating users to receive notifications",
        parameters: [
          {
            name: "minAge",
            in: "query",
            schema: {
              type: "integer", // data-type
              format: "int32",
              description: "user's minimum age", // desc
              nullable: false,
            },

          },
          {

            name: "maxAge",
            in: "query",
            schema: {
              type: "integer", // data-type
              format: "int32",
              description: "user's minimum age", // desc
              nullable: false,
            },

          },

          {
            name: "gender",
            in: "query",
            schema: {
              type: "string", // data type
              format: "string",
              nullable: false,
            },

          },

          {

            name: "startDate",
            in: "query",
            schema: {
              type: "string", // data type
              format: "date",
              nullable: false,
            },

          },

          {
            name: "endDate",
            in: "query",
            schema: {
              type: "string", // data type
              format: "date",
              nullable: false,
            },
          },
        ],
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },

    "/api/Notifications/birthdayEmail": {
      post: {
        tags: ["Notification Operations"],
        summary: "API for sending birthday email",
        requestBody: {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/emailTemp",
              },
            },
            "text/json": {
              schema: {
                $ref: "#/components/schemas/emailTemp",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },


    "/api/Notifications/sendEmail": {
      post: {
        tags: ["Notification Operations"],
        summary: "API for sending email",
        requestBody: {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/usersDataTemp",
              },
            },
            "text/json": {
              schema: {
                $ref: "#/components/schemas/usersDataTemp",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },

    "/api/Notifications/sendsms": {
      post: {
        tags: ["Notification Operations"],
        summary: "API for sending SMS",
        requestBody: {
          description: "",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/usersDataTemp",
              },
            },
            "text/json": {
              schema: {
                $ref: "#/components/schemas/usersDataTemp",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success",
            content: {
              "text/plain": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
              "text/json": {
                schema: {
                  $ref: "#/components/schemas/generalResponse",
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            content: {
              "text/plain": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "application/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
              "text/json": {
                schema: {
                  type: "object",
                  additionalProperties: {
                    type: "string",
                  },
                },
              },
            },
          },
          500: {
            description: "Server Error",
          },
        },
      },
    },

  },
};
