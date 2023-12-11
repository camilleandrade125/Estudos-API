let result = require("./mock")
const express = require("express")
const app = express();
const cors = require("cors");
const procurarPessoa = require("./procurarPessoa");


app.use(cors())
app.use(express.json())


app.get("/pessoas", function(req,res){
    
    res.json(result)

});

app.get("/pessoas/:nome", function(req, res){

    const pessoapesquisada = procurarPessoa(req.params.nome)
    res.json(pessoapesquisada[0])

})

app.post("/pessoas", function(req, res){
        
    const pessoaExistente = procurarPessoa(req.body.nome)
        if (pessoaExistente){
            
            res.json("Pessoa já existente!")
            return;
        }

        result.push(req.body)
        res.json("Pessoa cadastrada.")


})

app.delete("/pessoas/:nome", function(req, res){

    const pessoa = procurarPessoa(req.params.nome);

    console.log(!!pessoa);

    console.log(!pessoa);

    if( !pessoa){

        res.json('Pessoa não existente');

        return

    }

    const arrayComPessoaDeletada = result.filter( pessoa => {
        if (pessoa.nome != req.params.nome){

            return pessoa;
            
        }    
    })

    result = arrayComPessoaDeletada 
    res.json("Pessoa deletada.")
    console.log("Pessoa deletada!")
})

app.listen(3001, function(){
    console.log("Executando na porta 3001")
    
})