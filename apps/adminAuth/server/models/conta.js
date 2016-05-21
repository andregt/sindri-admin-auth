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
                enum: {
                    F: 'Física',
                    J: "Júridica"
                },
                validation: 'required',
                client: {
                    'default': {
                        group: 1,
                        className: 'col-md-4'
                    }
                }
            },
            cpfCnpj: {
                type: "string",
                size: 18,
                validation: {
                    required: null,
                    unique: "CPF/CNPJ já cadastrado",
                    custom: function (fieldName, fieldInfo, options, model) {

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
                        label: "CPF/CNPJ"
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
                        label: "R.G."
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
                        label: "Inscrição Estadual"
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
                        className: 'col-md-4'
                    }
                }
            },
            dataNascimento: {
                type: "date",
                validation: {
                    required: undefined,
                    rangeDate: {
                        minDate: new Date(1916,1,1),
                        maxDate: moment().subtract(18, 'years').toDate()
                    }
                },
                client: {
                    'default': {
                        group: 2,
                        className: 'col-md-2',
                        label: "Nascimento"
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
                        label: "Endereço"
                    }
                }
            },
            numero: {
                type: "numeric",
                size: 15,
                validation: 'required',
                client: {
                    'default': {
                        group: 3,
                        className: 'col-md-1',
                        label: "Número"
                    }
                }
            },
            complemento: {
                type: "string",
                size: 15,
                validation: 'required',
                client: {
                    'default': {
                        group: 3,
                        className: 'col-md-2',
                        label: "Complemento"
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
                        label: "CEP"
                    }
                }
            },
            bairro: {
                type: "string",
                size: 255,
                validation: 'required',
                client: {
                    'default': {
                        group: 3,
                        className: 'col-md-2',
                        label: "Bairro"
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
                        label: "Estado"
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
                        label: "País"
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
                        label: "Telefone"
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
                        label: "Celular"
                    }
                }
            },
            ativo: {
                type: "bool",
                client: {
                    'default': {
                        label: "Conta Ativa",
                        group: 5,
                        className: 'col-md-2'
                    }
                }
            }


        };

    }

}

module.exports = ContaModel;

 