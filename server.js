require('dotenv').config()
const path = require('path')


const fastify = require('fastify')({
  logger: {
      prettyPrint: true
  },
  disableRequestLogging: false
})


fastify.register(require('fastify-cors'), { 
  
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
