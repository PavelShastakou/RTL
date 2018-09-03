
const ACTOR_SCHEMA = {
    'id': '/src/controllers/actorsController/schema',
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

export {
    ACTOR_SCHEMA
}
