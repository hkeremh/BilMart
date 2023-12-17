import User from "./UserClass.js";

class TempUser extends User {
    verificationCode;

    constructor(username, password, email, bilkentID, department, verification, rating, settings, description, postList, wishList, profileImage, ratedamount, createdAt, verificationCode) {
        super({username, password, email, bilkentID, department, verification, rating, settings, description, postList, wishList, profileImage, ratedamount, createdAt});
        this.verificationCode = verificationCode
    }

    toJSON() {
        const superJSON = super.toJSON();
        return {
            ...superJSON,
            verificationCode: this.verificationCode
        }
    }
}

export default TempUser