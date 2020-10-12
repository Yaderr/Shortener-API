require('dotenv').config()
const path = require('path')



const fastify = require('fastify')({
    logger: {
        prettyPrint: true
    },
    disableRequestLogging: false
})

const mdbUrl = process.env.DATABASE_URL

fastify.register(require('fastify-helmet'))
fastify.register(require('fastify-mongodb'),{
    forceClose: true,
    url: mdbUrl,
    name: 'MONGO1'
})
.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
})
    .after(() => {
        
        fastify.register(require('./v1/routes/version'))
        fastify.register(require('./v1/routes/shorten'), {prefix: '/v1'})
    })
const start = async() => {
    try {
        await fastify.listen(process.env.PORT || 8080)
    } catch(err){
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
