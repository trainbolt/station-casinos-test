import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../src/server/server";

const expect = chai.expect;
chai.use(chaiHttp);

describe("Users API tests", () => {
  it("should return all contacts", done => {
    chai
      .request(app)
      .get("/api/users")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(10);
        done();
      });
  });

  it("should return one contacts", done => {
    chai
      .request(app)
      .get("/api/users/1")
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(1);
        done();
      })
      .catch(err => {
        throw err;
      });
  });

  it("should return a 404 server error", done => {
    chai
      .request(app)
      .get("/api/users/11") // outside the range or contacts
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
