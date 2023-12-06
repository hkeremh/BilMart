import Post from "./PostClass.js"

class Donation extends Post {
    IBAN; //string
    weblink; //string url
    organizationName; //name or org
    monetaryTarget; //double value

    constructor(title,postDate,images,description,tags,postOwner,type, IBAN, weblink, organizationName, monetaryTarget) {
        super(title,postDate,images,description,tags,postOwner,type);
        this.IBAN = IBAN
        this.weblink = weblink
        this.organizationName = organizationName
        this.monetaryTarget = monetaryTarget
    }

    toJSON () {
        const superJSON = super.toJSON()
        return {
            ...superJSON,
            typeSpecific: {
                IBAN: this.IBAN,
                weblink: this.weblink,
                organizationName: this.organizationName,
                monetaryTarget: this.monetaryTarget
            }
        }
    }

}

export default Donation