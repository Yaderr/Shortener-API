const nanoid = require('nanoid')

class ShortenServices {

    /*
        Create New link
    */
   constructor(db){
       this.db = db;
   }
    async creteNewLink(newLink){
        if(!newLink.url_id){
            newLink.url_id = nanoid.nanoid(15);        
        }
        const exist = await this.db.collection('links').findOne(newLink)
        if(!exist){
            const link = await this.db.collection('links').insertOne(newLink)
            return link.ops[0]
        }
        
        throw new Error(`The Link ${exist.url_id} is already create for ${exist.link} `)
    }
    /*
        @get all links
    */
    async getAllLinks(db){
        console.log(this)
        const links = await this.db.collection('links').find({}).toArray()
        return links
    }
    /*
        Find by url_id
    */

    async getByUrlId(url_id){
        const link = await this.db.collection('links').find({url_id}).toArray()
        return link[0]
    }

    async getIndex(){
        const link = await this.db.collection('links').listIndexes()
        return link
    }
}

module.exports = ShortenServices
