const { application } = require('express')
const dataDAO = require('../model/DAO/data.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirNovaData = async function(dadosData, contentType){
    
    try{
        let validateStatus = false

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // Cria o objeto JSON para devolver os dados criados na requisição
                let novaDataJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadosData.datas == ''    || dadosData.datas == undefined      || dadosData.datas == null         || dadosData.datas.length > 10
                ){
                    

                    return message.ERROR_REQUIRED_FIELDS
                    
                }
            
                else{
                   

                    validateStatus=true
                    
                    
                    // Validação para verificar se a variavel booleana é verdadeira
                    if(validateStatus){
                        

            
                        // Encaminha os dados do filme para o DAO inserir no DB
                        let novaData = await dataDAO.insertData(dadosData)
                        
                        
                        
                        if(novaData){
                            let idDatas = await dataDAO.dataID()
                            dadosData.id = Number(idDatas[0].id)
                        }
                
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(novaData){
                            //Cria o JSON de retorno dos dados (201)
                            novaDataJSON.data       = dadosData
                            novaDataJSON.status = message.SUCCESS_CREATED_ITEM.status
                            novaDataJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            novaDataJSON.message = message.SUCCESS_CREATED_ITEM.message
                
                            return novaDataJSON //201
                            
                        }else{
                            return message.ERROR_INTERNAL_SERVER_DB //500
                        }
                    }else{
                        validateStatus = false
                    }
                }
            }else{
                return message.ERROR_CONTENT_TYPE //415
            }
    }catch(error){
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
}

const setAtualizarData = async function(){}

const setDeletarData = async function(id){
    try {
        let idData = id

        if(idData == '' || idData == undefined || idData == isNaN(idData) || idData == null){
            return message.ERROR_INVALID_ID //400
        }else{
           let deleteData = await dataDAO.deleteData(idData)
           
           if(deleteData){
            return message.SUCCESS_DELETED_ITEM //200
           }else{
            return message.ERROR_NOT_FOUND //400
           }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500
    }
}

const setListarData = async function(){
    let dataJSON = {}

    let dadosData = await dataDAO.getListarData()

    if(dadosData == '' || dadosData == undefined){
        return message.ERROR_INVALID_ID //400
    }else{
        if(dadosData){
            if(dadosData.length > 0){
                dataJSON.servico = dadosData
                dataJSON.quantidade = dadosData.length
                dataJSON.status_code = 200

                return dataJSON
            }else{
                return message.ERROR_NOT_FOUND //400
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }
}

const setListarDataPeloId = async function(id){
    try {
    let idData = id

    //Cria o objeto JSON
    let dataJSON = {}

    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idData == '' || idData == undefined || isNaN(idData)){
        return message.ERROR_INVALID_ID // 400
    }else{
        //Encaminha para o DAO localizar o id do filme 
        let dadosData = await dataDAO.getListarDataById(idData)
        // Validação para verificar se existem dados de retorno
        if(dadosData){
            // Validação para verificar a quantidade de itens encontrados.
            if(dadosData.length > 0){
                //Criar o JSON de retorno
                dataJSON.servico = dadosData
                dataJSON.status_code = 200

                return dataJSON
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
    setInserirNovaData,
    setAtualizarData,
    setDeletarData,
    setListarData,
    setListarDataPeloId
}