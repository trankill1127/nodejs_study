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

module.exports = {
    writePost,
    getDetailPost,
}
