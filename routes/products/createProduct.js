import express from "express";
import fs from "fs/promises";
import path from "path";
import checkContentType from "../../middleware/checkContentType.js"; // Middleware do sprawdzania Content-Type
import checkAcceptHeader from "../../middleware/checkAcceptHeader.js"; // Middleware do sprawdzania Accept
import checkRole from "../../middleware/checkRole.js";

const router = express.Router();

// Ścieżki do plików
const productsFilePath = path.resolve("./data/products.json");
const categoriesFilePath = path.resolve("./data/categories.json");
const suppliersFilePath = path.resolve("./data/suppliers.json");

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Dodaj nowy produkt
 *     description: Tworzy nowy produkt w systemie. Produkt musi być przypisany do istniejącej kategorii i dostawcy.
 *     tags:
 *       - Produkty
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dream naturalny"
 *               category_id:
 *                 type: integer
 *                 example: 101
 *               id_supplier:
 *                 type: integer
 *                 example: 1
 *               nutritional_values:
 *                 type: object
 *                 properties:
 *                   carbohydrates:
 *                     type: number
 *                     format: float
 *                     example: 2.9
 *                   proteins:
 *                     type: number
 *                     format: float
 *                     example: 8.3
 *                   fats:
 *                     type: number
 *                     format: float
 *                     example: 3.3
 *             required:
 *               - name
 *               - category_id
 *               - id_supplier
 *               - nutritional_values
 *     responses:
 *       201:
 *         description: Produkt został pomyślnie utworzony
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produkt został pomyślnie utworzony."
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: "Dream naturalny"
 *                     category_id:
 *                       type: integer
 *                       example: 101
 *                     id_supplier:
 *                       type: integer
 *                       example: 1
 *                     nutritional_values:
 *                       type: object
 *                       properties:
 *                         carbohydrates:
 *                           type: number
 *                           format: float
 *                           example: 2.9
 *                         proteins:
 *                           type: number
 *                           format: float
 *                           example: 8.3
 *                         fats:
 *                           type: number
 *                           format: float
 *                           example: 3.3
 *       400:
 *         description: Nieprawidłowe dane wejściowe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Brak wymaganych danych. Upewnij się, że wszystkie pola są wypełnione."
 *       404:
 *         description: Kategoria lub dostawca nie istnieje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Podana kategoria nie istnieje."
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się utworzyć produktu."
 */

// POST /products - Tworzenie nowego produktu z użyciem middleware
router.post(
    "/",
    checkContentType, // Sprawdza Content-Type: application/json
    checkAcceptHeader,
    checkRole,
    async (req, res) => {
        const { name, category_id, id_supplier, nutritional_values } = req.body;

        // Walidacja danych wejściowych
        if (!name || !category_id || !id_supplier || !nutritional_values) {
            return res.status(400).json({
                error: "Brak wymaganych danych. Upewnij się, że wszystkie pola są wypełnione.",
            });
        }

        try {
            // Odczyt danych z plików
            const [products, categories, suppliers] = await Promise.all([
                fs.readFile(productsFilePath, "utf-8").then(JSON.parse),
                fs.readFile(categoriesFilePath, "utf-8").then(JSON.parse),
                fs.readFile(suppliersFilePath, "utf-8").then(JSON.parse),
            ]);

            // Sprawdzenie, czy kategoria istnieje
            const categoryExists = categories.some((c) => c.id_category === category_id);
            if (!categoryExists) {
                return res.status(404).json({ error: "Podana kategoria nie istnieje." });
            }

            // Sprawdzenie, czy dostawca istnieje
            const supplierExists = suppliers.some((s) => s.id_supplier === id_supplier);
            if (!supplierExists) {
                return res.status(404).json({ error: "Podany dostawca nie istnieje." });
            }

            // Generowanie nowego ID dla produktu
            const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

            // Tworzenie nowego produktu
            const newProduct = {
                id: newId,
                name,
                category_id,
                id_supplier,
                nutritional_values,
            };

            // Dodanie produktu do listy
            products.push(newProduct);

            // Zapisanie zaktualizowanej listy produktów do pliku
            await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

            res.status(201).json({
                message: "Produkt został pomyślnie utworzony.",
                product: newProduct,
            });
        } catch (error) {
            console.error("Błąd podczas tworzenia produktu:", error);
            res.status(500).json({ error: "Błąd serwera. Nie udało się utworzyć produktu." });
        }
    }
);

export default router;