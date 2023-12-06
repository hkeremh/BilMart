class Post {
    // Properties
    title; //string
    postDate; //date
    images; //list of url
    description; //string
    tags; //list of string
    postOwner; //url
    type; //string

    // Constructor
    constructor(title, postDate, images, description, tags, postOwner, type) {
        this.title = title;
        this.postDate = postDate;
        this.images = images || [];
        this.description = description;
        this.tags = tags || [];
        this.postOwner = postOwner;
        this.type = type;
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
        };
    }
}

export default Post;
