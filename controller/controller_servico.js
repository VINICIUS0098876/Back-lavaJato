const { application } = require('express')
const servicoDAO = require('../model/DAO/servico.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirNovoServico = async function(dadosServico, contentType){
    console.log(dadosServico)
    try{
        let validateStatus = false

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // Cria o objeto JSON para devolver os dados criados na requisição
                let novoServicoJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadosServico.tipo_servico == ''    || dadosServico.tipo_servico == undefined      || dadosServico.tipo_servico == null         || dadosServico.tipo_servico.length > 100  ||
                dadosServico.descricao == ''          || dadosServico.descricao == undefined         || dadosServico.descricao == null            || dadosServico.descricao.length > 250     ||
                dadosServico.preco == ''              || dadosServico.preco == undefined             || dadosServico.preco == null                || dadosServico.preco.length >150  
                ){
                    

                    return message.ERROR_REQUIRED_FIELDS
                    
                }
            
                else{
                   

                    validateStatus=true
                    
                    
                    // Validação para verificar se a variavel booleana é verdadeira
                    if(validateStatus){
                        

            
                        // Encaminha os dados do filme para o DAO inserir no DB
                        let novoServico = await servicoDAO.insertServico(dadosServico)
                        
                        
                        
                        // if(novoServico){
                        //     let idServicos = await servicoDAO.IDServico()
                        //     dadosServico.id = Number(idServicos[0].id)
                        // }
                
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(novoServico){
                            //Cria o JSON de retorno dos dados (201)
                            novoServicoJSON.servico       = dadosServico
                            novoServicoJSON.status = message.SUCCESS_CREATED_ITEM.status
                            novoServicoJSON.status_code = message.SUCCESS_CREATED_ITEM.status_code
                            novoServicoJSON.message = message.SUCCESS_CREATED_ITEM.message
                
                            return novoServicoJSON //201
                            
                        }else{
                            console.log('erro');
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
        console.log(error)

        return message.ERROR_INTERNAL_SERVER //500 - erro na controller
    }
}

const setAtualizarServico = async function(id, dadosAtualizados,contentType){
    try{

        let idServico = id

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = servicoDAO.getServicosById()
            
            if(idServico == '' || idServico == undefined || idServico == isNaN(idServico) || idServico == null){
                return message.ERROR_INVALID_ID

            }else if(idServico>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                    let atualizarServicoJSON = {}

                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadosAtualizados.tipo_servico == ''                  || dadosAtualizados.tipo_servico== undefined            || dadosAtualizados.tipo_servico == null            || dadosAtualizados.tipo_servico.length > 50          
                    ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{
                        let validateStatus = true

                          
                
                        // Validação para verificar se a variavel booleana é verdadeira
                        if(validateStatus){
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosServico = await servicoDAO.updateServico(idServico, dadosAtualizados)
                            
                            // Validação para verificar se o DAO inseriu os dados do DB
                            console.log(dadosServico)
                            if(dadosServico){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarServicoJSON.genero       = dadosServico
                                atualizarServicoJSON.status      = message.SUCCESS_UPDATED_ITEM.status
                                atualizarServicoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                                atualizarServicoJSON.message     = message.SUCCESS_UPDATED_ITEM.message
                                return atualizarServicoJSON //201
                                
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

const setExcluirServico = async function(id){
    try {
        let idServico = id
        console.log(idServico);

        if(idServico == '' || idServico == undefined || idServico == isNaN(idServico) || idServico == null){
            return message.ERROR_INVALID_ID //400
        }else{
           let deleteServico = await servicoDAO.deleteServico(idServico)
           
           if(deleteServico){
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

const setListarServicos = async function(){
    let servicoJSON = {}

    let dadosServico = await servicoDAO.getListarServicos()

    if(dadosServico == '' || dadosServico == undefined){
        return message.ERROR_INVALID_ID //400
    }else{
        if(dadosServico){
            if(dadosServico.length > 0){
                servicoJSON.servico = dadosServico
                servicoJSON.quantidade = dadosServico.length
                servicoJSON.status_code = 200

                return servicoJSON
            }else{
                return message.ERROR_NOT_FOUND //400
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }
}

const setListarServicoPeloId = async function(id){
    try {
        // Recebe o id do filme
     
    let idServico = id

    //Cria o objeto JSON
    let servicoJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idServico == '' || idServico == undefined || isNaN(idServico)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosServico = await servicoDAO.getServicosById(id)

        // Validação para verificar se existem dados de retorno
        if(dadosServico){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosServico.length > 0){
                //Criar o JSON de retorno
                servicoJSON.servico = dadosServico
                servicoJSON.status_code = 200
    
                
                return servicoJSON
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
    setAtualizarServico,
    setInserirNovoServico,
    setExcluirServico,
    setListarServicos,
    setListarServicoPeloId
}