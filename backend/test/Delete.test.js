let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');

chai.use(chaiHttp);

describe('/DELETE asiakkaat', () => {
    it('should delete a user', async () => { // Wrap test function in async
        const res = await chai.request('http://localhost:3001') // Use await here
            .delete('/asiakkaat/testi');

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('message').equal('Käyttäjä poistettu.');
    });
}); 