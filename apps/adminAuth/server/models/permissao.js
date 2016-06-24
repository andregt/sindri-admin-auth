/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/models/usuario.js
 */
'use strict';

const Model = require('sindri-framework/model');
const _ = require('lodash');
const logger = require('sindri-logger');

class PermissaoModel extends Model {

    setup() {


        /* Colocado dentro do setup() para evitar dependencia circular (quando ocorre dependencia circular, o nodejs retorna undefined para o modulo ) */
        const PerfilModel = require('./perfil');
        const MenuModel = require('./menu');


        this.connection = 'default';

        this.tableName = 'permissao';

        this.primaryKey = 'permissao_id';

        this.url = "/permissoes";

        this.relations = {

            perfis: {
                type: "ManyToMany",
                model: PerfilModel,
                relationTable: "perfil__permissao",
                columns: ['nome'], // Trás dados da tabela Remota,
                client: {
                    'default': {
                        grid: {
                            available: false
                        },
                        form: {
                            tab: 'Perfis',
                            label: '',
                            tableColumns: {
                                nome: "Nome",
                                descricao: "Descrição"
                            },
                            noResultsText: "Nenhum Perfil Disponível"
                        }
                    }
                }
            },

            menus: {
                type: "ManyToMany",
                model: MenuModel,
                relationTable: "permissao__menu",
                columns: ['titulo', 'descricao', 'menuPai'], // Trás dados da tabela Remota,
                client: {
                    'default': {
                        grid: {
                            available: false
                        },
                        form: {
                            tab: 'Menus',
                            label: '',
                            tableColumns: {
                                titulo: "Título",
                                descricao: "Descrição"
                            },
                            // groupBy: 'menuPai',
                            noResultsText: "Nenhum Menu Disponível"
                        }
                    }
                }
            }

        };


        this.schema = {

            permissao_id: {
                type: 'numeric',
                name: 'id' // Automatico para Primary Key, mas está aqui para ilustrar oq poderia ser feito com outros campos tb (renomear)
            },

            categoria: {
                type: 'string',
                size: 64,
                nullable: true,
                client: {
                    'default': {
                        label: "Categoria",
                        ord: 1,
                        form: {
                            tab: 'Propriedades'
                        }
                    }
                }
            },

            permissao: {
                type: 'string',
                size: 128,
                nullable: false,
                validation: {
                    required: undefined,
                    unique: 'Permissão já cadastrada'
                },
                client: {
                    'default': {
                        label: "Permissão",
                        ord: 2,
                        form: {
                            tab: 'Propriedades'
                        }
                    }
                }
            },

            titulo: {
                type: 'string',
                size: 63,
                nullable: false,
                validation: ['required'],
                client: {
                    'default': {
                        label: "Nome Amigável",
                        ord: 3,
                        form: {
                            tab: 'Propriedades'
                        }
                    }
                }
            },

            descricao: {
                type: 'string',
                size: 512,
                nullable: true,
                client: {
                    'default': {
                        label: "Descrição",
                        ord: 4,
                        form: {
                            tab: 'Propriedades'
                        }
                    }
                }
            },


            ativo: {
                type: "bool",
                'default': true,
                client: {
                    'default': {
                        label: "Permissão Ativa",
                        ord: 5,
                        grid: {
                            gridOptions: {
                                displayName: "Status",
                                width: 60,
                                cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity[col.field] ? "Ativo" : "Inativo" }}</div>'
                            }
                        },
                        form: {
                            tab: 'Propriedades'
                        }
                    }
                }
            }

        };

    }

    /**
     * Cria Nova Permissão, verificando se já existe
     *
     * @param data
     * @returns {*|Promise.<TResult>}
     */
    static createPermissao(data) {

        let Self = this;

        const MenuModel = require('./menu');

        logger.debug(`Permissao '${data.permissao}'...`);

        return Self
        /////////////////////////////////////////
        // Verifica se Já foi Cadastrado
        /////////////////////////////////////////
            .exist('permissao', data.permissao)

            .then(function (exist) {

                if (!exist) {

                    let permissao = new Self();

                    return permissao
                        .setData(data)
                        .then(function () {

                            let promises = [];

                            // Adiciona Menus
                            _.each(data.menus, function (menu) {
                                promises.push(MenuModel.findOneByColumn('nome', menu));
                            });

                            return Promise.all(promises);

                        })
                        .then(function (menus) {
                            return permissao.set('menus', menus)
                        })
                        .then(function () {
                            return permissao.save();
                        })
                        .then(function (result) {

                            // logger.debug(result);

                        });


                }
                // Já existe, sai
                else {
                    logger.debug(`Permissão '${data.permissao}' já existe!`);
                    return true;
                }

            });


    }


}

module.exports = PermissaoModel;
