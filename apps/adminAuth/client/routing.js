/**
 * Created by André Timermann on 09/05/16.
 *
 *
 */
'use strict';

module.exports = function routes($stateProvider) {

    $stateProvider
        .state('admin.conta', {
            url: 'contas',
            template: require('./templates/contas.html'),
            controller: 'ContaController',
            controllerAs: 'contas'
        })
        .state('admin.usuario', {
            url: 'usuarios',
            template: require('./templates/usuarios.html'),
            controller: 'UsuarioController',
            controllerAs: 'usuarios'
        })
        .state('admin.perfil', {
            url: 'perfis',
            template: require('./templates/perfis.html'),
            controller: 'PerfilController',
            controllerAs: 'perfis'
        })
        .state('admin.permissao', {
            url: 'permissoes',
            template: require('./templates/permissoes.html'),
            controller: 'PermissoesController',
            controllerAs: 'permissoes'
        })
        .state('admin.menu', {
            url: 'menu',
            template: require('./templates/menu.html'),
            controller: 'MenuController',
            controllerAs: 'menu'
        });

};