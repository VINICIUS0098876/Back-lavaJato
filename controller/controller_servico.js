const { application } = require('express')
const servicoDAO = require('../model/DAO/servico.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirNovoServico = async function(dadosServico, contentType){
    try{
        let validateStatus = false

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            console.log('bbb');
            // Cria o objeto JSON para devolver os dados criados na requisição
                let novoServicoJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadosServico.tipo_servico == ''    || dadosServico.tipo_servico == undefined      || dadosServico.tipo_servico == null         || dadosServico.tipo_servico.length > 100  ||
                dadosServico.descricao == ''          || dadosServico.descricao == undefined         || dadosServico.descricao == null            || dadosServico.descricao.length > 250     ||
                dadosServico.preco == ''              || dadosServico.preco == undefined             || dadosServico.preco == null                || dadosServico.preco.length >150  
                ){
                    console.log('ccc');

                    return message.ERROR_REQUIRED_FIELDS
                    
                }
            
                else{
                    console.log('ddd');

                    validateStatus=true
                    
                    
                    // Validação para verificar se a variavel booleana é verdadeira
                    if(validateStatus){
                        console.log(validateStatus);

            
                        // Encaminha os dados do filme para o DAO inserir no DB
                        let novoCliente = await clienteDAO.insertCliente(dadosCliente)
                        console.log();
                        console.log(validateStatus);
                        
                        if(novoCliente){
                            let idClientes = await clienteDAO.IDCliente()
                            dadosCliente.id = Number(idClientes[0].id)
                        }
                
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(novoCliente){
                console.log(novoCliente);
                            //Cria o JSON de retorno dos dados (201)
                            novoClienteJSON.cliente       = dadosCliente
                            novoClienteJSON.status        = message.SUCCESS_CREATED_ITEM.status
                            novoClienteJSON.status_code   = message.SUCCESS_CREATED_ITEM.status_code
                            novoClienteJSON.message       = message.SUCCESS_CREATED_ITEM.message
                
                            return novoClienteJSON //201
                            
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

const setAtualizarServico = async function(){}

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
                servicoJSON.cliente = dadosServico
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

module.exports = {
    setAtualizarServico,
    setInserirNovoServico,
    setExcluirServico,
    setListarServicos
}