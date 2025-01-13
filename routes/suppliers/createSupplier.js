import express from "express";
import fs from "fs/promises";
import path from "path";
import checkAcceptHeader from "../../middleware/checkAcceptHeader.js";
import checkContentType from "../../middleware/checkContentType.js";
import checkRole from "../../middleware/checkRole.js";

const router = express.Router();
const suppliersFilePath = path.resolve("./data/suppliers.json");

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Dodaj nowego dostawcę
 *     description: Tworzy nowego dostawcę w systemie. Wszystkie pola są wymagane.
 *     tags:
 *       - Dostawcy
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nazwa dostawcy
 *                 example: "Dostawca ABC"
 *               contact_info:
 *                 type: object
 *                 description: Informacje kontaktowe dostawcy
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "123 Ulica, Miasto, PL 00-001"
 *                   phone:
 *                     type: string
 *                     example: "+48 123 456 789"
 *               rating:
 *                 type: number
 *                 format: float
 *                 description: Ocena dostawcy (od 0 do 5)
 *                 example: 4.7
 *             required:
 *               - name
 *               - contact_info
 *               - rating
 *     responses:
 *       201:
 *         description: Dostawca został pomyślnie utworzony
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_supplier:
 *                   type: integer
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: "Dostawca ABC"
 *                 contact_info:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                       example: "123 Ulica, Miasto, PL 00-001"
 *                     phone:
 *                       type: string
 *                       example: "+48 123 456 789"
 *                 rating:
 *                   type: number
 *                   format: float
 *                   example: 4.7
 *       400:
 *         description: Brak wymaganych danych do utworzenia dostawcy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Brak wymaganych danych do utworzenia dostawcy."
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się dodać dostawcy."
 */

// POST /suppliers - Dodawanie dostawcy
router.post("/", checkAcceptHeader, checkContentType,checkRole, async (req, res) => {
    const { name, contact_info, rating } = req.body;

    if (!name || !contact_info || !rating) {
        return res.status(400).json({ error: "Brak wymaganych danych do utworzenia dostawcy." });
    }

    try {
        const suppliers = await fs.readFile(suppliersFilePath, "utf-8").then(JSON.parse);

        const newSupplier = {
            id_supplier: suppliers.length + 1,
            name,
            contact_info,
            rating,
        };

        suppliers.push(newSupplier);

        await fs.writeFile(suppliersFilePath, JSON.stringify(suppliers, null, 2));

        res.status(201).json(newSupplier);
    } catch (error) {
        console.error("Błąd podczas dodawania dostawcy:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się dodać dostawcy." });
    }
});

export default router;