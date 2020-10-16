const mongodb = require('mongodb')
const ShortenServices = require('../../../services/shorten')

exports.default = async function (fastify, opts) {
    const db = fastify.mongo.MONGO1.db
    const shortenerServices = new ShortenServices(db)
    console.log('instance service class')

    const shortenOptionsGET = {
        schema: {
            response:{
                200: {
                    ok: { type: 'boolean'},
                    statusCode: { type: 'integer'},
                    links: {
                        type: 'array',
                        $ref: 'Links#'
                    }
                }
            }
        }
    }

    const shortenOptionsPOST = {
        schema: {
            response:{
                body: {
                    $ref: 'Link#'
                },
                200: {
                    ok: { type: 'boolean'},
                    statusCode: { type: 'integer'},
                    link: {
                        $ref: 'Link#'
                    }
                }
            }
        }
    }

    fastify.addSchema({
        $id: 'Link',
        type: 'object',
        properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            link: { type: 'string' },
            url_id: { type: 'string', default: null }
        },
        required: ['name', 'link']
    })
    .addSchema({
        $id: 'Links',
        type: 'array',
        items: {
            $ref: 'Link#'
        }
    })


    fastify.get('/shorten', shortenOptionsGET, async(req, reply) => {
        const res = await shortenerServices.getAllLinks()
        reply.code(200).send({
            ok: true,
            statusCode: 200,
            links: res
        })
    })
    .post('/shorten', shortenOptionsPOST,async (req, reply) => {
        const body = JSON.parse(req.body)
        console.log(body)
        const res = await shortenerServices.creteNewLink(body)
        reply.send({
            ok: true,
            statusCode: 200,
            link: res
        })
    })

    .get('/:id', async(req, reply) => {
        const {id} = req.params
        const res = await shortenerServices.getByUrlId(id)
        if(!res){
            reply.code(404).sendFile('notFound.html')
        }else {
            reply.redirect(res.link)
        }
        
    })
    if(process.env.NODE_ENV == "production"){
        fastify.setErrorHandler((error, request, reply) => {
            fastify.log.info(error)
            reply.send({
                "ok": false,
                "statusCode": 500,
                "error": "Internal Server Error",
                "message": "Internal Server Error"
            })
        })
    }

}