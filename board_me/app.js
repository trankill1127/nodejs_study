const express = require("express");
const app = express();

const mongodbConnection = require("./configs/mongodb-connection");

const handlebars = require("express-handlebars");

app.engine("handlebars", handlebars.create({helpers: require("./configs/handlebars-helpers")}).engine ); //파일 확장자, 템플릿 엔진 함수
app.set("view engine", "handlebars"); //view engine로 사용할 템플릿 엔진 등록
app.set("views", __dirname+"/views"); //템플릿의 위치를 views 디렉터리로 등록

//request의 body에 담긴 json 데이터를 사용하기 위한 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const postService = require("./services/post-service");

app.get("/", async (req, res) => { // '/'일 때, 이 함수를 수행
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    try {
        const [posts, paginator] = await postService.list(collection, page, search);
        res.render("home", {title: "!!!BOARD_ME!!!", search, paginator, posts}); // {~}를 전달하고 home.handlbars를 보여주고
    } catch (error) {
        console.error(error);
        res.render("home", {title: "!!!BOARD_ME!!!"});
    }
});

app.get("/write", (req, res) => { 
    res.render("write", {title: "!!!BOARD_ME!!!", mode: "create"}); 
});

app.get("/modify/:id", async (req, res) => { 
    const {id} = req.params.id;
    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render("write", {title: "!!!BOARD_ME!!!", mode: "modify", post});
});

app.post("/write", async (req,res) => {
    const post = req.body;
    const result = await postService.writePost(collection, post);
    res.redirect(`/detail/${result.insertedId}`);
});

app.post("/modify/", async(req, res) => {
    const {id, title, writer, password, content} = req.body;
    const post = {
        title,
        writer,
        password,
        content,
        createdDt: new Date().toISOString()
    };

    const result = await postService.updatePost(collection, id, post);
    res.redirect(`/detail/${id}`);
});

app.get("/detail/:id", async (req, res) => { 
    const result = await postService.getDetailPost(collection, req.params.id);
    res.render("detail", {
        title: "!!!BOARD_ME!!!", 
        post: result.value  
    }); 
});

app.post("/check-password", async(req, res) => {
    const { id, password } = req.body;
    const post = await postService.getPostByIdAndPassword(collection, {id, password});
    if (post) return res.json({isExist: true});
    else return res.status(404).json({isExist: false});
});

let collection;

//creates a listener on the specified port.
app.listen(3001, async () => { 
    console.log("---------- server start");
    const mongoCLI = await mongodbConnection();
    collection = mongoCLI.db("board").collection("post");
    console.log("---------- mongoDB connected");
}); 