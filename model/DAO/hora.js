// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertHoras = async function(dadosHora){
    try {
        const sql = `CALL inserir_hora_data('${dadosHora.horas}')`
        
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

const updateHoras = async function(idHora, dadosAtualizados){
    try{
        let sql
        {
            sql = `update tbl_horas SET 
            horas = '${dadosAtualizados.horas}'
            WHERE
           id_horario = ${idHora}`
        }
        let result = await prisma.$executeRawUnsafe(sql)

       return result
        
       
    } catch (error) {
        console.log(error)
        return false
    }
}

const deleteHoras = async function(id){
    try {
        let sql = `delete from tbl_horas where id_horario = ${id}`

        let rsHoras = await prisma.$executeRawUnsafe(sql)
        return rsHoras
    } catch (error) {
        return false
    }
}

const getListarHoras = async function(){
    try {
        let sql = 'select * from tbl_horas;'
        let rsHoras = await prisma.$queryRawUnsafe(sql)
        return rsHoras
    } catch (error) {
        console.log(error)
        return false
    }
}

const getListarHorasById = async function(id){
    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_horas where tbl_horas.id_horario = ${id}`

    
        // Caminha o script sql para o banco de dados
        let rsHoras = await prisma.$queryRawUnsafe(sql)
    
        return rsHoras
    } catch (error) {
        return false
    }
}

const horasID = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_horas limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
}

module.exports = {
    insertHoras,
    updateHoras,
    deleteHoras,
    getListarHoras,
    getListarHorasById,
    horasID
}