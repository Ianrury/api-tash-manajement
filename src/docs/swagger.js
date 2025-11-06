import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API documentation for Task Management Backend',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local' },
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
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Ian Roery' },
            username: { type: 'string', example: 'ian' },
          },
        },
        UserAuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },
        Task: {
          type: 'object',
          properties: {
            task_id: { type: 'integer', example: 10 },
            user_id: { type: 'integer', example: 1 },
            created_by: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Setup CI/CD' },
            description: { type: 'string', nullable: true, example: 'Implement Github Actions' },
            status: { type: 'string', enum: ['To Do', 'In Progress', 'Done'], example: 'To Do' },
            deadline: { type: 'string', format: 'date-time', nullable: true, example: '2025-11-30T00:00:00.000Z' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        TaskCreateInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Write docs' },
            description: { type: 'string', example: 'Swagger docs for API' },
            status: { type: 'string', enum: ['To Do', 'In Progress', 'Done'] },
            deadline: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
  },
  apis: [
    './src/routes/*.js',
  ],
});
