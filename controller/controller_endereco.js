const { application } = require('express')
const enderecoDAO = require('../model/DAO/endereco.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setListarEnderecosPeloId = async function(id){
    try {
        // Recebe o id do filme
     
    let idEndereco = id

    //Cria o objeto JSON
    let enderecoJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idEndereco == '' || idEndereco == undefined || isNaN(idEndereco)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosEndereco = await enderecoDAO.getEnderecoById(idEndereco)

        // Validação para verificar se existem dados de retorno
        if(dadosEndereco){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosEndereco.length > 0){
                //Criar o JSON de retorno
                enderecoJSON.endereco = dadosEndereco
                enderecoJSON.status_code = 200
    
                
                return enderecoJSON
            }else{
                return message.ERROR_NOT_FOUND // 404
            }

        }else{
            return message.ERROR_INTERNAL_SERVER_DB // 500
        }
    }
   } catch (error) {
       return message.ERROR_INTERNAL_SERVER_DB
   }
}

module.exports = {
    setListarEnderecosPeloId
}