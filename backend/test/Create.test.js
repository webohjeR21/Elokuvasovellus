let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');

chai.use(chaiHttp);

describe('/POST', () => {
    it('should post a new user', async () => { 
        const res = await chai.request('http://localhost:3001')
            .post('/register')
            .send({ username: 'testikäyttis', password: 'testpassword', email: 'testikäyttis@gmail.com' });

        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('message').equal('User registered successfully');
    });

    it('should return an error when username is missing', async () => {
        const res = await chai.request('http://localhost:3001')
            .post('/register')
            .send({ password: 'testpassword', email: 'testuser@gmail.com' });

        chai.expect(res).to.have.status(400);
        chai.expect(res.body).to.have.property('error').equal('Username cannot be null or empty');
    });

    it('should return an error when username or email already exists', async()=> {
        const res = await chai.request('http://localhost:3001')
            .post('/register')
            .send({ username: 'testikäyttäjä', password: 'testpassword', email: 'test@gmail.com' });

        chai.expect(res).to.have.status(400);
        chai.expect(res.body).to.have.property('error').equal('Username or email already exists');

    });
});