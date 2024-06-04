const { application } = require('express')
const clienteDAO = require('../model/DAO/cliente.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')

const setInserirNovoCliente = async function(dadosCliente, contentType){
    try{
        let validateStatus = false

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            console.log('bbb');
            // Cria o objeto JSON para devolver os dados criados na requisição
                let novoClienteJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadosCliente.p_nome == ''          || dadosCliente.p_nome == undefined         || dadosCliente.p_nome == null          || dadosCliente.p_nome.length > 100  ||
                dadosCliente.p_foto == ''          || dadosCliente.p_foto == undefined         || dadosCliente.p_foto == null            || dadosCliente.p_foto.length > 250  ||
                dadosCliente.p_email == ''          || dadosCliente.p_email == undefined        || dadosCliente.p_email == null           || dadosCliente.p_email.length >150  ||
                dadosCliente.p_senha == ''          || dadosCliente.p_senha == undefined        || dadosCliente.p_senha == null           || dadosCliente.p_senha.length > 100 ||  
                dadosCliente.p_telefone == ''       || dadosCliente.p_telefone == undefined     || dadosCliente.p_telefone == null        || dadosCliente.p_telefone.length > 18  ||
                dadosCliente.p_rua == ''            || dadosCliente.p_rua == undefined          || dadosCliente.p_rua == null             || dadosCliente.p_rua.length > 45    ||
                dadosCliente.p_cep == ''            || dadosCliente.p_cep == undefined          || dadosCliente.p_cep == null             || isNaN(dadosCliente.p_cep)   ||
                dadosCliente.p_numero == ''         || dadosCliente.p_numero == undefined       || dadosCliente.p_numero == null          || isNaN(dadosCliente.p_numero)   ||
                dadosCliente.p_bairro == ''         || dadosCliente.p_bairro == undefined       || dadosCliente.p_bairro == null          || dadosCliente.p_bairro.length > 150   ||
                dadosCliente.p_estado == ''         || dadosCliente.p_estado == undefined       || dadosCliente.p_estado == null          || dadosCliente.p_estado.length > 80   ||
                dadosCliente.p_cidade == ''         || dadosCliente.p_cidade == undefined       || dadosCliente.p_cidade == null          || dadosCliente.p_estado.length > 80     
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

const setAtualizarCliente = async function(){}

const setExcluirCliente = async function(id){
    try {
        let idCliente = id
        if(idCliente == '' || idCliente == undefined || idCliente == isNaN(idCliente) || idCliente == null){
            return message.ERROR_INVALID_ID //400
        }else{
           let deleteCliente = await clienteDAO.deleteCliente(idCliente)
           let deleteClienteVeiculo = await clienteDAO.deleteClienteVeiculo(idCliente)
           let deleteClienteVeiculoAgendamento = await clienteDAO.deleteClienteVeiculoAgendamento(idCliente)
           let deleteClienteAgendamentoFuncionario = await clienteDAO.deleteClienteAgendamentoFuncionario(idCliente)
           let deleteClienteServicosAgendamentos = await clienteDAO.deleteClienteServicosAgendamentos(idCliente)
           let deleteClientePagamentosServicos = await clienteDAO.deleteClientePagamentosServicos(idCliente)
           let deleteClienteRecibosPagamentos = await clienteDAO.deleteClienteRecibosPagamentos(idCliente)
           let deleteClienteAgendamentoClientesVeiculos = await clienteDAO.deleteClienteAgendamentoClientesVeiculos(idCliente)
           
           if(deleteCliente ||
             deleteClienteVeiculo ||
             deleteClienteVeiculoAgendamento ||
             deleteClienteAgendamentoFuncionario ||
             deleteClienteServicosAgendamentos ||
             deleteClientePagamentosServicos ||
             deleteClienteRecibosPagamentos ||
             deleteClienteAgendamentoClientesVeiculos){
            return message.SUCCESS_DELETED_ITEM //200
           }else{
            return message.ERROR_NOT_FOUND //400
           }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500
    }
}

const getListarTodosClientes = async function(){
    let clienteJSON = {}

    let dadosCliente = await clienteDAO.getListarClientes()

    if(dadosCliente == '' || dadosCliente == undefined){
        return message.ERROR_INVALID_ID //400
    }else{
        if(dadosCliente){
            if(dadosCliente.length > 0){
                clienteJSON.cliente = dadosCliente
                clienteJSON.quantidade = dadosCliente.length
                clienteJSON.status_code = 200

                return clienteJSON
            }else{
                return message.ERROR_NOT_FOUND //400
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }
    
}

module.exports = {
    setInserirNovoCliente,
    setAtualizarCliente,
    setExcluirCliente,
    getListarTodosClientes
}