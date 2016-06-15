/**
 * **Created on 10/06/16**
 *
 * sindri-admin-auth/apps/adminAuth/client/controllers/permissoes.js
 * @author André Timermann <andre@andregustvo.org>
 *
 */
'use strict';

class PermissoesController {

    constructor(authAPI) {

        let self = this;

        // TODO: Usar APICHECK
        self.crudOptions = {
            api: "/permissoes",
            httpRequest: function () {
                // TODO: Usar angular interceptions (ver video angularjs)
                return authAPI.http.apply(authAPI, arguments);
            },
            addButtonLabel: "criar permissão",
            createFormLabel: "Nova Permissão",
            createFormLayout: 0,
            updateFormLayout: 1,
            formOptions: {},
            formFieldOptions: {}
        };
    }
}


module.exports = PermissoesController;