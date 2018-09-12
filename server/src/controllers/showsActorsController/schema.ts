const SINGLE_SHOW_ACTOR_SCHEMA = {
    type: "object",

    properties: {
        show_id: {
            type: "string",
            maxLength: 32
        },
        actor_id: {
            type: "string",
            maxLength: 32
        }
    },

    required: ["show_id", "actor_id"]
};

const PATCH_SHOW_ACTORS_SCHEMA = {
    id:
        "/src/controllers/showsActorsController/schema/PATCH_SHOW_ACTORS_SCHEMA",
    type: "array",
    minItems: 0,
    items: {
        ...SINGLE_SHOW_ACTOR_SCHEMA
    }
};

const GET_SHOW_ACTORS_SCHEMA = {
    id: "/src/controllers/showsController/schema/GET_SHOW_SCHEMA",
    type: "object",
    properties: {
        page: {
            type: "number"
        }
    },
    required: ["page"]
};

export { PATCH_SHOW_ACTORS_SCHEMA, GET_SHOW_ACTORS_SCHEMA };
