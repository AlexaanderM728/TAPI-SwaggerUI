import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();
const categoriesFilePath = path.resolve("./data/categories.json");

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Pobierz listę kategorii
 *     description: Zwraca pełną listę kategorii dostępnych w systemie.
 *     tags:
 *       - Kategorie
 *     responses:
 *       200:
 *         description: Lista kategorii
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_category:
 *                     type: integer
 *                     example: 101
 *                   name:
 *                     type: string
 *                     example: "Nabiał"
 *                   main_category:
 *                     type: string
 *                     example: "Produkty mleczne"
 *                   description:
 *                     type: string
 *                     example: "Produkty mleczne i nabiałowe."
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się pobrać listy kategorii."
 */

// GET /categories - Lista kategorii
router.get("/", async (req, res) => {
    try {
        const categories = await fs.readFile(categoriesFilePath, "utf-8").then(JSON.parse);
        res.status(200).json(categories);
    } catch (error) {
        console.error("Błąd podczas pobierania listy kategorii:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się pobrać listy kategorii." });
    }
});

export default router;