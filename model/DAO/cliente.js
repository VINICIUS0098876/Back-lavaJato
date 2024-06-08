1// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertCliente = async function(dadosCliente){

    try {
        let sql = `CALL inserir_cliente_com_endereco(
            '${dadosCliente.p_nome}',
            '${dadosCliente.p_foto}',  
            '${dadosCliente.p_email}',
            '${dadosCliente.p_senha}',
            '${dadosCliente.p_telefone}',
            '${dadosCliente.p_rua}',
            '${dadosCliente.p_cep}',
            '${dadosCliente.p_numero}', 
            '${dadosCliente.p_complemento}',
            '${dadosCliente.p_bairro}',
            '${dadosCliente.p_estado}',
            '${dadosCliente.p_cidade}'
        )`
            //$executeRawUnsafe() -> serve para executar scripts sem retorno de dados 
              // (insert, update e delete)
           //$queryRawUnsafe() -> serve para executar scripts com retorno de dados (select)
           console.log(sql);
           let result = await prisma.$executeRawUnsafe(sql)
           
           
            if(result){
               return result
            }
       
    } catch (error) {
        
       return false
    }
}

const updateCliente = async function(){}

const deleteCliente = async function(id){
    try {
        let sql = `delete from tbl_clientes where id_cliente = ${id}`

        let rsCliente = await prisma.$executeRawUnsafe(sql)
        return rsCliente
    } catch (error) {
        return false
    }
}

const IDCliente = async function(){
    try {
        let sql = `select cast(last_insert_id() as DECIMAL) as id from tbl_clientes limit 1`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
}

// APARECER INFO A MAIS

const getListarVeiculoPorIdCliente = async function(id){
    try {
        // Realiza a busca do veiculo pelo ID do cliente
        let sql = `SELECT 
        v.modelo,
        v.marca,
        v.ano,
        v.placa,
        v.cor
    FROM 
        tbl_clientes c
    JOIN 
        tbl_clientes_veiculos cv ON c.id_cliente = cv.id_cliente
    JOIN 
        tbl_veiculos v ON cv.id_veiculo = v.id_veiculo
    WHERE 
        c.id_cliente = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsCliente = await prisma.$queryRawUnsafe(sql);

            return rsCliente;
    
        } catch (error) {
            return false;
            
        }
}

module.exports = {
    insertCliente,
    updateCliente,
    deleteCliente,
    IDCliente,
    getListarVeiculoPorIdCliente
}