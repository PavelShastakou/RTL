const SINGLE_ACTOR_SCHEMA = {
    type: "object",

    properties: {
        actor_id: {
            type: "string",
            maxLength: 32
        },
        name: {
            type: "string",
            maxLength: 255
        },
        birthday: {
            type: "string",
            maxLength: 64
        }
    },

    required: ["actor_id", "name", "birthday"]
};

const POST_ACTOR_SCHEMA = {
    id: "/src/controllers/actorsController/schema/ACTOR_SCHEMA",
    ...SINGLE_ACTOR_SCHEMA
};

const PATCH_ACTORS_SCHEMA = {
    id: "/src/controllers/actorsController/schema/ACTORS_SCHEMA",
    type: "array",
    minItems: 0,
    items: {
        ...SINGLE_ACTOR_SCHEMA
    }
};

const GET_ACTOR_SCHEMA = {
    id: "/src/controllers/actorsController/schema/GET_ACTOR_SCHEMA",
    type: "object",
    properties: {
        actorId: {
            type: "string",
            maxLength: 32
        }
    },
    required: ["show_id"]
};

export { POST_ACTOR_SCHEMA, PATCH_ACTORS_SCHEMA, GET_ACTOR_SCHEMA };
