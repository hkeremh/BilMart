import TransactionalItem from "./TransactionalItemClass.js"
import Donation from "./DonationClass.js";

class LendItem extends TransactionalItem {
    lendDuration; //during of lending (number of days in int)

    constructor(title,postDate,images,description,tags,postOwner,type,price,quality, available, lendDuration) {
        super(title,postDate,images,description,tags,postOwner,type,price,quality, available); //calls transactional item constructor
        this.lendDuration = lendDuration;
    }

    toJSON() {
        const superJSON = super.toJSON();

        return {
            ...superJSON,
            typeSpecific: {
                ...superJSON.typeSpecific,
                lendDuration: this.lendDuration
            }
        }
    }

}

export default LendItem