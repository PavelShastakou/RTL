
const SINGLE_SHOW_SCHEMA = {
    'type': 'object',

    'properties': {
        'show_id': {
            'type': 'string',
            'maxLength': 32
        },
        'name': {
            'type': 'string',
            'maxLength': 255
        }
    },

    'required': [
        'show_id',
        'name'
    ]
}

const SHOW_SCHEMA = {
    'id': '/src/controllers/showsController/schema/SHOW_SCHEMA',
    ...SINGLE_SHOW_SCHEMA
}

const SHOWS_SCHEMA = {
    'id': '/src/controllers/showsController/schema/SHOWS_SCHEMA',
    'type': 'array',
    'minItems': 0,
    'items': {
        ...SINGLE_SHOW_SCHEMA
    }
}

export {
    SHOW_SCHEMA,
    SHOWS_SCHEMA
}
