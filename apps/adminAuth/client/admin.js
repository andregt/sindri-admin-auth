/**
 * Created by André Timermann on 09/05/16.
 *
 *
 */
'use strict';

const angular = require('angular');
const ContaController = require('./controllers/contas');

require('sindri-crud');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Definição do Módulo
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let acessoModule = angular.module('app.adminAuth', ['sindriCrud']);

acessoModule
    .config(require('./routing'))
    .controller('ContaController', ContaController);


module.exports = acessoModule.name;
