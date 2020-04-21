const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
require("../models/Postagem")
const Categoria = mongoose.model("categorias")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")




router.get('/posts', eAdmin, (req,res)=>{
    res.send("Pagina de posts")    
})

//CATEGORIA
router.get('/categorias', eAdmin, (req,res)=>{
    Categoria.find().lean().sort({date: "desc"}).then((categorias)=>{
        res.render("admin/categorias", {categorias:categorias})   
    }).catch((err)=>{
    req.flash("error_msg","Houve um erro ao listar as categorias")
    res.redirect("/admin")
    })
     
})
router.get('/categorias/add',  eAdmin, (req,res)=>{
    res.render("admin/addcategorias")    
})
router.post('/categorias/nova',  eAdmin,  (req,res)=>{
    var erros =[]
    if(!req.body.nome || typeof  req.body.nome== undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido" })
    }
    if(!req.body.slug || typeof  req.body.slug== undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido" })
    }    
    if(req.body.nome.length <2){
        erros.push({texto: "Nome muito pequeno" })

    }
    if(erros.length>0){
        res.render("admin/addcategorias", {erros: erros})
    }
    else{
        const novaCategoria = {
            nome : req.body.nome,
            slug : req.body.slug
        }
     new Categoria(novaCategoria).save().then(()=>{
         req.flash("success_msg","Categoria criada com sucesso.")
        res.redirect("/admin/categorias")

     }).catch((err)=>{
        req.flash("error_msg","Erro ao salvar ."+err)
        res.redirect("/admin")

     })
     
    } 
})
router.get('/categorias/edit/:id',  eAdmin,  (req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("admin/editcategorias",{categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg", "Essa categoria não existe")
        res.redirect("/admin/categorias")
    })
    
})
router.post("/categorias/edit",  eAdmin,  (req,res)=>{
    var erros =[]
    if(!req.body.nome || typeof  req.body.nome== undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido" })
    }
    if(!req.body.slug || typeof  req.body.slug== undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido" })
    }    
    if(req.body.nome.length <2){
        erros.push({texto: "Nome muito pequeno" })

    }
    if(erros.length>0){
        res.render("admin/addcategorias",  {erros: erros})
    }
    else{
        Categoria.findOne({_id:req.body.id}).then((categoria)=>{
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
            categoria.save().then(()=>{
                req.flash("success_msg", "Categoria atualizada")
                res.redirect("/admin/categorias")

            }).catch((err)=>{
                req.flash("error_msg", "Erro interno ao editar")
                res.redirect("/admin/categorias")
            })
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao editar")
            res.redirect("/admin/categorias")
        })

    }

})
router.post("/categorias/deletar",  eAdmin,   eAdmin,  (req,res)=>{
Categoria.remove({_id: req.body.id}).then(()=>{
    req.flash("success_msg", "Categoria deletada com sucesso")
    res.redirect("/admin/categorias")
}).catch((err)=>{
    req.flash("error_msg", "Erro ao remover categoria")
    res.redirect("/admin/categorias")

})
})
//POSTAGEM
router.get("/postagens", (req,res)=>{

    Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((postagens)=>{
        res.render("admin/postagens",{postagens:postagens})
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao carregar postagens") 
        res.redirect("/admin")
    })
    
})
router.get("/postagens/add",  eAdmin,  (req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/addpostagem" ,{categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao carregar formulário") 
        res.redirect("/admin")
    })
    
})
router.post('/postagens/nova',  eAdmin,  (req,res)=>{
    var erros =[]
    if(!req.body.titulo || typeof  req.body.titulo== undefined || req.body.titulo == null){
        erros.push({texto: "Titulo inválido" })
    }
    if(!req.body.slug || typeof  req.body.slug== undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido" })
    }    
    if(req.body.titulo.length <2){
        erros.push({texto: "Titulo muito pequeno" })

    }
    if(req.body.categoria=="0" || !req.body.categoria){
        erros.push({texto: "Categoria inválida" })
    }    
    if(erros.length>0){
        res.render("admin/addpostagem", {erros: erros})
    }

    else{
        const novaPostagem = {
            titulo : req.body.titulo,
            descricao : req.body.descricao,
            conteudo : req.body.conteudo,
            categoria : req.body.categoria,
            slug : req.body.slug
        }
     new Postagem(novaPostagem).save().then(()=>{
         req.flash("success_msg","Postagem criada com sucesso.")
        res.redirect("/admin/postagens")

     }).catch((err)=>{
        req.flash("error_msg","Erro ao salvar. "+err)
        res.redirect("/admin/postagens")

     })
     
    } 
})
router.get("/postagens/edit/:id",  eAdmin,  (req,res)=>{
    Postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render("admin/editpostagens", {categorias:categorias,postagem:postagem})

        }).catch((err)=>{
            req.flash("error_msg", "Erro ao procurar categorias")
            res.redirect("/admin/postagens")
        })

    }).catch((err)=>{
        req.flash("error_msg", "Erro ao carregar formulario de postagem")
        res.redirect("/admin/postagens")
    })
    

})

router.post("/postagem/edit", eAdmin, (req,res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{
        postagem.titulo     = req.body.titulo
        postagem.descricao  = req.body.descricao
        postagem.conteudo   = req.body.conteudo
        postagem.categoria  = req.body.categoria
        postagem.slug       = req.body.slug
        postagem.save().then(()=>{
            req.flash("success_msg", "Postagem editada com sucesso")  
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao salvar postagem")
            res.redirect("/admin/postagens")
        })


    }).catch((err)=>{
        console.log(err)
        req.flash("error_msg", "Erro ao editar postagem")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id",eAdmin, (req,res)=>{
    Postagem.remove({_id: req.params.id}).lean().then(()=>{
        req.flash("success_msg", "Postagem excluida")
        res.redirect("/admin/postagens")

    }).catch((err)=>{
        req.flash("error_msg", "Erro ao excluir postagem")
        res.redirect("/admin/postagens")

    })

})

module.exports = router   
