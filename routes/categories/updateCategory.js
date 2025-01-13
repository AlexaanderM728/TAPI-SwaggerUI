import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();
const categoriesFilePath = path.resolve("./data/categories.json");

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Zaktualizuj szczegóły kategorii
 *     description: Aktualizuje szczegóły kategorii na podstawie podanego ID. Można zaktualizować nazwę, kategorię główną oraz opis.
 *     tags:
 *       - Kategorie
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategorii, która ma zostać zaktualizowana
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nowa nazwa kategorii
 *                 example: "Nabiał zmodyfikowany"
 *               main_category:
 *                 type: string
 *                 description: Nowa kategoria główna
 *                 example: "Zmodyfikowane produkty mleczne"
 *               description:
 *                 type: string
 *                 description: Nowy opis kategorii
 *                 example: "Zmodyfikowane produkty mleczne i nabiałowe."
 *     responses:
 *       200:
 *         description: Kategoria została pomyślnie zaktualizowana
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
 *                   example: "Nabiał zmodyfikowany"
 *                 main_category:
 *                   type: string
 *                   example: "Zmodyfikowane produkty mleczne"
 *                 description:
 *                   type: string
 *                   example: "Zmodyfikowane produkty mleczne i nabiałowe."
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
 *                   example: "Błąd serwera. Nie udało się zaktualizować kategorii."
 */

// PATCH /categories/:id - Aktualizacja kategorii
router.patch("/:id", async (req, res) => {
    const categoryId = parseInt(req.params.id, 10);
    const updates = req.body;

    try {
        const categories = await fs.readFile(categoriesFilePath, "utf-8").then(JSON.parse);
        const categoryIndex = categories.findIndex((c) => c.id_category === categoryId);

        if (categoryIndex === -1) {
            return res.status(404).json({ error: `Kategoria o ID ${categoryId} nie została znaleziona.` });
        }

        categories[categoryIndex] = { ...categories[categoryIndex], ...updates };

        await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));

        res.status(200).json(categories[categoryIndex]);
    } catch (error) {
        console.error("Błąd podczas aktualizacji kategorii:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się zaktualizować kategorii." });
    }
});

export default router;