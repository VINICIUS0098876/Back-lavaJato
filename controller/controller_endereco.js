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

const setDeletarEndereco = async function(id){
    try {
        let idEndereco = id

        if(idEndereco == '' || idEndereco == undefined || idEndereco == isNaN(idEndereco) || idEndereco == null){
            return message.ERROR_INVALID_ID //400
        }else{
           let deleteEndereco = await enderecoDAO.deleteEndereco(idEndereco)
           
           if(deleteEndereco){
            return message.SUCCESS_DELETED_ITEM //200
           }else{
            return message.ERROR_NOT_FOUND //400
           }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER //500
    }
}

const setListarEnderecos = async function(){
    let enderecoJSON = {}

    let dadosEndereco = await enderecoDAO.getEndereco()

    if(dadosEndereco == '' || dadosEndereco == undefined){
        return message.ERROR_INVALID_ID //400
    }else{
        if(dadosEndereco){
            if(dadosEndereco.length > 0){
                enderecoJSON.servico = dadosEndereco
                enderecoJSON.quantidade = dadosEndereco.length
                enderecoJSON.status_code = 200

                return enderecoJSON
            }else{
                return message.ERROR_NOT_FOUND //400
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }
}

module.exports = {
    setListarEnderecosPeloId,
    setDeletarEndereco,
    setListarEnderecos
}