import Post from "./PostClass.js"
import Donation from "./DonationClass.js";

class TransactionalItem extends Post {
    price; //double
    quality; // 1-10 int value
    available; //bool

    constructor() {
        super(); //calls Post constructor
    }

}

export default TransactionalItem