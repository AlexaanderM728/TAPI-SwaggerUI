import express from "express";
import fs from "fs/promises";
import path from "path";
import checkContentType from "../../middleware/checkContentType.js";
import checkAcceptHeader from "../../middleware/checkAcceptHeader.js";
import checkRole from "../../middleware/checkRole.js";

const router = express.Router();

// Ścieżka do pliku z produktami
const productsFilePath = path.resolve("./data/products.json");

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Usuń produkt
 *     description: Usuwa produkt na podstawie podanego ID. Operacja wymaga odpowiednich uprawnień.
 *     tags:
 *       - Produkty
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produktu, który ma zostać usunięty
 *     responses:
 *       200:
 *         description: Produkt został pomyślnie usunięty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produkt o ID 1 został usunięty."
 *                 removedProduct:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
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
 *       404:
 *         description: Produkt o podanym ID nie istnieje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Produkt o ID 1 nie istnieje."
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się usunąć produktu."
 */

// DELETE /products/:id - Usunięcie produktu
router.delete(
    "/:id",
    checkAcceptHeader, // Middleware do sprawdzania nagłówka Accept
    checkContentType, // Middleware do sprawdzania Content-Type
    checkRole, // Middleware do sprawdzania uprawnień (role)
    async (req, res) => {
        const productId = parseInt(req.params.id, 10);

        try {
            // Odczytanie danych z pliku JSON
            const products = await fs.readFile(productsFilePath, "utf-8").then(JSON.parse);

            // Znalezienie indeksu produktu
            const productIndex = products.findIndex((p) => p.id === productId);

            if (productIndex === -1) {
                return res.status(404).json({ error: `Produkt o ID ${productId} nie istnieje.` });
            }

            // Usunięcie produktu
            const removedProduct = products.splice(productIndex, 1);

            // Zapisanie zaktualizowanej listy produktów do pliku
            await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

            res.status(200).json({
                message: `Produkt o ID ${productId} został usunięty.`,
                removedProduct: removedProduct[0],
            });
        } catch (error) {
            console.error("Błąd podczas usuwania produktu:", error);
            res.status(500).json({ error: "Błąd serwera. Nie udało się usunąć produktu." });
        }
    }
);

export default router;