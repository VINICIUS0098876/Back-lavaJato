// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertVeiculo = async function(dadosVeiculo){
    try {
        const sql = `CALL inserir_veiculo_cliente(
            '${dadosVeiculo.modelo}',
         '${dadosVeiculo.marca}',
          '${dadosVeiculo.ano}',
        '${dadosVeiculo.placa}',
        '${dadosVeiculo.cor}')`
        
        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
           return true
        }else{
           return false
        }
    } catch (error) {
        return false
    }
}

const updateVeiculo = async function(idVeiculo, dadosAtualizados){
    try{
        let sql
        {
            sql = `update tbl_veiculos SET 
            modelo = '${dadosAtualizados.modelo}',
            marca = '${dadosAtualizados.marca}',
            ano = '${dadosAtualizados.ano}',
            placa = '${dadosAtualizados.placa}',
            cor = '${dadosAtualizados.cor}'
            WHERE
           id_veiculo = ${idVeiculo}`
        }
        console.log(sql)
        let result = await prisma.$executeRawUnsafe(sql)

       return result
        
       
    } catch (error) {
        console.log(error)
        return false
    }
}

const deleteVeiculo = async function(id){
    try {
        let sql = `delete from tbl_veiculos where id_veiculo = ${id}`

        let rsVeiculo = await prisma.$executeRawUnsafe(sql)
        return rsVeiculo
    } catch (error) {
        return false
    }
}

const getVeiculo = async function(){
    try {
        let sql = 'select * from tbl_veiculos;'
        let rsCliente = await prisma.$queryRawUnsafe(sql)
        console.log(rsCliente)
        return rsCliente
    } catch (error) {
        console.log(error)
        return false
    }
}

const getVeiculoById = async function(id){
    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_veiculos where tbl_veiculos.id_veiculo = ${id}`

        console.log(sql);
    
        // Caminha o script sql para o banco de dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)
    
        return rsFilme
    } catch (error) {
        return false
    }
}






module.exports= {
    insertVeiculo,
    updateVeiculo,
    deleteVeiculo,
    getVeiculo,
    getVeiculoById
}