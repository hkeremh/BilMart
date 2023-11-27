import TransactionalItem from "./TransactionalItemClass.js"
import Donation from "./DonationClass.js";

class LendItem extends TransactionalItem {
    lendDuration; //during of lending (number of days in int)

    constructor() {
        super(); //calls transactional item constructor
    }

}

export default LendItem