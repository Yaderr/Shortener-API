const nanoid = require('nanoid')

class ShortenServices {

    /**
    * Contructor 
    * @param {db} 
    */
    constructor(db){
        this.db = db;
    }

    /**
     * Function for Create new link
     * 
     * @param { { newLink: object } } { newLink = {} }
     * @memberof ShortenServices
     * @returns {Promise<{ _id: ObjectId, name: string, link: string, url_id: string}>} object
     */
    async creteNewLink(newLink){
        if(!newLink.url_id){
            newLink.url_id = nanoid.nanoid(15);        
        }
        const exist = await this.db.collection('links').findOne({url_id: newLink.url_id})
        if(!exist){
            const link = await this.db.collection('links').insertOne(newLink)
            return link.ops[0]
        }
        
        throw new Error(`The Link ${exist.url_id} is already create for ${exist.link} `)
    }
    

    /**
     * Function for Get all link from links collection of shortener db
     * 
     * @memberof ShortenServices
     * @returns {Promise<{ _id: ObjectId, name: string, link: string, url_id: string}>[]} array
     */
    async getAllLinks(){
        console.log(this)
        const links = await this.db.collection('links').find({}).toArray()
        return links
    }
    /**
     * Function for Get link by url_id
     * @param { {url_id: string} } { url_id }
     * @memberof ShortenServices
     * @returns {Promise<{ _id: ObjectId, name: string, link: string, url_id: string}>} object
     */

    async getByUrlId(url_id){
        const link = await this.db.collection('links').findOne({url_id})
        return link
    }
}

module.exports = ShortenServices
