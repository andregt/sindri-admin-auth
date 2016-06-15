/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/models/usuario.js
 */
'use strict';

const Model = require('sindri-framework/model');
const _ = require('lodash');

class MenuModel extends Model {

    setup() {

        this.connection = 'default';

        this.tableName = 'menu';

        this.primaryKey = 'menu_id';

        this.url = "/menu";


        this.relations = {

            menuPai: {
                type: 'ManyToOne',
                model: MenuModel,
                alias: "menuPai", // Obrigatório ter Alias pois estamos relacionando consigo mesmo (ou vai dar conflito)
                foreignKey: 'menuPai',
                columns: ["nome", "titulo"], // Colunas extras que serão carregadas para o grid
                select: true,
                client: {
                    'default': {
                        ord: 3,
                        label: "Menu Pai",
                        form: {
                            placeholder: "Selecione menu Pai",
                            noResultsText: "Nenhuma Menu Carregado",
                            format: "${row.titulo} (${row.nome})",
                        },
                        grid: {
                            gridOptions: {
                                cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity["menu__titulo"] }}</div>'
                            }
                        }
                    }
                }
            }

        };

        this.schema = {

            menu_id: {
                type: 'numeric',
                name: 'id' // Automatico para Primary Key, mas está aqui para ilustrar oq poderia ser feito com outros campos tb (renomear)
            },


            nome: {
                type: 'string',
                size: 64,
                nullable: false,
                validation: {
                    required: undefined,
                    unique: 'Menu já cadastrado'
                },
                client: {
                    'default': {
                        label: "Nome Interno",
                        ord: 1
                    }
                }
            },

            titulo: {
                type: 'string',
                size: 64,
                nullable: false,
                validation: ['required'],
                client: {
                    'default': {
                        label: "Título",
                        ord: 2
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

            alvo: {
                type: 'string',
                size: 1024,
                nullable: true,
                client: {
                    'default': {
                        ord: 5
                    }
                }
            },

            ordem: {
                type: 'numeric',
                nullable: false,
                'default': 0,
                validation: ['required'],
                client: {
                    'default': {
                        ord: 6
                    }
                }
            },


            ativo: {
                type: "bool",
                'default': true,
                client: {
                    'default': {
                        label: "Menu Ativo",
                        ord: 7,
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

module.exports = MenuModel;
