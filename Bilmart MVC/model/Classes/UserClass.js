class User {
    // MongoDB id
    _id;

    // Properties
    name;
    password;
    email;
    bilkentID;
    department;
    verification;
    rating;
    settings;
    description;
    postList;
    wishList;
    profileImage;
    createdAt;

    // Constructor
    constructor() { }

    // toJSON function
    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            email: this.email,
            bilkentID: this.bilkentID,
            department: this.department,
            verification: this.verification,
            rating: this.rating,
            settings: this.settings,
            postList: this.postList,
            wishList: this.wishList,
            profileImage: this.profileImage,
            createdAt: this.createdAt
        };
    }
}

export default User;
