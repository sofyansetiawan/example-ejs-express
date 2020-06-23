const express = require("express");
const Product = require("./product.js").Product;
const fs = require("fs");
const app = express();

const PORT = 3000;

app.use(express.urlencoded( { extended: false } ));
app.use(express.static(__dirname + "/public" ));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.send(`Selamat Datang di Toko Online`);
});

app.get("/guest/:nama/:phase", (req, res) => {
    const guest = req.params.nama;
    const phase = req.params.phase;
    res.send(`Selamat Datang ${guest} phase ${phase}, di tokoOnline`);
});

// URL -> /products (mendapatkan data product)
app.get("/products", (req, res) => {
    const products = JSON.parse(fs.readFileSync('./products.json', "utf-8"));
    const message = req.app.locals.message || "";
    const result = products.map(function(product){
        return new Product(product.id, product.name, product.type, product.weight, product.input, product.qty);
    });
    res.render("products", { result , message })
});

// URL -> /products/add (menambah data product) -> FORM
app.get("/products/add", (req, res) => {
    res.render("add");
});

// URL -> /add (mengirim data product baru ke apps)

app.post("/add", (req, res) => {
    const { name, type, weight, input, qty} = req.body;
    const products = JSON.parse(fs.readFileSync('./products.json', "utf-8"));
    const newProduct = new Product(products[products.length - 1].id + 1, name, type,weight, input, qty);
    products.push(newProduct);
    let dataProducts = JSON.stringify(products, null, 2);
    fs.writeFileSync('./products.json', dataProducts, "utf-8");
    req.app.locals.message = `Success add data product ${name}`;
    res.redirect("/products");
});

// URL -> /products/1/edit (mengedit data product yang sudah ada 1 product) -> form
app.get("/products/:id/edit", (req, res) => {
    let paramId = req.params.id;
    const products = JSON.parse(fs.readFileSync('./products.json', "utf-8"));
    const filterDataById = products.filter(function (product) {
        if(paramId == product.id){
            return new Product(product.id, product.name, product.type, product.weight, product.input, product.qty);
        }
    });
    res.render("edit", { filterDataById })
});

// URL -> /edit (mengirim data product yang diedit ke apps)
app.post("/edit", (req, res) => {
    const { editId, name, type, weight, input, qty} = req.body;
    const products = JSON.parse(fs.readFileSync('./products.json', "utf-8"));
    for(let i = 0; i < products.length; i++){
        if(editId == products[i].id){
            const newProduct = new Product(editId, name, type, weight, input, qty);
            products.splice(i, 1, newProduct);
        }
    }
    let dataProducts = JSON.stringify(products, null, 2);
    fs.writeFileSync('./products.json', dataProducts, "utf-8");
    req.app.locals.message = `Success edit data product ${editId}`;
    res.redirect("/products");
});

// URL -> /products/1/delete (menghapus data product baru ke apps) => gak perlu form




app.listen(PORT, function(){
    console.log(`APPS EXPRESS INI JALAN DI ${PORT}`);
});