
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
chai.use(chaiHttp)


chai.use(chaiHttp);


 
describe('/GET asikkaat', ()=>{
    it('it should get all the asiakkaat', (done) => {
        chai.request(server)
            .get('/asiakkaat')
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('array')
                done();
            })
    })
})
it('Wrong path', (done) => {
    chai.request(server)
    .get('/asiakkaat/all')
    .end((err, res) => {
        chai.expect(res).to.have.status(200)
        chai.expect(res.body).to.be.a('array')
        done();
    })
})