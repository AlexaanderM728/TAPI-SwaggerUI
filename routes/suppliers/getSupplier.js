import express from "express";
import fs from "fs/promises";
import path from "path";
import { generateHATEOASLinks } from "../../utils/generateHATEOASLinks.js";

const router = express.Router();
const suppliersFilePath = path.resolve("./data/suppliers.json");

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Pobierz szczegóły dostawcy
 *     description: Zwraca szczegóły dostawcy na podstawie podanego ID, w tym linki HATEOAS.
 *     tags:
 *       - Dostawcy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dostawcy, którego szczegóły mają zostać zwrócone
 *     responses:
 *       200:
 *         description: Szczegóły dostawcy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                           example: "123 Ulica, Miasto, PL 00-001"
 *                         phone:
 *                           type: string
 *                           example: "+48 123 456 789"
 *                     rating:
 *                       type: number
 *                       format: float
 *                       example: 4.7
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rel:
 *                         type: string
 *                         example: "suppliers_details"
 *                       method:
 *                         type: string
 *                         example: "GET"
 *                       href:
 *                         type: string
 *                         example: "http://localhost:8989/suppliers/1"
 *       400:
 *         description: Nieprawidłowy format ID dostawcy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nieprawidłowy format ID dostawcy."
 *       404:
 *         description: Nie znaleziono dostawcy o podanym ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nie znaleziono dostawcy o ID: 1"
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

// GET /suppliers/:id - Szczegóły dostawcy
router.get("/:id", async (req, res) => {
    const supplierId = parseInt(req.params.id, 10);
    console.log(`Otrzymano żądanie dla dostawcy o ID: ${supplierId}`);

    if (isNaN(supplierId)) {
        console.log("Nieprawidłowy format ID dostawcy.");
        return res.status(400).json({ error: "Nieprawidłowy format ID dostawcy." });
    }

    try {
        const suppliers = await fs.readFile(suppliersFilePath, "utf-8").then(JSON.parse);
        
        const supplier = suppliers.find(s => s.id_supplier === supplierId);

        if (!supplier) {
            return res.status(404).json({ error: `Nie znaleziono dostawcy o ID: ${supplierId}` });
        }

        const baseUrl = `${req.protocol}://${req.headers.host}`;
        const links = generateHATEOASLinks(baseUrl,{
            id: supplierId,
            category_id: "category_id",
            id_supplier: "id_supplier",
            name: "product name",
        });

        res.status(200).json({supplier, links});
    } catch (error) {
        console.error("Błąd podczas odczytu pliku JSON:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się pobrać danych." });
    }
});

export default router;