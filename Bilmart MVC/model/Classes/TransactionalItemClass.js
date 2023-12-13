import PostStrategy from "./PostStrategyClass.js"

class TransactionalItem extends PostStrategy {
    price; //double
    quality; //
    available; //bool

    constructor(price, quantity, available) {
        super();
        this.price = price;
        this.quality = quantity;
        this.available = available;
    }

    getProperty() {
        return {
            price: this.price,
            quality: this.quality,
            available: this.available
        };
    }
}

export default TransactionalItem