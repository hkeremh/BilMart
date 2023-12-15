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
    ratedamount;
    phoneNumber;
    contactInfoPublic;
    // Constructor
    constructor({username, password, email, bilkentID, department, verification, rating, settings, description, postList, wishList, profileImage, ratedamount, createdAt}) {
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
        this.ratedamount = ratedamount;
        this.createdAt = createdAt || new Date();
        this.phoneNumber = '';
        this.contactInfoPublic = false;
    }

    // toJSON function
    toJSON() {
        return {
            username: this.username,
            email: this.email,
            password: this.password,
            bilkentID: this.bilkentID,
            department: this.department,
            verification: this.verification,
            rating: this.rating,
            description: this.description,
            settings: this.settings,
            postList: this.postList,
            wishList: this.wishList,
            profileImage: this.profileImage,
            ratedamount: this.ratedamount,
            createdAt: this.createdAt,
            phoneNumber: this.phoneNumber,
            contactInfoPublic: this.contactInfoPublic
        };
    }
}

export default User;
