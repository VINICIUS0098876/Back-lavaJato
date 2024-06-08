// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const getEndereco = async function(){
    try {
        let sql = 'select * from tbl_enderecos_clientes;'
        let rsEndereco = await prisma.$queryRawUnsafe(sql)
        console.log(rsEndereco)
        return rsEndereco
    } catch (error) {
        console.log(error)
        return false
    }
}

const getEnderecoById = async function(id){
    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_enderecos_clientes where tbl_enderecos_clientes.id_endereco_cliente = ${id}`

        console.log(sql);
    
        // Caminha o script sql para o banco de dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)
    
        return rsFilme
    } catch (error) {
        return false
    }
}

const deleteEndereco = async function(id){
    try {
        let sql = `delete from tbl_enderecos_clientes where tbl_enderecos_clientes.id_endereco_cliente = ${id}`

        let rsCliente = await prisma.$executeRawUnsafe(sql)
        return rsCliente
    } catch (error) {
        return false
    }
}

module.exports = {
    getEnderecoById,
    deleteEndereco,
    getEndereco
}