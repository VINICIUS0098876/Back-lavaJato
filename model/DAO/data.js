// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertData = async function(dadosData){
    try {
        const sql = `insert into tbl_datas(datas)values('${dadosData.datas}')`
        
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

const updateData = async function(){}

const deleteData = async function(id){
    try {
        let sql = `delete from tbl_datas where id_data = ${id}`

        let rsData = await prisma.$executeRawUnsafe(sql)
        return rsData
    } catch (error) {
        return false
    }
}

const getListarData = async function(){
    try {
        let sql = 'select * from tbl_datas;'
        let rsData = await prisma.$queryRawUnsafe(sql)
        return rsData
    } catch (error) {
        console.log(error)
        return false
    }
}

const getListarDataById = async function(id){
    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_datas where tbl_datas.id_data = ${id}`

    
        // Caminha o script sql para o banco de dados
        let rsData = await prisma.$queryRawUnsafe(sql)
    
        return rsData
    } catch (error) {
        return false
    }
}

const dataID = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_datas limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
}

module.exports = {
    insertData,
    updateData,
    deleteData,
    getListarData,
    getListarDataById,
    dataID
}