const path = require('path');

const createViewApi = app => {
    app.get('/', async (request, response) => {
        if (request.session.id === 1) {
            return response.sendFile(path.join(__dirname, 'superAdminSite.html'));
        }
        else if (request.session.id) {
            return response.sendFile(path.join(__dirname, 'site.html'));
        }
        else {
            return response.sendFile(path.join(__dirname, '../index.html'));
        }
    });

    app.get('/storeData', async (request, response) => {
        return response.sendFile(path.join(__dirname, 'storeData.html'));
    });

    app.get('/register', async (request, response) => {
        return response.sendFile(path.join(__dirname, 'register.html'));
      });

};

module.exports = {
    createViewApi
};