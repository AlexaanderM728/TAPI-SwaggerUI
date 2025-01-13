import express from "express";
import fs from "fs/promises";
import path from "path";

const router = express.Router();
const categoriesFilePath = path.resolve("./data/categories.json");

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Usuń kategorię
 *     description: Usuwa kategorię na podstawie podanego ID.
 *     tags:
 *       - Kategorie
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategorii, która ma zostać usunięta
 *     responses:
 *       200:
 *         description: Kategoria została pomyślnie usunięta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Kategoria o ID 5 została usunięta."
 *       404:
 *         description: Kategoria o podanym ID nie została znaleziona
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Kategoria o ID 5 nie została znaleziona."
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się usunąć kategorii."
 */

// DELETE /categories/:id - Usuwanie kategorii
router.delete("/:id", async (req, res) => {
    const categoryId = parseInt(req.params.id, 10);

    try {
        const categories = await fs.readFile(categoriesFilePath, "utf-8").then(JSON.parse);
        const updatedCategories = categories.filter((c) => c.id_category !== categoryId);

        if (updatedCategories.length === categories.length) {
            return res.status(404).json({ error: `Kategoria o ID ${categoryId} nie została znaleziona.` });
        }

        await fs.writeFile(categoriesFilePath, JSON.stringify(updatedCategories, null, 2));

        res.status(200).json({ message: `Kategoria o ID ${categoryId} została usunięta.` });
    } catch (error) {
        console.error("Błąd podczas usuwania kategorii:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się usunąć kategorii." });
    }
});

export default router;