// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()


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

module.exports = {
    getEnderecoById
}