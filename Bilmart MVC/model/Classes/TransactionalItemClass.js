import Post from "./PostClass.js"

class TransactionalItem extends Post {
    price; //double
    quality; // 1-10 int value
    available; //bool

    constructor(title,postDate,images,description,tags,postOwner,type,price,quality, available) {
        super(title, postDate, images, description, tags, postOwner, type); //calls Post constructor
        this.price = price
        this.quality = quality
        this.available = available

    }

    toJSON() {
        const superJSON = super.toJSON();
        return {
            ...superJSON,
            typeSpecific: {
                price: this.price,
                quality: this.quality,
                available: this.available
            }
        }
    }

}

export default TransactionalItem