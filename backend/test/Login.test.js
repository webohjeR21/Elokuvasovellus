let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');

chai.use(chaiHttp);

describe('/POST asiakkaat', () => {
    it('should log in a user and return a jwt token', async () => {
         const userData = {
            username: 'samuli',
            password: '123'
         }
        const res = await chai.request('http://localhost:3001')
            .post('/login')
            .send(userData);

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('token');
    });
    
    it('should return an error for invalid username or password', async() => {
        const invalidUserData = {
            username: 'käyttäjänimi',
            password: 'salasana'
        };
        
        const res = await chai.request('http://localhost:3001')
        .post('/login')
        .send(invalidUserData);

        chai.expect(res).to.have.status(401);
        chai.expect(res.body).to.have.property('error')
    });
}); 