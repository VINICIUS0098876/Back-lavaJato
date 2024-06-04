const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use((request, response, next) =>{

    // Permite especificar quem podera acessar a API ('*' = Liberar acesso público, 'IP' = Liberar acesso apenas para aquela maquina);
    response.header('Access-Control-Allow-Origin', '*')

    // Permite especificar como a API, sera requisitada ('GET', 'POST', 'PUT' e 'DELETE')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    // Ativa as confgurações de cors
    app.use(cors())


    next()
})

const bodyParserJSON = bodyParser.json()

/********************************************************** IMPORTAÇÕES DAS CONTROLLERS ************************************************/

const controllerCliente = require('./controller/controller_cliente.js')

const controllerServico = require('./controller/controller_servico.js')

/********************************************************** ENDPOINTS CLIENTE *********************************************************/
app.get('/v2/lavaRapido/cliente', cors(), async function(request, response){


    // -> Chama a função da controller para retornar todos os filmes
    let dadosCliente = await controllerCliente.getListarTodosClientes()

    // -> validação para verificar se existem dados a serem retornados
    response.status(dadosCliente.status_code)
    response.json(dadosCliente)
})

app.delete('/v2/lavaRapido/cliente/:id', cors(), async function(request, response, next){
        let idCliente = request.params.id

        let dadosCliente = await controllerCliente.setExcluirCliente(idCliente)

        response.status(dadosCliente.status_code)
        response.json(dadosCliente)
})

app.post('/v2/lavaRapido/cliente', cors(), bodyParserJSON, async function(request, response){

   
    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Recebe todos os dados encaminhados na requisição pelo Body
    let dadosBody = request.body

    //Encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoCliente = await controllerCliente.setInserirNovoCliente(dadosBody, contentType)
    response.status(200)
    response.json(resultDadosNovoCliente)
})

/*********************************************************** ENDPOINTS SERVIÇOS *****************************************************/
app.get('/v2/lavaRapido/servico', cors(), async function(request, response){


    // -> Chama a função da controller para retornar todos os filmes
    let dadosServico = await controllerServico.setListarServicos()

    // -> validação para verificar se existem dados a serem retornados
    response.status(dadosServico.status_code)
    response.json(dadosServico)
})

app.get('/v2/lavaRapido/filme/:id', cors(), async function(request, response, next){

    // Recebe o id da requisição
    let idServico = request.params.id
    // Encaminha o ID para a controller buscar o Filme
    let dadosServico = await controllerServico.setListarServicoPeloId(idServico)

    //
    response.status(200)
    response.json(dadosServico)
})

app.delete('/v2/lavaRapido/servico/:id', cors(), async function(request, response, next){
    let idServico = request.params.id

    let dadosServico = await controllerServico.setExcluirServico(idServico)

    response.status(200)
    response.json(dadosServico)
})

app.post('/v2/lavaRapido/servico', cors(), bodyParserJSON, async function(request, response){

   
    // Recebe o content-type da requisição
    let contentType = request.headers['content-type']

    //Recebe todos os dados encaminhados na requisição pelo Body
    let dadosBody = request.body

    //Encaminha os dados para a controller enviar para o DAO
    let resultDadosNovoServico = await controllerServico.setInserirNovoServico(dadosBody, contentType)
    response.status(200)
    response.json(resultDadosNovoServico)
})

app.put('/v2/lavaRapido/servico/:id', cors(), bodyParserJSON, async function(request, response){
    let contentType = request.headers['content-type']
    let dadosBody = request.body
    let idServico = request.params.id

    let dadosServico = await controllerServico.setAtualizarServico(idServico, dadosBody, contentType)

    console.log(dadosServico)
    response.status(200)
    response.json(dadosServico)
})



app.listen('8080', function(){
    console.log('API funcionando!!')
})