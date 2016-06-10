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
        });

};