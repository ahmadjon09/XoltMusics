import { Router } from 'express';
import Top from '../../database/models/Top.js';
const router = Router();

router.get("/", async (_, res) => {
    try {
        const top = await Top.find().sort({ index: 1 });
        res.json(top);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
