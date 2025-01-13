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
 *   patch:
 *     summary: Zaktualizuj dane dostawcy
 *     description: Aktualizuje szczegóły dostawcy na podstawie podanego ID.
 *     tags:
 *       - Dostawcy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID dostawcy, który ma zostać zaktualizowany
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nowa nazwa dostawcy
 *                 example: "Nowy dostawca"
 *               contact_info:
 *                 type: object
 *                 description: Nowe informacje kontaktowe dostawcy
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "456 Nowa Ulica, Miasto, PL 00-002"
 *                   phone:
 *                     type: string
 *                     example: "+48 987 654 321"
 *               rating:
 *                 type: number
 *                 format: float
 *                 description: Nowa ocena dostawcy
 *                 example: 4.9
 *     responses:
 *       200:
 *         description: Dostawca został pomyślnie zaktualizowany
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
 *                   example: "Nowy dostawca"
 *                 contact_info:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: string
 *                       example: "456 Nowa Ulica, Miasto, PL 00-002"
 *                     phone:
 *                       type: string
 *                       example: "+48 987 654 321"
 *                 rating:
 *                   type: number
 *                   format: float
 *                   example: 4.9
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
 *                   example: "Błąd serwera. Nie udało się zaktualizować dostawcy."
 */

// PATCH /suppliers/:id - Aktualizacja dostawcy
router.patch("/:id", checkAcceptHeader, checkContentType, checkRole, async (req, res) => {
    const supplierId = parseInt(req.params.id, 10);
    const updates = req.body;

    try {
        const suppliers = await fs.readFile(suppliersFilePath, "utf-8").then(JSON.parse);
        const supplierIndex = suppliers.findIndex((s) => s.id_supplier === supplierId);

        if (supplierIndex === -1) {
            return res.status(404).json({ error: `Dostawca o ID ${supplierId} nie został znaleziony.` });
        }

        suppliers[supplierIndex] = { ...suppliers[supplierIndex], ...updates };

        await fs.writeFile(suppliersFilePath, JSON.stringify(suppliers, null, 2));

        res.status(200).json(suppliers[supplierIndex]);
    } catch (error) {
        console.error("Błąd podczas aktualizacji dostawcy:", error);
        res.status(500).json({ error: "Błąd serwera. Nie udało się zaktualizować dostawcy." });
    }
});

export default router;