/**
 * Created by André Timermann on 09/05/16.
 *
 *
 */
'use strict';

const angular = require('angular');
const ContaController = require('./controllers/contas');
const UsuarioController = require('./controllers/usuarios');
const PerfilController = require('./controllers/perfis');
const PermissoesController = require('./controllers/permissoes');
const MenuController = require('./controllers/menu');

require('sindri-crud');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Definição do Módulo
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let acessoModule = angular.module('app.adminAuth', ['sindriCrud']);

acessoModule
    .config(require('./routing'))
    .controller('ContaController', ContaController)
    .controller('UsuarioController', UsuarioController)
    .controller('PerfilController', PerfilController)
    .controller('PermissoesController', PermissoesController)
    .controller('MenuController', MenuController);


module.exports = acessoModule.name;

