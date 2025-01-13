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
 * /suppliers/{id}:
 *   delete:
 *     summary: Usuń dostawcę
 *     description: Usuwa dostawcę na podstawie podanego ID.
 *     tags:
 *       - Dostawcy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dostawcy, który ma zostać usunięty
 *     responses:
 *       200:
 *         description: Dostawca został pomyślnie usunięty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dostawca o ID 5 został usunięty."
 *       404:
 *         description: Dostawca o podanym ID nie został znaleziony
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Dostawca o ID 5 nie został znaleziony."
 *       500:
 *         description: Błąd serwera
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Błąd serwera. Nie udało się usunąć dostawcy."
 */

// DELETE /suppliers/:id - Usuwanie dostawcy
router.delete("/:id", checkAcceptHeader, checkContentType, checkRole, async (req, res) => {
    const supplierId = parseInt(req.params.id, 10);

    try {
        const suppliers = await fs.readFile(suppliersFilePath, "utf-8").then(JSON.parse);
        const updatedSuppliers = suppliers.filter((s) => s.id_supplier !== supplierId);

        if (updatedSuppliers.length === suppliers.length) {
            return res.status(404).json({ error: `Dostawca o ID ${supplierId} nie został znaleziony.` });
        }

        await fs.writeFile(suppliersFilePath, JSON.stringify(updatedSuppliers, null, 2));

        res.status(200).json({ message: `Dostawca o ID ${supplierId} został usunięty.` });
    } catch (error) {
        console.error("Błąd podczas usuwania dostawcy:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się usunąć dostawcy." });
    }
});

export default router;