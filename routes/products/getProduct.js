import express from "express";
import fs from "fs/promises";
import path from "path";
import { generateHATEOASLinks } from "../../utils/generateHATEOASLinks.js";

const router = express.Router();

// Ścieżki do plików JSON
const productsFilePath = path.resolve("./data/products.json");
const categoriesFilePath = path.resolve("./data/categories.json");
const suppliersFilePath = path.resolve("./data/suppliers.json");

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Pobierz szczegóły produktu
 *     description: Zwraca szczegóły pojedynczego produktu, łącznie z przypisanymi kategoriami, dostawcami i linkami HATEOAS.
 *     tags:
 *       - Produkty
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produktu, którego szczegóły mają zostać zwrócone
 *     responses:
 *       200:
 *         description: Szczegóły produktu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Dream naturalny"
 *                 category_id:
 *                   type: integer
 *                   example: 101
 *                 id_supplier:
 *                   type: integer
 *                   example: 1
 *                 nutritional_values:
 *                   type: object
 *                   properties:
 *                     carbohydrates:
 *                       type: number
 *                       format: float
 *                       example: 2.9
 *                     proteins:
 *                       type: number
 *                       format: float
 *                       example: 8.3
 *                     fats:
 *                       type: number
 *                       format: float
 *                       example: 3.3
 *                 supplier:
 *                   type: object
 *                   properties:
 *                     id_supplier:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Wells, Mendoza and Johnson"
 *                     contact_info:
 *                       type: object
 *                       properties:
 *                         address:
 *                           type: string
 *                           example: "1816 Jacob Coves Apt. 675, Raymondmouth, WV 53374"
 *                         phone:
 *                           type: string
 *                           example: "001-636-243-8171x038"
 *                     rating:
 *                       type: number
 *                       format: float
 *                       example: 2.8
 *                 category:
 *                   type: object
 *                   properties:
 *                     id_category:
 *                       type: integer
 *                       example: 101
 *                     name:
 *                       type: string
 *                       example: "Nabiał"
 *                     main_category:
 *                       type: string
 *                       example: "Produkty mleczne"
 *                     description:
 *                       type: string
 *                       example: "Produkty mleczne i nabiałowe."
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rel:
 *                         type: string
 *                         example: "products_details"
 *                       method:
 *                         type: string
 *                         example: "GET"
 *                       href:
 *                         type: string
 *                         example: "http://localhost:8989/products/1"
 *                     example:
 *                       - rel: "products_details"
 *                         method: "GET"
 *                         href: "http://localhost:8989/products/1"
 *                       - rel: "products_update"
 *                         method: "PATCH"
 *                         href: "http://localhost:8989/products/1"
 *                       - rel: "products_delete"
 *                         method: "DELETE"
 *                         href: "http://localhost:8989/products/1"
 *                       - rel: "categories_details"
 *                         method: "GET"
 *                         href: "http://localhost:8989/categories/101"
 *                       - rel: "suppliers_details"
 *                         method: "GET"
 *                         href: "http://localhost:8989/suppliers/1"
 *       404:
 *         description: Produkt nie znaleziony
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nie znaleziono produktu o ID: 1"
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się pobrać danych."
 */

// GET /products/:id - Szczegóły produktu
router.get("/:id", async (req, res) => {
    const productId = parseInt(req.params.id, 10);

    try {
        // Odczyt danych z plików JSON
        const [products, categories, suppliers] = await Promise.all([
            fs.readFile(productsFilePath, "utf-8").then(JSON.parse),
            fs.readFile(categoriesFilePath, "utf-8").then(JSON.parse),
            fs.readFile(suppliersFilePath, "utf-8").then(JSON.parse),
        ]);

        // Znajdź produkt po ID
        const product = products.find(p => p.id === productId);

        if (!product) {
            return res.status(404).json({ error: `Nie znaleziono produktu o ID: ${productId}` });
        }

        // Znajdź kategorię i dostawcę
        const category = categories.find(c => c.id_category === product.category_id) || null;
        const supplier = suppliers.find(s => s.id_supplier === product.id_supplier) || null;

        // Generowanie linków HATEOAS
        const baseUrl = `${req.protocol}://${req.headers.host}`;
        const links = generateHATEOASLinks(baseUrl, {
            id: product.id,
            category_id: product.category_id,
            id_supplier: product.id_supplier,
            name: product.name,
        });

        res.status(200).json({
            ...product,
            category,
            supplier,
            links,
        });
    } catch (error) {
        console.error("Błąd podczas odczytu danych JSON:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się pobrać danych." });
    }
});

export default router;