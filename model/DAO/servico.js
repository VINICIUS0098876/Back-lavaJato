// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertServico = async function(dadosServico){
    try {
        const sql = `insert into tbl_genero(tipo_servico, descricao, preco)values('${dadosServico.tipo_servico, dadosServico.descricao, dadosServico.preco}')`
        console.log(sql)
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

const updateServico = async function(){}

const deleteServico = async function(id){
    try {
        let sql = `delete from tbl_servicos where id_servico = ${id}`

        let rsCliente = await prisma.$executeRawUnsafe(sql)
        return rsCliente
    } catch (error) {
        return false
    }
}

const getListarServicos = async function(){
    try {
        let sql = 'select * from tbl_servicos;'
        let rsCliente = await prisma.$queryRawUnsafe(sql)
        console.log(rsCliente)
        return rsCliente
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertServico,
    updateServico,
    deleteServico,
    getListarServicos
}