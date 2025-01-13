import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();
const categoriesFilePath = path.resolve("./data/categories.json");

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Pobierz szczegóły kategorii
 *     description: Zwraca szczegóły kategorii na podstawie podanego ID.
 *     tags:
 *       - Kategorie
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategorii, której szczegóły mają zostać zwrócone
 *     responses:
 *       200:
 *         description: Szczegóły kategorii
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_category:
 *                   type: integer
 *                   example: 101
 *                 name:
 *                   type: string
 *                   example: "Nabiał"
 *                 main_category:
 *                   type: string
 *                   example: "Produkty mleczne"
 *                 description:
 *                   type: string
 *                   example: "Produkty mleczne i nabiałowe."
 *       404:
 *         description: Kategoria o podanym ID nie została znaleziona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Kategoria o ID 101 nie została znaleziona."
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się pobrać kategorii."
 */

// GET /categories/:id - Szczegóły kategorii
router.get("/:id", async (req, res) => {
    const categoryId = parseInt(req.params.id, 10);

    try {
        const categories = await fs.readFile(categoriesFilePath, "utf-8").then(JSON.parse);
        const category = categories.find((c) => c.id_category === categoryId);

        if (!category) {
            return res.status(404).json({ error: `Kategoria o ID ${categoryId} nie została znaleziona.` });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się pobrać kategorii." });
    }
});

export default router;