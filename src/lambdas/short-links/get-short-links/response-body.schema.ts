export default {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      destination: {
        type: 'string',
      },
      expirationTime: {
        type: ['number', 'null'],
      },
      isActive: {
        type: ['boolean'],
      },
      isOneTime: {
        type: ['boolean'],
      },
      ownerId: {
        type: ['string'],
      },
      pathId: {
        type: ['string'],
      },
      shortLinkId: {
        type: ['string'],
      },
      url: {
        type: ['string'],
      },
      visitsCount: {
        type: ['number'],
      },
    },
  },
} as const;
