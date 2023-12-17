import PostStrategy from "./PostStrategyClass.js"

class Donation extends PostStrategy {
    IBAN; //string
    weblink; //string url
    organizationName; //name or org
    monetaryTarget; //double value

    constructor(IBAN, weblink, organizationName, monetaryTarget) {
        super();
        this.IBAN = IBAN
        this.weblink = weblink
        this.organizationName = organizationName
        this.monetaryTarget = monetaryTarget
    }

    getProperty() {
        return {
            IBAN: this.IBAN,
            weblink: this.weblink,
            organizationName: this.organizationName,
            monetaryTarget: this.monetaryTarget,
        };
    }

}

export default Donation