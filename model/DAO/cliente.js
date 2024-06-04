// Importa de biblioteca do @prisma/client
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

const deleteClienteVeiculo = async function(id){
    try {
        let sql = `delete from tbl_clientes_veiculos where id_cliente = ${id}`

        let rsClienteVeiculo = await prisma.$executeRawUnsafe(sql)
        return rsClienteVeiculo
    } catch (error) {
        return false
    }
}

const deleteClienteVeiculoAgendamento = async function(id){
    try {
        let sql = `delete from tbl_clientes_veiculos where id_cliente = ${id}`

        let rsClienteVeiculo = await prisma.$executeRawUnsafe(sql)
        return rsClienteVeiculo
    } catch (error) {
        return false
    }
}

const deleteClienteAgendamentoFuncionario = async function(id){
    try {
        let sql = `DELETE af
        FROM tbl_agendamentos_funcionarios af
        JOIN tbl_agendamentos ag ON af.id_agendamento = ag.id_agendamento
        JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
        WHERE cv.id_cliente = ${id} AND ag.id_agendamento IS NOT NULL;`

        let rsClienteVeiculo = await prisma.$executeRawUnsafe(sql)
        return rsClienteVeiculo
    } catch (error) {
        return false
    }
}

const deleteClienteServicosAgendamentos = async function(id){
    try {
        let sql = `DELETE sa
        FROM tbl_servicos_agendamentos sa
        JOIN tbl_agendamentos ag ON sa.id_agendamento = ag.id_agendamento
        JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
        WHERE cv.id_cliente = ${id};`

        let rsClienteVeiculo = await prisma.$executeRawUnsafe(sql)
        return rsClienteVeiculo
    } catch (error) {
        return false
    }
}

const deleteClientePagamentosServicos = async function(id){
    try {
        let sql = `DELETE p
        FROM tbl_pagamentos p
        JOIN tbl_servicos_agendamentos sa ON p.id_servico_agendamento = sa.id_servico_agendamento
        JOIN tbl_agendamentos ag ON sa.id_agendamento = ag.id_agendamento
        JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
        WHERE cv.id_cliente = ${id};`

        let rsClienteVeiculo = await prisma.$executeRawUnsafe(sql)
        return rsClienteVeiculo
    } catch (error) {
        return false
    }
}

const deleteClienteRecibosPagamentos = async function(id){
    try {
        let sql = `DELETE rec
        FROM tbl_recibos rec
        JOIN tbl_pagamentos p ON rec.id_pagamento = p.id_pagamento
        JOIN tbl_servicos_agendamentos sa ON p.id_servico_agendamento = sa.id_servico_agendamento
        JOIN tbl_agendamentos ag ON sa.id_agendamento = ag.id_agendamento
        JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
        WHERE cv.id_cliente = ${id};`

        let rsClienteVeiculo = await prisma.$executeRawUnsafe(sql)
        return rsClienteVeiculo
    } catch (error) {
        return false
    }
}

const deleteClienteAgendamentoClientesVeiculos = async function(id){
    try {
        let sql = `DELETE ag
        FROM tbl_agendamentos ag
        JOIN tbl_clientes_veiculos cv ON ag.id_cliente_veiculo = cv.id_cliente_veiculo
        WHERE cv.id_cliente = ${id};`

        let rsClienteVeiculo = await prisma.$executeRawUnsafe(sql)
        return rsClienteVeiculo
    } catch (error) {
        return false
    }
}

const getListarClientes = async function(){
    try {
        let sql = 'select * from tbl_clientes;'
        let rsCliente = await prisma.$queryRawUnsafe(sql)
        console.log(rsCliente)
        return rsCliente
    } catch (error) {
        console.log(error)
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

module.exports = {
    insertCliente,
    updateCliente,
    deleteCliente,
    IDCliente,
    deleteClienteVeiculo,
    deleteClienteVeiculoAgendamento,
    deleteClienteAgendamentoFuncionario,
    deleteClienteServicosAgendamentos,
    deleteClientePagamentosServicos,
    deleteClienteRecibosPagamentos,
    deleteClienteAgendamentoClientesVeiculos,
    getListarClientes
}