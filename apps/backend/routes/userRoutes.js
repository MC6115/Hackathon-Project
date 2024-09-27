const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.post('/', async (req, res) => {
    const { email, fullname } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, fullname });
            await user.save();
        }
        res.status(200).json({ id: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;