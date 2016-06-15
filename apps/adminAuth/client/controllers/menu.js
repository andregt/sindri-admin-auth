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

    constructor(authAPI) {

        let self = this;

        // TODO: Usar APICHECK
        self.crudOptions = {
            api: "/menu",
            httpRequest: function () {
                // TODO: Usar angular interceptions (ver video angularjs)
                return authAPI.http.apply(authAPI, arguments);
            },
            addButtonLabel: "criar menu",
            createFormLabel: "Novo Menu",
            createFormLayout: 0,
            updateFormLayout: 1,
            formOptions: {},
            formFieldOptions: {}
        };
    }
}


module.exports = MenuController;