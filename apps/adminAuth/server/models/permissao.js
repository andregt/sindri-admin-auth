/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/models/usuario.js
 */
'use strict';

const Model = require('sindri-framework/model');
const _ = require('lodash');

class PermissaoModel extends Model {

    setup() {

        this.connection = 'default';

        this.tableName = 'permissao';

        this.primaryKey = 'permissao_id';

        this.url = "/permissao";

        this.relations = {};


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
                        ord: 1
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
                        ord: 2
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
                        ord: 3
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
                        ord: 4
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
                        }
                    }
                }
            }

        };

    }


}

module.exports = PermissaoModel;
