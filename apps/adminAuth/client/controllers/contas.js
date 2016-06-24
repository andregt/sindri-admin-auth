/**
 * Created by André Timermann on 09/05/16.
 *
 *
 */
'use strict';

class ContasController {

    constructor(authAPI) {


        // TODO: Usar APICHECK
        this.crudOptions = {

            url: "/contas",
            loadSchemaFromServer: true,



            // TODO: Usar angular interceptions (ver video angularjs)
            httpRequest: function () {
                return authAPI.http.apply(authAPI, arguments);
            },


            addButtonLabel: "criar conta",

            createFormLabel: "Nova Conta",

            updateFormLabel: "Alterar Conta",

            createFormLayout: 2,

            updateFormLayout: 2,


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Configurações do DataGrid
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            gridOptions: {},


            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Configurações do Form
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            formOptions: {},
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Atributos Especiais do Formulário
            // TODO: Documentar como definir atributos personalizado do formulário aqui
            ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            formFieldOptions: {

                ////////////////////////////////////////////////////////////////////////
                // CPF CNPJ
                ////////////////////////////////////////////////////////////////////////
                cpfCnpj: {
                    expressionProperties: {
                        'templateOptions.mask': function ($viewValue, $modelValue, scope) {

                            if (scope.model.tipoCadastro === 'J') {
                                return '99.999.999/9999-99';
                            } else {
                                return '999.999.999-99';
                            }
                        },

                        'templateOptions.label': function ($viewValue, $modelValue, scope) {

                            if (scope.model.tipoCadastro === 'J') {
                                return 'CNPJ';
                            } else {
                                return 'CPF';
                            }
                        }

                    }


                }
                ////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////


            }


        };


    }
}


module.exports = ContasController;