import express from "express";
import fs from "fs/promises";
import path from "path";



const router = express.Router();

// Ścieżki do plików z danymi
const productsFilePath = path.resolve("./data/products.json");
const categoriesFilePath = path.resolve("./data/categories.json");
const suppliersFilePath = path.resolve("./data/suppliers.json");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Pobierz listę produktów
 *     description: Zwraca pełną listę produktów, łącznie z przypisanymi kategoriami, dostawcami i linkami HATEOAS.
 *     tags:
 *       - Produkty
 *     responses:
 *       200:
 *         description: Lista produktów
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Dream naturalny"
 *                       category_id:
 *                         type: integer
 *                         example: 101
 *                       id_supplier:
 *                         type: integer
 *                         example: 1
 *                       nutritional_values:
 *                         type: object
 *                         properties:
 *                           carbohydrates:
 *                             type: number
 *                             format: float
 *                             example: 2.9
 *                           proteins:
 *                             type: number
 *                             format: float
 *                             example: 8.3
 *                           fats:
 *                             type: number
 *                             format: float
 *                             example: 3.3
 *                       supplier:
 *                         type: object
 *                         properties:
 *                           id_supplier:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "Wells, Mendoza and Johnson"
 *                           contact_info:
 *                             type: object
 *                             properties:
 *                               address:
 *                                 type: string
 *                                 example: "1816 Jacob Coves Apt. 675, Raymondmouth, WV 53374"
 *                               phone:
 *                                 type: string
 *                                 example: "001-636-243-8171x038"
 *                           rating:
 *                             type: number
 *                             format: float
 *                             example: 2.8
 *                       category:
 *                         type: object
 *                         properties:
 *                           id_category:
 *                             type: integer
 *                             example: 101
 *                           name:
 *                             type: string
 *                             example: "Nabiał"
 *                           main_category:
 *                             type: string
 *                             example: "Produkty mleczne"
 *                           description:
 *                             type: string
 *                             example: "Produkty mleczne i nabiałowe."
 *                       links:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             rel:
 *                               type: string
 *                               example: "products_list"
 *                             method:
 *                               type: string
 *                               example: "GET"
 *                             href:
 *                               type: string
 *                               example: "http://localhost:8989/products"
 *                           example:
 *                             - rel: "products_list"
 *                               method: "GET"
 *                               href: "http://localhost:8989/products"
 *                             - rel: "products_create"
 *                               method: "POST"
 *                               href: "http://localhost:8989/products"
 *                             - rel: "products_details"
 *                               method: "GET"
 *                               href: "http://localhost:8989/products/1"
 *                             - rel: "products_update"
 *                               method: "PATCH"
 *                               href: "http://localhost:8989/products/1"
 *                             - rel: "products_delete"
 *                               method: "DELETE"
 *                               href: "http://localhost:8989/products/1"
 *                             - rel: "products_filter"
 *                               method: "GET"
 *                               href: "http://localhost:8989/products/filter?category_id=101&minCarbohydrates=2.9&maxCarbohydrates=2.9&minProteins=8.3&maxProteins=8.3&minFats=3.3&maxFats=3.3"
 *                             - rel: "categories_list"
 *                               method: "GET"
 *                               href: "http://localhost:8989/categories"
 *                             - rel: "suppliers_list"
 *                               method: "GET"
 *                               href: "http://localhost:8989/suppliers"
 *                             - rel: "suppliers_details"
 *                               method: "GET"
 *                               href: "http://localhost:8989/suppliers/1"
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się pobrać listy produktów."
 */

 /// GET /products - Pobierz pełną listę produktów
router.get("/", async (req, res) => {
    try {
        // Odczytanie danych z plików
        const [products, categories, suppliers] = await Promise.all([
            fs.readFile(productsFilePath, "utf-8").then(JSON.parse),
            fs.readFile(categoriesFilePath, "utf-8").then(JSON.parse),
            fs.readFile(suppliersFilePath, "utf-8").then(JSON.parse),
        ]);

        // Łączenie danych produktów z kategoriami i dostawcami
        const response = products.map((product) => {
            const category = categories.find((c) => c.id_category === product.category_id);
            const supplier = suppliers.find((s) => s.id_supplier === product.id_supplier);

            return {
                ...product,
                category,
                supplier,
            };
        });

        res.status(200).json(response);
    } catch (error) {
        console.error("Błąd podczas pobierania listy produktów:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się pobrać listy produktów." });
    }
});

export default router;