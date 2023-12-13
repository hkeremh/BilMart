import PostStrategy from "./PostStrategyClass.js"

class LostFound extends PostStrategy {
    found; //status bool

    constructor(found) {
        super();
        this.found = found || false;
    }

    getProperty() {
        return {
            found: this.found,
        };
    }

}

export default LostFound