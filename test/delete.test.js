/*let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../backend/app');

chai.use(chaiHttp);

describe('/DELETE asiakkaat', () => {
    it('should delete a user', async () => { // Wrap test function in async
        const res = await chai.request('http://localhost:3000') // Use await here
            .delete('/asiakkaat/test');

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('message').equal('Käyttäjä poistettu.');
    });
});*/