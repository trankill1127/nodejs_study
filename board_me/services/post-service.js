const { ObjectId } = require("mongodb");

const projectionOption = {
    projection: {
        password: 0,
        "comments.password": 0
    }
};

async function writePost(collection, post){
    post.hits=0;
    post.createdDt=new Date().toISOString();
    return await collection.insertOne(post);
}

async function getDetailPost(collection, id){
    return await collection.findOneAndUpdate(
        {_id: new ObjectId(id)}, {$inc: {hits: 1}}, projectionOption); 
}

const paginator = require("../utils/paginator");

async function list(collection, page, search){
    const perPage = 10;
    const query = {title: new RegExp(search, "i")}; //대소문자를 무시한 정규표현식
    const cursor = collection
        .find(query, {limit: perPage, skip: (page-1)*perPage}) //쿼리와 옵션
        .sort({createdDt: -1}); //등록일 기준 내림차순 정렬
    const totalCount = await collection.count(query); //query를 만족하는 document의 개수 반환
    const posts = await cursor.toArray();
    const paginatorObj = paginator({totalCount, page, perPage});

    return [posts, paginatorObj];
}

async function getPostByIdAndPassword(collection, {id, password}){
    return await collection.findOne({_id: new ObjectId(id), password}, projectionOption);
}

async function getPostById(collection, id){
    return await collection.findOne({_id: new ObjectId(id)}, projectionOption);
}

async function updatePost(collection, id, post){
    const toUpdatePost = { $set: { ...post } };
    return await collection.updateOne({_id: new ObjectId(id)}, toUpdatePost); //filter, update 내용
}

module.exports = {
    writePost,
    getDetailPost,
    list,
    getPostByIdAndPassword,
    getPostById,
    updatePost
}
