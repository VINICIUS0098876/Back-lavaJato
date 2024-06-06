const { application } = require('express')
const veiculoDAO = require('../model/DAO/veiculo.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')


const setInserirNovoVeiculo = async function(dadosVeiculo, contentType){
    console.log(dadosVeiculo)
    try{
        let validateStatus = false

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            
            // Cria o objeto JSON para devolver os dados criados na requisição
                let novoVeiculoJSON = {}
            
                
                //Validação de campos obrigatórios ou com digitação inválida
                if(dadosVeiculo.modelo == ''    || dadosVeiculo.modelo == undefined      || dadosVeiculo.modelo == null         || dadosVeiculo.modelo.length > 30  ||
                dadosVeiculo.marca == ''          || dadosVeiculo.marca == undefined         || dadosVeiculo.marca == null            || dadosVeiculo.marca.length > 80     ||
                dadosVeiculo.ano == ''              || dadosVeiculo.ano == undefined             || dadosVeiculo.ano == null                || dadosVeiculo.ano.length > 4 ||
                dadosVeiculo.placa == '' || dadosVeiculo.placa == undefined || dadosVeiculo.placa == null || dadosVeiculo.placa.length > 10 ||
                dadosVeiculo.cor == '' || dadosVeiculo.cor == undefined || dadosVeiculo.cor == null || dadosVeiculo.cor.length > 50 
                ){
                    

                    return message.ERROR_REQUIRED_FIELDS
                    
                }
            
                else{
                   

                    validateStatus=true
                    
                    
                    // Validação para verificar se a variavel booleana é verdadeira
                    if(validateStatus){
                        

            
                        // Encaminha os dados do filme para o DAO inserir no DB
                        let novoVeiculo = await veiculoDAO.insertVeiculo(dadosVeiculo)
                        
                        
                        
                        // if(novoServico){
                        //     let idServicos = await servicoDAO.IDServico()
                        //     dadosServico.id = Number(idServicos[0].id)
                        // }
                
                        // Validação para verificar se o DAO inseriu os dados do DB
                        if(novoVeiculo){
                            //Cria o JSON de retorno dos dados (201)
                            novoVeiculoJSON.servico       = dadosServico
                        
                
                            return novoVeiculoJSON //201
                            
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

const setAtualizarVeiculo = async function(id, dadosAtualizados, contentType){
    try{

        let idVeiculo = id

        // Validação de content-type (apenas aplication/json)
        if(String(contentType).toLowerCase() == 'application/json'){
            let dadosID = veiculoDAO.getVeiculoById()
            
            if(idVeiculo == '' || idVeiculo == undefined || idVeiculo == isNaN(idVeiculo) || idVeiculo == null){
                return message.ERROR_INVALID_ID

            }else if(idVeiculo>dadosID.length){
                return message.ERROR_NOT_FOUND
            }else{
                // Cria o objeto JSON para devolver os dados criados na requisição
                    let atualizarVeiculoJSON = {}

                    //Validação de campos obrigatórios ou com digitação inválida
                    if(dadosAtualizados.modelo == ''                  || dadosAtualizados.modelo == undefined            || dadosAtualizados.modelo == null            || dadosAtualizados.modelo.length > 50 || 
                    dadosAtualizados.marca == '' || dadosAtualizados.marca == undefined || dadosAtualizados.marca == null ||dadosAtualizados.marca.length > 80 ||
                    dadosAtualizados.ano == '' || dadosAtualizados.ano == undefined || dadosAtualizados == null || dadosAtualizados.ano.length > 4 ||
                    dadosAtualizados.cor == '' || dadosAtualizados.cor == undefined || dadosAtualizados.cor == null || dadosAtualizados.cor.length > 50       
                    ){
                        return message.ERROR_REQUIRED_FIELDS
                    }
                
                    else{
                        let validateStatus = true

                          
                
                        // Validação para verificar se a variavel booleana é verdadeira
                        if(validateStatus){
                            // Encaminha os dados do filme para o DAO inserir no DB
                            let dadosVeiculo = await veiculoDAO.updateVeiculo(idVeiculo, dadosAtualizados)
                            
                            // Validação para verificar se o DAO inseriu os dados do DB
                            console.log(dadosVeiculo)
                            if(dadosVeiculo){
                    
                                //Cria o JSON de retorno dos dados (201)
                                atualizarVeiculoJSON.veiculo       = dadosVeiculo
                                atualizarVeiculoJSON.status      = message.SUCCESS_UPDATED_ITEM.status
                                atualizarVeiculoJSON.status_code = message.SUCCESS_UPDATED_ITEM.status_code
                                atualizarVeiculoJSON.message     = message.SUCCESS_UPDATED_ITEM.message
                                return atualizarVeiculoJSON //201
                                
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

const setDeletarVeiculo = async function(id){
    try {
        let idVeiculo = id

        if(idVeiculo == '' || idVeiculo == undefined || idVeiculo == isNaN(idVeiculo) || idVeiculo == null){
            return message.ERROR_INVALID_ID //400
        }else{
           let deleteVeiculo = await veiculoDAO.deleteVeiculo(idVeiculo)
           
           if(deleteVeiculo){
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

const setListarVeiculos = async function(){
    let veiculoJSON = {}

    let dadosVeiculo = await veiculoDAO.getVeiculo()

    if(dadosVeiculo == '' || dadosVeiculo == undefined){
        return message.ERROR_INVALID_ID //400
    }else{
        if(dadosVeiculo){
            if(dadosVeiculo.length > 0){
                veiculoJSON.veiculo = dadosVeiculo
                veiculoJSON.quantidade = dadosVeiculo.length
                veiculoJSON.status_code = 200

                return veiculoJSON
            }else{
                return message.ERROR_NOT_FOUND //400
            }
        }else{
            return message.ERROR_INTERNAL_SERVER_DB //500
        }
    }
}

const setListarVeiculosPorId = async function(id){
    try {
        // Recebe o id do filme
     
    let idVeiculo = id

    //Cria o objeto JSON
    let veiculoJSON = {}


    //Validação para verificar se o id é válido(Vazio, indefinido e não numérico)
    if(idVeiculo == '' || idVeiculo == undefined || isNaN(idVeiculo)){
        return message.ERROR_INVALID_ID // 400
    }else{

        //Encaminha para o DAO localizar o id do filme 
        let dadosVeiculo = await veiculoDAO.getVeiculoById(id)

        // Validação para verificar se existem dados de retorno
        if(dadosVeiculo){

            // Validação para verificar a quantidade de itens encontrados.
            if(dadosVeiculo.length > 0){
                //Criar o JSON de retorno
                veiculoJSON.veiculo = dadosVeiculo
                veiculoJSON.status_code = 200
    
                
                return veiculoJSON
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
    setInserirNovoVeiculo,
    setAtualizarVeiculo,
    setDeletarVeiculo,
    setListarVeiculos,
    setListarVeiculosPorId
}