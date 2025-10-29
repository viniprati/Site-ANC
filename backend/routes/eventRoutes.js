const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/events -> Retorna todos os eventos
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/events -> Adiciona um novo evento (para admins)
router.post('/', async (req, res) => {
    const { name, date, description, icon } = req.body;
    const event = new Event({ name, date, description, icon });
    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/events/:id -> Remove um evento
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Evento não encontrado' });

        await event.deleteOne();
        res.json({ message: 'Evento removido com sucesso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;