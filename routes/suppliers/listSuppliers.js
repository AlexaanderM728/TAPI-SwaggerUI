import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();
const suppliersFilePath = path.resolve("./data/suppliers.json");

/**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Pobierz listę dostawców
 *     description: Zwraca pełną listę dostawców dostępnych w systemie.
 *     tags:
 *       - Dostawcy
 *     responses:
 *       200:
 *         description: Lista dostawców
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_supplier:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Wells, Mendoza and Johnson"
 *                   contact_info:
 *                     type: object
 *                     properties:
 *                       address:
 *                         type: string
 *                         example: "123 Ulica, Miasto, PL 00-001"
 *                       phone:
 *                         type: string
 *                         example: "+48 123 456 789"
 *                   rating:
 *                     type: number
 *                     format: float
 *                     example: 4.7
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się pobrać listy dostawców."
 */

// GET /suppliers - Lista dostawców
router.get("/", async (req, res) => {
    try {
        const suppliers = await fs.readFile(suppliersFilePath, "utf-8").then(JSON.parse);
        res.status(200).json(suppliers);
    } catch (error) {
        console.error("Błąd podczas pobierania listy dostawców:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się pobrać listy dostawców." });
    }
});

export default router;