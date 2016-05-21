#!/usr/bin/env node
/**
 * Nome do Projeto: Sindri Admin Auth
 * Descrição: Modelos, Telas pré definidias para o Sindri Admin como gerenciamento de Conta, Usuario, Perfil e Menu
 * Autor: André Timermann
 * E-mail: andre.timermann@smarti.io
 * Criado em: 08/05/2016
 */
'use strict';

const Sindri = require('sindri-framework');

// Instancia uma nova aplicação SIndri
let sindriAdminAuthApplication = new Sindri(__dirname);

// Configura o Nome da Aplicação
sindriAdminAuthApplication.name = 'sindri-admin-auth';

// Dependencias
sindriAdminAuthApplication.loadApplication('sindri-admin');

const UsuarioModel = require('./apps/adminAuth/server/models/usuario');
sindriAdminAuthApplication.loadApplication('sindri-auth', UsuarioModel);


// Executa
module.exports = sindriAdminAuthApplication;

