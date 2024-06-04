// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertServico = async function(dadosServico){
    try {
        const sql = `insert into tbl_servicos(tipo_servico, descricao, preco)values('${dadosServico.tipo_servico}', '${dadosServico.descricao}', '${dadosServico.preco}')`
        
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

const updateServico = async function(idServico, dadosAtualizados){
    try{
        let sql
        {
            sql = `update tbl_servicos SET 
            tipo_servico = '${dadosAtualizados.tipo_servico}',
            descricao = '${dadosAtualizados.descricao}',
            preco = '${dadosAtualizados.preco}'
            WHERE
           id_servico = ${idServico}`
        }
        console.log(sql)
        let result = await prisma.$executeRawUnsafe(sql)

       return result
        
       
    } catch (error) {
        console.log(error)
        return false
    }
}

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

const getServicosById = async function(id){
    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_servicos where tbl_servicos.id_servico = ${id}`

        console.log(sql);
    
        // Caminha o script sql para o banco de dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)
    
        return rsFilme
    } catch (error) {
        return false
    }
}

const IDServico = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_servicos limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
}

module.exports = {
    insertServico,
    updateServico,
    deleteServico,
    getListarServicos,
    IDServico,
    getServicosById
}