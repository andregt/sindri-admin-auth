/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/models/conta.js
 */
"use strict";

const Model = require('sindri-framework/model');
const moment = require('moment');


class ContaModel extends Model {

    setup() {

        this.connection = 'default';

        this.tableName = 'conta';

        this.primaryKey = 'conta_id';

        this.url = "/contas";

        this.relations = {};


        this.schema = {

            conta_id: {
                type: 'numeric'
            },
            nome: {
                type: "string",
                size: 255,
                validation: 'required',
                client: {
                    'default': {
                        group: 1,
                        className: 'col-md-3',
                        label: "Nome Completo"
                    }
                }
            },

            email: {
                type: "string",
                size: 255,
                validation: {
                    required: undefined,
                    unique: 'E-mail já cadastrado',
                    email: undefined
                },
                client: {
                    'default': {
                        group: 1,
                        className: 'col-md-3',
                        label: "E-mail"
                    }
                }
            },
            tipoCadastro: {
                type: "enum",
                'default': 'F',
                enum: {
                    F: 'Física',
                    J: "Júridica"
                },
                validation: 'required',
                client: {
                    'default': {
                        group: 1,
                        className: 'col-md-4',
                        grid: {
                            width: 120,
                            cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity[col.field] == "F" ? "Pessoa Física" : "Pessoa Jurídica" }}</div>'
                        }
                    }
                }
            },
            cpfCnpj: {
                type: "string",
                size: 18,
                validation: {
                    required: null,
                    unique: "CPF/CNPJ já cadastrado",
                    custom: function (fieldName, fieldInfo, oldData, options, model) {

                        // Valida CPF e CNPJ
                        let tipoCadastro = model.schema.tipoCadastro.value;

                        if (tipoCadastro === 'F') {

                            return require('sindri-framework/sindriModel/validator/cpf').validate(fieldName, fieldInfo);


                        } else if (tipoCadastro === 'J') {

                            return require('sindri-framework/sindriModel/validator/cnpj').validate(fieldName, fieldInfo);

                        } else {

                            return "Tipo de Cadastro Inválido";

                        }
                    }
                },
                client: {
                    'default': {
                        mask: "cpf",
                        group: 1,
                        className: 'col-md-2',
                        label: "CPF/CNPJ",
                        availableGrid: false
                    }
                }
            },
            rg: {
                type: "numeric",
                size: 15,
                validation: {
                    required: undefined,
                    unique: "R.G. já cadastrado"
                },
                client: {
                    'default': {
                        group: 2,
                        className: 'col-md-3',
                        label: "R.G.",
                        availableGrid: false
                    }
                }
            },
            inscricaoEstadual: {
                type: "numeric",
                size: 15,
                validation: {
                    unique: "Instrição Estadual já cadastrada"
                },
                client: {
                    'default': {
                        group: 2,
                        className: 'col-md-3',
                        label: "Inscrição Estadual",
                        availableGrid: false
                    }
                }
            },
            sexo: {
                type: "enum",
                enum: {
                    M: 'Masculino',
                    F: "Feminino"
                },
                validation: 'required',
                client: {
                    'default': {
                        group: 2,
                        className: 'col-md-4',
                        availableGrid: false
                    }
                }
            },
            dataNascimento: {
                type: "date",
                validation: {
                    required: undefined,
                    rangeDate: {
                        minDate: new Date(1916, 1, 1),
                        maxDate: moment().subtract(18, 'years').toDate()
                    }
                },
                client: {
                    'default': {
                        group: 2,
                        className: 'col-md-2',
                        label: "Nascimento",
                        availableGrid: false
                    }
                }
            },
            endereco: {
                type: "string",
                size: 255,
                validation: 'required',
                client: {
                    'default': {
                        group: 3,
                        className: 'col-md-3',
                        label: "Endereço",
                        availableGrid: false
                    }
                }
            },
            numero: {
                type: "numeric",
                size: 6,
                validation: 'required',
                client: {
                    'default': {
                        group: 3,
                        className: 'col-md-1',
                        label: "Número",
                        availableGrid: false
                    }
                }
            },
            complemento: {
                type: "string",
                size: 15,
                client: {
                    'default': {
                        group: 3,
                        className: 'col-md-2',
                        label: "Complemento",
                        availableGrid: false
                    }
                }
            },
            cep: {
                type: "string",
                size: 15,
                validation: 'required',
                client: {
                    'default': {
                        mask: "cep",
                        group: 3,
                        className: 'col-md-2',
                        label: "CEP",
                        availableGrid: false
                    }
                }
            },
            bairro: {
                type: "string",
                size: 255,
                client: {
                    'default': {
                        group: 3,
                        className: 'col-md-2',
                        label: "Bairro",
                        availableGrid: false
                    }
                }
            },
            municipio: {
                type: "string",
                size: 255,
                validation: 'required',
                client: {
                    'default': {
                        group: 3,
                        className: 'col-md-2',
                        label: "Município"
                    }
                }
            },
            estado: {
                type: "string",
                size: 255,
                validation: 'required',
                client: {
                    'default': {
                        group: 4,
                        className: 'col-md-1',
                        label: "Estado",
                        grid: {
                            width: 60
                        }
                    }
                }
            },
            pais: {
                type: "string",
                size: 255,
                validation: 'required',
                client: {
                    'default': {
                        group: 4,
                        className: 'col-md-3',
                        label: "País",
                        availableGrid: false
                    }
                }
            },
            telefone: {
                type: "string",
                size: 32,
                validation: 'required',
                client: {
                    'default': {
                        mask: 'phonebr',
                        group: 4,
                        className: 'col-md-2',
                        label: "Telefone",
                        grid: {
                            width: 120,
                            cellFilter: "googleLibPhoneNumber"
                        }
                    }
                }
            },
            celular: {
                type: "string",
                size: 32,
                client: {
                    'default': {
                        mask: 'phonebr',
                        group: 4,
                        className: 'col-md-2',
                        label: "Celular",
                        grid: {
                            width: 120,
                            cellFilter: "googleLibPhoneNumber"
                        }
                    }
                }
            },
            ativo: {
                type: "bool",
                'default': true,
                client: {
                    'default': {
                        label: "Conta Ativa",
                        group: 5,
                        className: 'col-md-2',
                        grid: {
                            displayName: "Status",
                            width: 60,
                            cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity[col.field] ? "Ativo" : "Inativo" }}</div>'
                        }
                    }
                }
            }


        };

    }

}

module.exports = ContaModel;

 