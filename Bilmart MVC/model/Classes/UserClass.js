

class User {
    id; //mongodb id
    name; //string
    password; //string
    email; //string
    bilkentID; //string
    department; //string
    verification; //bool
    postList; //list of posts
    wishList; //list of posts

    //constructor
    constructor(email,password) {
        this.email = email;
        this.password = password;
    }

}

export default User;