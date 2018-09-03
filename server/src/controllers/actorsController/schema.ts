const SINGLE_ACTOR_SCHEMA = {
    'type': 'object',

    'properties': {
        'actor_id': {
            'type': 'string',
            'maxLength': 32
        },
        'name': {
            'type': 'string',
            'maxLength': 255
        },
        'birthday': {
            'type': 'string',
            'maxLength': 64
        }
    },

    'required': [
        'actor_id',
        'name',
        'birthday'
    ]
}

const ACTOR_SCHEMA = {
    'id': '/src/controllers/actorsController/schema/ACTOR_SCHEMA',
    ...SINGLE_ACTOR_SCHEMA
}

const ACTORS_SCHEMA = {
    'id': '/src/controllers/actorsController/schema/ACTORS_SCHEMA',
    'type': 'array',
    'minItems': 0,
    'items': {
        ...SINGLE_ACTOR_SCHEMA
    }
}

export {
    ACTOR_SCHEMA,
    ACTORS_SCHEMA
}
