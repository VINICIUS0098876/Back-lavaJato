// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')
const { sqltag } = require('@prisma/client/runtime/library')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()

const insertVeiculo = async function(){}

const updateVeiculo = async function(){}

const deleteVeiculo = async function(){}

const getVeiculo = async function(){}

module.exports= {
    insertVeiculo,
    updateVeiculo,
    deleteVeiculo,
    getVeiculo
}