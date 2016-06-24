/**
 * **Created on 10/06/16**
 *
 * sindri-admin-auth/apps/adminAuth/client/controllers/perfis.js
 * @author André Timermann <andre@andregustvo.org>
 *
 */
'use strict';

class PerfisController {


    constructor(authAPI, sindriAdmin) {

        let self = this;

        // TODO: Usar APICHECK
        self.crudOptions = {
            url: "/perfis",
            loadSchemaFromServer: true,
            httpRequest: function () {
                // TODO: Usar angular interceptions (ver video angularjs)
                return authAPI.http.apply(authAPI, arguments);
            },
            addButtonLabel: "criar perfil",
            addButtonEnabled: authAPI.user.accountAdmin && authAPI.hasPerm('administrador__perfil_gerenciar'),
            editButtonEnabled: authAPI.user.accountAdmin && authAPI.hasPerm('administrador__perfil_gerenciar'),
            editButtonEnabledOnColumnTrue: authAPI.user.admin ? undefined : 'conta', // Só autoriza edição se coluna conta for true
            deleteButtonEnabled: authAPI.user.accountAdmin && authAPI.hasPerm('administrador__perfil_gerenciar'),
            deleteButtonEnabledOnColumnTrue: authAPI.user.admin ? undefined : 'conta', // Só autoriza remoção se coluna conta for true
            createFormLabel: "Novo Perfil",
            updateFormLabel: "Editar Perfil",
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


module.exports = PerfisController;