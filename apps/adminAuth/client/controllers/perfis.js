/**
 * **Created on 10/06/16**
 *
 * <File Reference Aqui: perfis>
 * @author André Timermann <andre@andregustvo.org>
 *
 */
'use strict';

class PerfisController {

    constructor(authAPI) {

        let self = this;

        // TODO: Usar APICHECK
        self.crudOptions = {
            api: "/perfis",
            httpRequest: function () {
                // TODO: Usar angular interceptions (ver video angularjs)
                return authAPI.http.apply(authAPI, arguments);
            },
            addButtonLabel: "criar perfil",
            createFormLabel: "Novo Perfil",
            createFormLayout: 0,
            updateFormLayout: 1,
            formOptions: {},
            formFieldOptions: {}
        };
    }
}


module.exports = PerfisController;