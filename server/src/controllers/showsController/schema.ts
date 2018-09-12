const SINGLE_SHOW_SCHEMA = {
    type: "object",

    properties: {
        show_id: {
            type: "string",
            maxLength: 32
        },
        name: {
            type: "string",
            maxLength: 255
        }
    },

    required: ["show_id", "name"]
};

const POST_SHOW_SCHEMA = {
    id: "/src/controllers/showsController/schema/POST_SHOW_SCHEMA",
    ...SINGLE_SHOW_SCHEMA
};

const PATCH_SHOWS_SCHEMA = {
    id: "/src/controllers/showsController/schema/PATCH_SHOWS_SCHEMA",
    type: "array",
    minItems: 0,
    items: {
        ...SINGLE_SHOW_SCHEMA
    }
};

const GET_SHOW_SCHEMA = {
    id: "/src/controllers/showsController/schema/GET_SHOW_SCHEMA",
    type: "object",
    properties: {
        show_id: {
            type: "string",
            maxLength: 32
        }
    },
    required: ["show_id"]
};

export { POST_SHOW_SCHEMA, PATCH_SHOWS_SCHEMA, GET_SHOW_SCHEMA };
