if(process.env.NODE_ENV =="production"){
    module.exports = {mongoURI: "mongodb://userw:#$Senhas77@cluster0-shard-00-00-n1qzq.mongodb.net:27017,cluster0-shard-00-01-n1qzq.mongodb.net:27017,cluster0-shard-00-02-n1qzq.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"}
}else{    
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}

}