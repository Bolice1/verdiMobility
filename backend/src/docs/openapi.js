/**
 * OpenAPI 3.0 — verdiMobility (admin control room + health)
 */
export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'verdiMobility API',
    description:
      'Logistics platform API. Admin routes require role `admin` and Bearer JWT.',
    version: '1.0.0',
  },
  servers: [{ url: '/', description: 'Current host' }],
  tags: [
    { name: 'Admin', description: 'System control — super dashboard' },
    { name: 'Health', description: 'Liveness' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      SuccessEnvelope: {
        type: 'object',
        required: ['success', 'data'],
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
        },
      },
      Overview: {
        type: 'object',
        properties: {
          total_users: { type: 'integer' },
          total_companies: { type: 'integer' },
          total_vehicles: { type: 'integer' },
          total_shipments: { type: 'integer' },
          total_revenue: { type: 'number' },
          active_vehicles: { type: 'integer' },
          available_vehicles: { type: 'integer' },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          limit: { type: 'integer' },
          offset: { type: 'integer' },
          hasMore: { type: 'boolean' },
        },
      },
    },
    parameters: {
      Limit: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
        description: 'Page size',
      },
      Offset: {
        name: 'offset',
        in: 'query',
        schema: { type: 'integer', minimum: 0, default: 0 },
        description: 'Pagination offset',
      },
      StatsDays: {
        name: 'days',
        in: 'query',
        schema: { type: 'integer', minimum: 1, maximum: 365, default: 30 },
        description: 'Lookback window in days',
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    service: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/admin/overview': {
      get: {
        tags: ['Admin'],
        summary: 'System overview aggregates',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Aggregated counts and revenue',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/SuccessEnvelope' },
                    {
                      type: 'object',
                      properties: {
                        data: { $ref: '#/components/schemas/Overview' },
                      },
                    },
                  ],
                },
                example: {
                  success: true,
                  data: {
                    total_users: 120,
                    total_companies: 15,
                    total_vehicles: 48,
                    total_shipments: 900,
                    total_revenue: 125000.5,
                    active_vehicles: 12,
                    available_vehicles: 30,
                  },
                },
              },
            },
          },
          '401': { description: 'Missing or invalid token' },
          '403': { description: 'Not an admin' },
        },
      },
    },
    '/api/admin/companies': {
      get: {
        tags: ['Admin'],
        summary: 'List all companies with vehicle counts',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Limit' }, { $ref: '#/components/parameters/Offset' }],
        responses: {
          '200': {
            description: 'Paginated companies',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              name: { type: 'string' },
                              email: { type: 'string' },
                              createdAt: { type: 'string', format: 'date-time' },
                              vehicleCount: { type: 'integer' },
                            },
                          },
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/admin/vehicles': {
      get: {
        tags: ['Admin'],
        summary: 'Global fleet view',
        description:
          'All vehicles with active route (from latest matched/in_transit shipment) and computed available_capacity.',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Limit' }, { $ref: '#/components/parameters/Offset' }],
        responses: {
          '200': {
            description: 'Paginated vehicles',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              companyId: { type: 'string', format: 'uuid' },
                              plateNumber: { type: 'string' },
                              status: { type: 'string', enum: ['available', 'busy', 'maintenance', 'inactive'] },
                              route: {
                                type: 'object',
                                nullable: true,
                                properties: {
                                  from: { type: 'string' },
                                  to: { type: 'string' },
                                },
                              },
                              available_capacity: { type: 'number' },
                            },
                          },
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/admin/shipments': {
      get: {
        tags: ['Admin'],
        summary: 'All shipments with sender and vehicle',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Limit' }, { $ref: '#/components/parameters/Offset' }],
        responses: {
          '200': {
            description: 'Paginated shipments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              status: { type: 'string' },
                              sender: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string' },
                                  name: { type: 'string' },
                                  email: { type: 'string' },
                                },
                              },
                              vehicle: { type: 'object', nullable: true },
                            },
                          },
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/admin/payments': {
      get: {
        tags: ['Admin'],
        summary: 'All payments with status rollup',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Limit' }, { $ref: '#/components/parameters/Offset' }],
        responses: {
          '200': {
            description: 'Payments page + summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', format: 'uuid' },
                              shipmentId: { type: 'string', format: 'uuid' },
                              amount: { type: 'number' },
                              status: { type: 'string' },
                            },
                          },
                        },
                        summary: {
                          type: 'object',
                          properties: {
                            totalRecords: { type: 'integer' },
                            totalAmountAll: { type: 'number' },
                            byStatus: { type: 'object', additionalProperties: true },
                          },
                        },
                        meta: { $ref: '#/components/schemas/PaginationMeta' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
    },
    '/api/admin/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Time-series stats and utilization',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/StatsDays' }],
        responses: {
          '200': {
            description: 'Analytics payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        periodDays: { type: 'integer' },
                        shipments_per_day: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              date: { type: 'string', format: 'date' },
                              count: { type: 'integer' },
                            },
                          },
                        },
                        revenue_per_day: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              date: { type: 'string', format: 'date' },
                              revenue: { type: 'number' },
                            },
                          },
                        },
                        most_active_routes: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              route_from: { type: 'string' },
                              route_to: { type: 'string' },
                              shipment_count: { type: 'integer' },
                            },
                          },
                        },
                        vehicle_utilization_rate: {
                          type: 'number',
                          description: 'Percent busy vs non-inactive fleet',
                        },
                      },
                    },
                  },
                },
                example: {
                  success: true,
                  data: {
                    periodDays: 30,
                    shipments_per_day: [{ date: '2026-03-01', count: 12 }],
                    revenue_per_day: [{ date: '2026-03-01', revenue: 4500.0 }],
                    most_active_routes: [
                      {
                        route_from: 'Berlin',
                        route_to: 'Munich',
                        shipment_count: 42,
                      },
                    ],
                    vehicle_utilization_rate: 35.5,
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden' },
        },
      },
    },
  },
};

export default openApiSpec;

