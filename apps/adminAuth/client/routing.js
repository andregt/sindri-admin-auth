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
            template: require('./templates/conta.html'),
            controller: 'ContaController',
            controllerAs: 'contas'
        });

};