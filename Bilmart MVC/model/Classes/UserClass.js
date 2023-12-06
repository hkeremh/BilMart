class User {

    // Properties
    username;
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
    constructor(username, password, email, bilkentID, department, verification, rating, settings, description, postList, wishList, profileImage, createdAt) {
        this.username = username || '';
        this.password = password || '';
        this.email = email || '';
        this.bilkentID = bilkentID || '';
        this.department = department || '';
        this.verification = verification || false;
        this.rating = rating || 0;
        this.settings = settings || {};
        this.description = description || '';
        this.postList = postList || [];
        this.wishList = wishList || [];
        this.profileImage = profileImage || '';
        this.createdAt = createdAt || new Date();
    }

    // toJSON function
    toJSON() {
        return {
            username: this.username,
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
