const result = require ("./mock.js")

function procurarPessoa(nome){
    const pessoaExistente = result.find( pessoa =>{
        if (pessoa.nome === nome)
        {
            return pessoa;

        }
    })

    return pessoaExistente
}

module.exports = procurarPessoa