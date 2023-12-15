let matrizDePessoas = require("./mock")
const express = require("express")
const app = express();
const cors = require("cors");
const procurarPessoa = require("./procurarPessoa");
const bcrypt = require("bcrypt")
const validator = require("email-validator");
const jwt  = require("jsonwebtoken");

app.use(cors())
app.use(express.json())

function verificarToken(req, res, next){

    const tokenOk = req.header("Authorization")

    if(!tokenOk){

        res.sendStatus(401);
        return
    }

    jwt.verify(tokenOk,"CG2023", function(err, decod){

        if(err){
            res.sendStatus(401);
        }

        req.jwtDecodificado = decod
        next();

    })

 
}


app.get("/pessoas",verificarToken,function(req,res){

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

app.get("/pessoas/:nome", verificarToken, function(req, res){

    const pessoapesquisada = procurarPessoa(req.params.nome,"nome");
    res.json(pessoapesquisada)

})

app.post("/pessoas",  async function(req, res){

    const arrayDeErros = [];


    if (!req.body.nome){

        arrayDeErros.push("É necessário informar o nome!");
    }

    if (!req.body.email){
        
        arrayDeErros.push("É necessário informar o email!")
    }

    if (!req.body.senha){

        arrayDeErros.push("É necessário informar a senha")
    }

    const pessoaExistente = procurarPessoa(req.body.email,"email")

    if (pessoaExistente){
        
        arrayDeErros.push("Email já cadastrado.😒")
    }

    if (!validator.validate (req.body.email)){

        arrayDeErros.push("Formato de email inválido. 😢")

    }

    if (arrayDeErros.length >=1){

        res.json(arrayDeErros)
        return 

    }

    const senhaHasheada = await bcrypt.hash(req.body.senha, 5);

    req.body.senha = senhaHasheada;

    matrizDePessoas.push(req.body)
    res.json("Pessoa cadastrada. ✔")


})

app.post("/auth",  async function(req, res ){

    const pessoa = procurarPessoa(req.body.email,"email");

    if(!pessoa){

        res.json("Email ou senha incorretos.")
        return

    }

    const senhaCorreta =  await bcrypt.compare(req.body.senha, pessoa.senha) 

    if(!senhaCorreta){

        res.json("Email ou senha incorretos.")
        return

    }

   const token = jwt.sign({

    nome: pessoa.nome,
    email: pessoa.email,


   }, "CG2023", {
    expiresIn :'2h'
   })

   res.json(token);


});


app.delete("/pessoas/:nome", verificarToken, function(req, res){

    const pessoa = procurarPessoa(req.params.nome,"nome");

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

app.put("/pessoas/:nome", verificarToken, function(req, res){

    const pessoa = procurarPessoa(req.params.nome,"nome");

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


