import Post from "./PostClass.js"

class Donation extends Post {
    IBAN; //string
    weblink; //string url
    organizationName; //name or org
    monetaryTarget; //double value

    constructor() {
        super();
    }

}

export default Donation