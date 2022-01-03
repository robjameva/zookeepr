const path = require('path');
const router = require('express').Router();

router.get('/', (res, req) => {
    req.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/animals', (res, req) => {
    req.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (res, req) => {
    req.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

router.get('*', (res, req) => {
    req.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;