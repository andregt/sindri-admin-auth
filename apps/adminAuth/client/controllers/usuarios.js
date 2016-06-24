/**
 * Created by André Timermann on 09/05/16.
 *
 *
 */
'use strict';

const _ = require('lodash');

class UsuariosController {

    constructor(authAPI, sindriAdmin) {

        let self = this;

 
        //////////////////////////////////////////////////////////////////////////////////////////
        // CRUD
        //////////////////////////////////////////////////////////////////////////////////////////
        // TODO: Usar APICHECK
        self.crudOptions = {
            url: "/usuarios",
            loadSchemaFromServer: true,
            httpRequest: function () {
                // TODO: Usar angular interceptions (ver video angularjs)
                return authAPI.http.apply(authAPI, arguments);
            },
            addButtonLabel: "criar usuário",
            addButtonEnabled: authAPI.hasPerm('administrador__usuario_criar'),
            editButtonEnabled: authAPI.hasPerm('administrador__usuario_gerenciar'),
            deleteButtonEnabled: authAPI.hasPerm('administrador__usuario_gerenciar'),
            createFormLabel: "Novo Usuário",
            updateFormLabel: "Editar Usuário",
            createFormLayout: 0,
            updateFormLayout: 0,
            formOptions: {},
            formFieldOptions: {},
            onSave: function (data) {

                // Atualiza Menu ao salvar
                sindriAdmin.updateMenu().then(function () {


                    // Abre Menu Administração
                    let adminMenu = _.find(sindriAdmin.api.menu, ["nome", "administracao"]);
                    adminMenu.status = "active";

                })

            }
        };
    }
}


module.exports = UsuariosController;
