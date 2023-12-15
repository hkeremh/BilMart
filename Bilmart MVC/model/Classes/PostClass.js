
class Post {
    // Properties
    title; //string
    postDate; //date
    images; //list of url
    description; //string
    tags; //list of string
    postOwner; //url
    type; //string
    typeSpecific; // list of variables
    wishlistCount; //how many times item got wishlisted
    wishlist; //users who have wish listed this item []

    // Constructor
    constructor(title, postDate, images, description, tags, postOwner, type, typeSpec) {
        this.title = title;
        this.postDate = postDate;
        this.images = images || [];
        this.description = description;
        this.tags = tags || [];
        this.postOwner = postOwner;
        this.type = type;
        this.typeSpecific = typeSpec || {};
        this.wishlistCount =  0;
        this.wishlist = [];
    }

    getProperties() {
        return this.typeSpecific.getProperty()
    }

    // toJSON function
    //JSON.stringify(object.toJSON());
    toJSON() {
        return {
            title: this.title,
            postDate: this.postDate,
            images: this.images,
            description: this.description,
            tags: this.tags,
            postOwner: this.postOwner,
            type: this.type,
            typeSpecific: this.typeSpecific,
            wishlistCount: this.wishlistCount,
            wishlist: this.wishlist
        };
    }
}

export default Post;
