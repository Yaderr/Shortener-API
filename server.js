require('dotenv').config()
const path = require('path')
const swagger = require('./swagger')


const fastify = require('fastify')({
  logger: {
      prettyPrint: true
  },
  disableRequestLogging: false
})


fastify.register(require('fastify-cors'), { 
  
})

fastify.register(require('fastify-swagger'), {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'testing the fastify swagger api',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'user', description: 'User related end-points' },
      { name: 'code', description: 'Code related end-points' }
    ],
    definitions: {
      User: {
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: {type: 'string', format: 'email' }
        }
      }
    },
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  },
  exposeRoute: true
})
const mdbUrl = process.env.DATABASE_URL
fastify.register(require('fastify-helmet'))

fastify.register(require('fastify-mongodb'),{
  forceClose: true,
  url: mdbUrl,
  name: 'MONGO1'
})



.after(() => {
  fastify.register(require('./v1/routes/version'))
  fastify.register(require('./v1/routes/shorten'), {prefix: '/v1'})
})

fastify.ready(err => {
    if (err) throw err
    fastify.swagger()
  })
const start = async() => {
  try {
    await fastify.listen(process.env.PORT || 5000,'0.0.0.0', function (err) {
        if (err) throw err
        //console.log(`server listening on ${fastify.server.address().port}`)
    })
      
      
  } catch(err){
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
