exports.default = async function (fastify, opts) {
    fastify.get('/version', async (req, reply) => {
        reply.send({
            version: 0.01,
            releaseDate: new Date().toLocaleString()
        })
    })
}