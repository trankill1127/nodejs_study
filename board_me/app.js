const express = require("express");
const app = express();

const mongodbConnection = require("./configs/mongodb-connection");

const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars.engine()); //파일 확장자, 템플릿 엔진 함수
app.set("view engine", "handlebars"); //view engine로 사용할 템플릿 엔진 등록
app.set("views", __dirname+"/views"); //템플릿의 위치를 views 디렉터리로 등록

app.get("/", (req, res) => { // '/'일 때, 이 함수를 수행
    res.render("home", {title: "!!!BOARD_ME!!!"}); // {~}를 전달하고 home.handlbars를 보여주고
});

app.get("/write", (req, res) => { 
    res.render("write", {title: "!!!BOARD_ME!!!"}); 
});

app.get("/detail", (req, res) => { 
    res.render("detail", {title: "!!!BOARD_ME!!!"}); 
});

let collection;

//creates a listener on the specified port.
app.listen(3003, async () => { 
    console.log("---------- server start");
    const mongoCLI = await mongodbConnection();
    collection = mongoCLI.db("board").collection("post");
    console.log("---------- mongoDB connected");
}); 