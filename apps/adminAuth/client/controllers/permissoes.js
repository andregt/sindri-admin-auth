/**
 * **Created on 10/06/16**
 *
 * sindri-admin-auth/apps/adminAuth/client/controllers/permissoes.js
 * @author André Timermann <andre@andregustvo.org>
 *
 */
'use strict';

class PermissoesController {

    constructor(authAPI, sindriAdmin) {

        let self = this;

        // TODO: Usar APICHECK
        self.crudOptions = {
            url: "/permissoes",
            loadSchemaFromServer: true,
            httpRequest: function () {
                // TODO: Usar angular interceptions (ver video angularjs)
                return authAPI.http.apply(authAPI, arguments);
            },
            addButtonLabel: "criar permissão",
            createFormLabel: "Nova Permissão",
            updateFormLabel: "Editar Permissão",
            createFormLayout: 0,
            updateFormLayout: 0,
            formOptions: {},
            formFieldOptions: {},
            onSave: function (data) {

                // Atualiza Menu ao salvar
                sindriAdmin.updateMenu().then(function () {


                    // Abre Menu Administração
                    let adminMenu =_.find(sindriAdmin.api.menu, ["nome", "administracao"]);
                    adminMenu.status = "active";

                })
            }
        };
    }
}

module.exports = PermissoesController;