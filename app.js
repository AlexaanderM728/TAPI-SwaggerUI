import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import yaml from "js-yaml";
import { swaggerOptions } from "./swaggerConfig.js";


import checkAcceptHeader from "./middleware/checkAcceptHeader.js";

import getProduct from "./routes/products/getProduct.js";
import createProduct from "./routes/products/createProduct.js";
import deleteProduct from "./routes/products/deleteProduct.js";
import updateProduct from "./routes/products/updateProduct.js";
import productList from "./routes/products/productList.js";
import filterProducts from "./routes/products/filterProducts.js";

import listSuppliers from "./routes/suppliers/listSuppliers.js";
import getSupplier from "./routes/suppliers/getSupplier.js";
import createSupplier from "./routes/suppliers/createSupplier.js";
import deleteSupplier from "./routes/suppliers/deleteSupplier.js";
import updateSupplier from "./routes/suppliers/updateSupplier.js"
import filterSuppliers from "./routes/suppliers/filterSuppliers.js";

import listCategories from "./routes/categories/listCategories.js";
import getCategory from "./routes/categories/getCategory.js";
import createCategory from "./routes/categories/createCategory.js";
import updateCategory from "./routes/categories/updateCategory.js";
import deleteCategory from "./routes/categories/deleteCategory.js";


const app = express();
const port = 8989;

app.use(cors({
    origin: "http://mojadomenaoproduktach.pl" 
}));

app.use(express.json()); 

app.use((req, res, next) => {
    if (req.method === "GET") {
        return checkAcceptHeader(req, res, next);
    }
    next();
});


// Wczytanie schematów z katalogów YAML
const productSchemas = yaml.load(fs.readFileSync("./routes/products/schemas.yaml", "utf8"));
const supplierSchema = yaml.load(fs.readFileSync("./routes/suppliers/schemas.yaml", "utf-8"));
const categorySchema = yaml.load(fs.readFileSync("./routes/categories/schemas.yaml", "utf-8"));
// Wygenerowanie dokumentacji Swagger z komentarzy w kodzie
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Połączenie schematów z wygenerowaną dokumentacją
swaggerDocs.components.schemas = { 
    ...swaggerDocs.components.schemas, 
    ...productSchemas,
    ...supplierSchema,
    ...categorySchema
};

// Ustawienie SwaggerUI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/products", filterProducts); 
app.use("/products", getProduct); // GET /products/:id
app.use("/products", createProduct);  // POST /products
app.use("/products", deleteProduct); // DELETE /products/:id
app.use("/products", updateProduct); // PATCH /products/:id
app.use("/products", productList); // GET /products


app.use("/suppliers", filterSuppliers); // GET /suppliers/filter
app.use("/suppliers", getSupplier); // GET /suppliers/:id
app.use("/suppliers", deleteSupplier); // DELETE /suppliers/:id
app.use("/suppliers", updateSupplier); // PATCH /suppliers/:id
app.use("/suppliers", createSupplier); // POST /suppliers
app.use("/suppliers", listSuppliers); // GET /suppliers

app.use("/categories", getCategory);
app.use("/categories", createCategory);
app.use("/categories", updateCategory);
app.use("/categories", deleteCategory);
app.use("/categories", listCategories);


// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer uruchomiony na porcie ${port}`);
});
