import Post from "./PostClass.js"

class LostFound extends Post {
    found; //status bool

    constructor(title,postDate,images,description,tags,postOwner,type, found) {
        super(title,postDate,images,description,tags,postOwner,type);
        this.found = found
    }

    toJSON() {
        const superJSON = super.toJSON();
        return {
            ...superJSON,
            typeSpecific: {
                found: this.found
            }
        }
    }

}

export default LostFound