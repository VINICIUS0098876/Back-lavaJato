const { application } = require('express')
const horaDAO = require('../model/DAO/hora.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')


const setInserirHoras = async function(dadosHora, contentType){
    try{
        let validateStatus = false

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // Cria o objeto JSON para devolver os dados criados na requisição
                let novaHoraJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadosHora.horas == ''    || dadosHora.horas == undefined      || dadosHora.horas == null         || dadosHora.horas.length > 8
                ){
                    

                    return message.ERROR_REQUIRED_FIELDS
                    
                }
            
                else{
                   

                    validateStatus=true
                    
                    
                    // Validação para verificar se a variavel booleana é verdadeira
                    if(validateStatus){
                        

            
                        // Encaminha os dados do filme para o DAO inserir no DB
                        let novaHora = await horaDAO.insertHoras(dadosHora)
                        
                        
                        
                        if(novaHora){
                            let idHoras = await horaDAO.horasID()
                            dadosHora.id = Number(idHoras[0].id)
                        }
                
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(novaHora){
                            //Cria o JSON de retorno dos dados (201)
                            novaHoraJSON.horas       = dadosHora
                            novaHoraJSON.status = message.SUCCESS_CREATED_ITEM.status
                            novaHoraJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            novaHoraJSON.message = message.SUCCESS_CREATED_ITEM.message
                
                            return novaHoraJSON //201
                            
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

const setAtualizarHoras = async function(id, dadosAtualizados, contentType){
    try{

        let idHora = id

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = horaDAO.getListarHorasById()
            
            if(idHora == '' || idHora == undefined || idHora == isNaN(idHora) || idHora == null){
                return message.ERROR_INVALID_ID

            }else if(idHora>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                    let atualizarHoraJSON = {}

                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadosAtualizados.horas == ''                  || dadosAtualizados.horas == undefined            || dadosAtualizados.horas == null            || dadosAtualizados.horas.length > 8          
                    ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{
                        let validateStatus = true

                          
                
                        // Validação para verificar se a variavel booleana é verdadeira
                        if(validateStatus){
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosHora = await horaDAO.updateHoras(idHora, dadosAtualizados)
                            
                            // Validação para verificar se o DAO inseriu os dados do DB
                            if(dadosHora){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarHoraJSON.horas       = dadosHora
                                atualizarHoraJSON.status      = message.SUCCESS_UPDATED_ITEM.status
                                atualizarHoraJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                                atualizarHoraJSON.message     = message.SUCCESS_UPDATED_ITEM.message
                                return atualizarHoraJSON //201
                                
                            }else{
                                return message.ERROR_INTERNAL_SERVER_DB //500
                            }
                        }else{
                            validateStatus = false
                        }
                
                    }
                    
                }
            }else{
                return message.ERROR_CONTENT_TYPE //415
            }


        }catch(error){
        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
}

const setDeletarHoras = async function(id){
    try {
        let idHora = id

        if(idHora == '' || idHora == undefined || idHora == isNaN(idHora) || idHora == null){
            return message.ERROR_INVALID_ID //400
        }else{
           let deleteHoras = await horaDAO.deleteHoras(idHora)
           
           if(deleteHoras){
            return message.SUCCESS_DELETED_ITEM //200
           }else{
            return message.ERROR_NOT_FOUND //400
           }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500
    }
}

const setListarHoras = async function(){
    let horaJSON = {}

    let dadosHora = await horaDAO.getListarHoras()

    if(dadosHora == '' || dadosHora == undefined){
        return message.ERROR_INVALID_ID //400
    }else{
        if(dadosHora){
            if(dadosHora.length > 0){
                horaJSON.horas = dadosHora
                horaJSON.quantidade = dadosHora.length
                horaJSON.status_code = 200

                return horaJSON
            }else{
                return message.ERROR_NOT_FOUND //400
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }
}

const setListarHorasPeloId = async function(id){
    try {
        let idHora = id
    
        //Cria o objeto JSON
        let horaJSON = {}
    
        //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
        if(idHora == '' || idHora == undefined || isNaN(idHora)){
            return message.ERROR_INVALID_ID // 400
        }else{
            //Encaminha para o DAO localizar o id do filme 
            let dadosHora = await horaDAO.getListarHorasById(idHora)
            // Validação para verificar se existem dados de retorno
            if(dadosHora){
                // Validação para verificar a quantidade de itens encontrados.
                if(dadosHora.length > 0){
                    //Criar o JSON de retorno
                    horaJSON.hora = dadosHora
                    horaJSON.status_code = 200
    
                    return horaJSON
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
    setInserirHoras,
    setAtualizarHoras,
    setDeletarHoras,
    setListarHoras,
    setListarHorasPeloId
}