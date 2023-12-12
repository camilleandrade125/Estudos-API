let matrizDePessoas = require("./mock")
const express = require("express")
const app = express();
const cors = require("cors");
const procurarPessoa = require("./procurarPessoa");


app.use(cors())
app.use(express.json())

fetch 

app.get("/pessoas", function(req,res){

    if (req.query.nome){
        const usuariosFiltradosPeloNome = matrizDePessoas.filter(function(pessoa){

            if (pessoa.nome.includes(req.query.nome)){
                
                return pessoa;

            }


        })
        res.json(usuariosFiltradosPeloNome)

        return 
    }
    
    res.json(matrizDePessoas)
    

});

app.get("/pessoas/:nome", function(req, res){

    const pessoapesquisada = procurarPessoa(req.params.nome)
    res.json(pessoapesquisada[0])

})

app.post("/pessoas", function(req, res){
        
    const pessoaExistente = procurarPessoa(req.body.nome)
    
    if (!req.body.nome){

        return res.json("É necessário enviar um nome!")
    }

        if (pessoaExistente){
            
            res.json("Pessoa já existente!")
            return;
        }

        matrizDePessoas.push(req.body)
        res.json("Pessoa cadastrada.")


})

app.delete("/pessoas/:nome", function(req, res){

    const pessoa = procurarPessoa(req.params.nome);

    if( !pessoa){

        res.json('Pessoa não existente');

        return

    }

    const arrayComPessoaDeletada = matrizDePessoas.filter( pessoa => {
        if (pessoa.nome != req.params.nome){

            return pessoa;
            
        }    
    })

    matrizDePessoas = arrayComPessoaDeletada 
    res.json("Pessoa deletada.")
    console.log("Pessoa deletada!")
})

app.listen(3001, function(){
    console.log("Executando na porta 3001")
    
})

app.put("/pessoas/:nome", function(req, res){

    const pessoa = procurarPessoa(req.params.nome);

    if (!req.body.nome){

        return res.json("É necessário enviar o nome!")
        
    }

    if( !pessoa){

        res.json('Pessoa não existente');

        return

    }

    pessoa.nome = req.body.nome
    console.log(pessoa)

    res.json("Nome atualizado com sucesso.");


   
})


