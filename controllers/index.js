
const express = require ('express');
const Router = express.Router;

// import api from './api';

module.exports = (...args) => {

    const router = Router();

    // router.all('/maria', async (req, res) => {

    //     try {

    //         const man = knex('maria').model.common;

    //         const list = await man.query(`SHOW TABLES`);

    //         res.jsonNoCache(list);
    //     }
    //     catch (e) {

    //         log.t('userprovider: query error');

    //         log.dump({
    //             location: 'controllers => index.js => /maria',
    //             err,
    //         }, 4);

    //         return res.jsonError('Server error');
    //     }
    // });


    // router.use('/api', api(...args));
    
    return router;
}
