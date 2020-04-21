if(process.env.NODE_ENV =="production"){
    module.exports = {mongoURI: "mongodb+srv://userw:<Senhas7775965>@cluster0-n1qzq.mongodb.net/test?retryWrites=true&w=majority"}
}else{    
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}

}