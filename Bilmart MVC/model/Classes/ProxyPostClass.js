
class ProxyPost {
    // Properties
    realID; //id of actual post
    title; //string
    postDate; //date
    image; //url
    description; //string
    tags; //list of string
    postOwner; //url
    type; //string
    typeSpecific; // list of variables
    availability; //bool

    // Constructor
    constructor(realID, title, postDate, images, description, tags, postOwner, type, typeSpec) {
        this.realID = realID;
        this.title = title;
        this.postDate = postDate;
        this.images = images || [];
        this.description = description;
        this.tags = tags || [];
        this.postOwner = postOwner;
        this.type = type;
        this.typeSpecific = typeSpec || {};
        this.availability = "Available";
    }

    getProperties() {
        return this.typeSpecific.getProperty()
    }

    // toJSON function
    //JSON.stringify(object.toJSON());
    toJSON() {
        return {
            readID: this.realID,
            title: this.title,
            postDate: this.postDate,
            image: this.image,
            description: this.description,
            tags: this.tags,
            postOwner: this.postOwner,
            type: this.type,
            typeSpecific: this.typeSpecific,
            availability: this.availability
        };
    }
}

export default ProxyPost;
