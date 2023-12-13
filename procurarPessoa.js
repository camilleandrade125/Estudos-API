const result = require ("./mock.js")

function procurarPessoa(valorDeComparacao, pramsDeObjt){
    const pessoaExistente = result.find( pessoa =>{
        if (pessoa[pramsDeObjt] === valorDeComparacao)
        {
            return pessoa;

        }
    })

    return pessoaExistente
}

module.exports = procurarPessoa