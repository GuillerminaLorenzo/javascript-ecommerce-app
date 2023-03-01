const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const newProductTemplate = require('../../views/admin/products/new');
const indexProductTemplate = require('../../views/admin/products/index');
const { requireTitle, requirePrice } = require('./validators');
const { handleErrors, requireAuth } = require('./middlewares');


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.get('/admin/products', requireAuth, async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(indexProductTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
    res.send(newProductTemplate({}));
});

router.post('/admin/products/new', 
    requireAuth,
    upload.single('image'),
    [requireTitle, requirePrice], 
    handleErrors(newProductTemplate),
    async (req, res) => {
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });

        res.redirect('/admin/products');
    }
);

module.exports = router;