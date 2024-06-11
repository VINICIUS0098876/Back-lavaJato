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

const getListarClientes = async function(){
    try {
        let sql = `select * from tbl_clientes`

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

const getListarAgendamentoCliente = async function(id){
    try {
        // Realiza a busca do veiculo pelo ID do cliente
        let sql = `SELECT 
        datas.datas,
        horas.horas,
        clientes.nome AS nome_cliente,
        clientes.email AS email_cliente,
        clientes.telefone AS telefone_cliente,
        veiculos.modelo AS modelo_veiculo,
        veiculos.marca AS marca_veiculo,
        veiculos.ano AS ano_veiculo,
        veiculos.placa AS placa_veiculo,
        veiculos.cor AS cor_veiculo
    FROM 
        tbl_agendamentos AS agendamentos
    JOIN 
        tbl_datas_horarios AS datas_horarios ON agendamentos.id_data_horario = datas_horarios.id_data_horario
    JOIN 
        tbl_datas AS datas ON datas_horarios.id_data = datas.id_data
    JOIN 
        tbl_horas AS horas ON datas_horarios.id_horario = horas.id_horario
    JOIN 
        tbl_clientes_veiculos AS clientes_veiculos ON agendamentos.id_cliente_veiculo = clientes_veiculos.id_cliente_veiculo
    JOIN 
        tbl_clientes AS clientes ON clientes_veiculos.id_cliente = clientes.id_cliente
    JOIN 
        tbl_veiculos AS veiculos ON clientes_veiculos.id_veiculo = veiculos.id_veiculo
    WHERE
        clientes.id_cliente = ${id}`;
    
        // Executa no banco de dados o script sql
        let rsCliente = await prisma.$queryRawUnsafe(sql);

            return rsCliente;
    
        } catch (error) {
            return false;
            
        }
}

const getListarClienteById = async function(id){
    try {
        // Script sql para buscar o filme pelo id
        const sql = `select * from tbl_clientes where tbl_clientes.id_cliente = ${id}`
    
        // Caminha o script sql para o banco de dados
        let rsFilme = await prisma.$queryRawUnsafe(sql)

        return rsFilme
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertCliente,
    updateCliente,
    deleteCliente,
    IDCliente,
    getListarClientes,
    getListarVeiculoPorIdCliente,
    getListarAgendamentoCliente,
    getListarClienteById
}