import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();
const categoriesFilePath = path.resolve("./data/categories.json");

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Dodaj nową kategorię
 *     description: Tworzy nową kategorię w systemie. Nazwa i kategoria główna są wymagane.
 *     tags:
 *       - Kategorie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nazwa kategorii
 *                 example: "Nabiał"
 *               main_category:
 *                 type: string
 *                 description: Kategoria główna
 *                 example: "Produkty mleczne"
 *               description:
 *                 type: string
 *                 description: Dodatkowy opis kategorii
 *                 example: "Produkty mleczne i nabiałowe."
 *             required:
 *               - name
 *               - main_category
 *     responses:
 *       201:
 *         description: Kategoria została pomyślnie utworzona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_category:
 *                   type: integer
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: "Nabiał"
 *                 main_category:
 *                   type: string
 *                   example: "Produkty mleczne"
 *                 description:
 *                   type: string
 *                   example: "Produkty mleczne i nabiałowe."
 *       400:
 *         description: Brak wymaganych danych do utworzenia kategorii
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Brak wymaganych danych do utworzenia kategorii."
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się dodać kategorii."
 */

// POST /categories - Dodawanie kategorii
router.post("/", async (req, res) => {
    const { name, main_category, description } = req.body;

    if (!name || !main_category) {
        return res.status(400).json({ error: "Brak wymaganych danych do utworzenia kategorii." });
    }

    try {
        const categories = await fs.readFile(categoriesFilePath, "utf-8").then(JSON.parse);

        const newCategory = {
            id_category: categories.length + 1,
            name,
            main_category,
            description: description || "",
        };

        categories.push(newCategory);

        await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));

        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Błąd podczas dodawania kategorii:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się dodać kategorii." });
    }
});

export default router;