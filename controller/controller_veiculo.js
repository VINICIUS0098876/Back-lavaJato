const { application } = require('express')
const clienteDAO = require('../model/DAO/veiculo.js')
// Import do arquivo de configuração do projeto
const message = require('../modulo/config.js')
const { join } = require('@prisma/client/runtime/library.js')
const { json } = require('body-parser')


const setInserirNovoVeiculo = async function(){}

const setAtualizarVeiculo = async function(){}

const setDeletarVeiculo = async function(){}

const setListarVeiculos = async function(){}

module.exports = {
    setInserirNovoVeiculo,
    setAtualizarVeiculo,
    setDeletarVeiculo,
    setListarVeiculos
}