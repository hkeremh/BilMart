import TransactionalItem from "./TransactionalItemClass.js"

class LendItem extends TransactionalItem {
    lendDuration; //during of lending (number of days in int)

    constructor(price, quality, available, lendDuration) {
        super(price,quality, available); //calls transactional item constructor
        this.lendDuration = lendDuration;
    }

    getProperty() {
        return {
            price: this.price,
            quality: this.quality,
            available: this.available,
            lendDuration: this.lendDuration
        };
    }

}

export default LendItem