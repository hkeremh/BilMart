
class Post {
    title; //string title
    postDate; //date type
    images; //an array of urls
    description; //string descr.
    tags; //string array of tags (keywords)
    postOwner; //mongoDB user ID
    type; // SELL or LEND or DONATE or LOSTFOUND

    constructor() {
    }
}

export default Post