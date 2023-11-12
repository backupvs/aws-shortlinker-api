export default {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      pattern: `^(http|https):\/\/([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(\/[A-Za-z0-9?=\/\-_&]*)*$`,
    },
    lifetime: {
      type: 'string',
      pattern: `^(1 day|3 days|7 days)$`,
    },
  },
  additionalProperties: false,
  required: ['url'],
} as const;
