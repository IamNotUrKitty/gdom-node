import chai from "chai"
import chaiAsPromised from "chai-as-promised"
import fs from "fs"
import express from "express"
import gdom from "../src/gdom-node"

chai.should();
chai.use(chaiAsPromised);


const app = express();
app.get('/', (req,res)=>{
    res.send(fs.readFileSync("./tests/html/test.html", "utf8"))
});
app.listen(3333);

let query = `{
                page(url:"http://localhost:3333"){
                    text:text(selector:".text")
                    attr:attr(selector:".attr", name:"href")
                    tag:tag(selector:".attr")
                    items:query(selector:".list-next .item"){
                      text
                    }
                    itemsHtml:query(selector:".list .item"){
                      html:html
                    }
                    next:next(selector:".list-next"){
                      text
                    }
                }
            }`;

describe("GDOM parser", ()=>{
    let result;
    before(()=> {
        result = gdom.parse(query);
    });

    describe("text()", ()=>{
        it("Get text from given selector", ()=>{
            return result.should.eventually.to.have.deep.property('data.page.text', 'text')
        })
    });

    describe("attr()", ()=>{
        it("Get attr from given selector and attr name", ()=>{
            return result.should.eventually.to.have.deep.property('data.page.attr', '/href')
        })
    });

    describe("query()", ()=>{
        it("Get elements queried by selector", ()=>{
            return result.should.eventually.to.have.deep.property('data.page.items')
                         .that.is.an('array')
                         .with.deep.property('[1]')
                         .that.deep.equals({"text":"4"});
        })
    });

    describe("html()", ()=>{
        it("Get element innerHtml", ()=>{
            return result.should.eventually.to.have.deep.property('data.page.itemsHtml')
                .that.is.an('array')
                .with.deep.property('[1]')
                .that.deep.equals({"html":'<span>b</span>'});
        })
    });

    describe("tag()",()=>{
        it("Get element tag", ()=>{
            return result.should.eventually.to.have.deep.property('data.page.tag','a')
        })
    });

    describe("next()", ()=>{
        it("Get next element(sibling)", ()=>{
            return result.should.eventually.to.have.deep.property('data.page.next.text','Next')
        })
    })
});

