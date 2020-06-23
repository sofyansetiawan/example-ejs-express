class Product {
    constructor(id, name, type, weight, input, qty){
        this.id = id;
        this.name = name;
        this.type = type;
        this.weight = weight;
        this.input = input;
        this.qty = qty;
    }
}

module.exports = { Product };