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

const SHOW_ACTORS_SCHEMA = {
    id: "/src/controllers/showsActorsController/schema/SHOW_ACTORS_SCHEMA",
    type: "array",
    minItems: 0,
    items: {
        ...SINGLE_SHOW_ACTOR_SCHEMA
    }
};

export { SHOW_ACTORS_SCHEMA };
