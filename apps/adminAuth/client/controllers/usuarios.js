/**
 * Created by André Timermann on 09/05/16.
 *
 *
 */
'use strict';

class UsuariosController {

    constructor(authAPI) {

        let self = this;

        // TODO: Usar APICHECK
        self.crudOptions = {
            api: "/usuarios",
            httpRequest: function () {
                // TODO: Usar angular interceptions (ver video angularjs)
                return authAPI.http.apply(authAPI, arguments);
            },
            addButtonLabel: "criar usuário",
            createFormLabel: "Novo Usuário",
            createFormLayout: 0,
            updateFormLayout: 1,
            formOptions: {},
            formFieldOptions: {}
        };
    }
}


module.exports = UsuariosController;