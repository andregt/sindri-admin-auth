/**
 * **Created on 10/06/16**
 *
 * sindri-admin-auth/apps/adminAuth/client/controllers/menu.js
 * @author André Timermann <andre@andregustvo.org>
 *
 *     TODO: Criar um editor Visual (mais amigável) (arrastar etc...)
 *
 */
'use strict';

class MenuController {

    constructor(authAPI, sindriAdmin) {

        let self = this;

        // TODO: Usar APICHECK
        self.crudOptions = {
            url: "/menu",
            loadSchemaFromServer: true,
            httpRequest: function () {
                // TODO: Usar angular interceptions (ver video angularjs)
                return authAPI.http.apply(authAPI, arguments);
            },
            addButtonLabel: "criar menu",
            createFormLabel: "Novo Menu",
            editarFormLabel: "Editar Menu",
            createFormLayout: 0,
            updateFormLayout: 1,
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


module.exports = MenuController;