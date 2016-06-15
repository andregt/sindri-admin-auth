/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/models/usuario.js
 */
'use strict';

const Model = require('sindri-framework/model');
const _ = require('lodash');

const ContaModel = require('./conta');

class PerfilModel extends Model {

    setup() {

        this.connection = 'default';

        this.tableName = 'perfil';

        this.primaryKey = 'perfil_id';

        this.url = "/perfis";

        this.relations = {

            conta: {
                type: 'ManyToOne',
                model: ContaModel,
                foreignKey: 'conta_id',
                columns: ["nome", "email"], // Colunas extras que serão carregadas para o grid
                select: true,
                client: {
                    'default': {
                        ord: 0,
                        form: {
                            placeholder: "Selecione uma Conta",
                            noResultsText: "Nenhuma Conta Encontrada",
                            nullOption: "-- Nenhuma Conta Vinculada --",
                            format: "${row.nome} - ${row.email} (#${row.id})"
                        },
                        grid: {
                            nullText: "Nenhuma conta vinculada",
                            customValue: '${row.entity["conta__email"]} (#${row.entity[col.field]})'
                        }
                    }
                }
            }

        };


        this.schema = {

            perfil_id: {
                type: 'numeric',
                name: 'id' // Automatico para Primary Key, mas está aqui para ilustrar oq poderia ser feito com outros campos tb (renomear)
            },


            nome: {
                type: 'string',
                size: 64,
                nullable: false,
                validation: ['required'],
                client: {
                    'default': {
                        label: "Perfil",
                        ord: 1,
                        grid: {
                            gridOptions: {
                                width: 240
                            }
                        }
                    }
                }
            },

            descricao: {
                type: 'string',
                size: 512,
                nullable: false,
                client: {
                    'default': {
                        label: "Descrição",
                        ord: 2
                    }
                }
            },


            ativo: {
                type: "bool",
                'default': true,
                client: {
                    'default': {
                        label: "Perfil Ativa",
                        ord: 3,
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

    /**
     * Valida se campo dumplo é unico
     * NOTA: Mysql permite repetir valores unicos quando uma das colunas é nula
     *
     * @param oldData
     * @returns {*}
     */
    validation(oldData) {

        let args = arguments;

        let self = this;

        //////////////////////////////////////////////////
        // Verifica se os dados foram alterado
        //////////////////////////////////////////////////

        // Não alterou


        if (!self.isNew() && oldData.conta_id === self.getInternal('conta') && oldData.nome === self.getInternal('nome')) {

            return true;

        }

        //////////////////////////////////////////////////
        // Alterou vamos realizar validações
        // Verifica se já foi cadastrado
        //////////////////////////////////////////////////
        else {


            let perfil = new PerfilModel();

            return self.db.from(this.tableName)
                .count("* as count")
                .first()
                .where({
                    conta_id: self.relations['conta'].value,
                    nome: self.schema['nome'].value
                })
                .then(function (result) {

                    if (result.count > 0) {

                        return {
                            valid: false,
                            itemError: [{
                                id: "nome",
                                message: "Perfil deve ser único"
                            }],
                            Error: []
                        }

                    } else {

                        return true;

                    }

                });


        }
    }


}

module.exports = PerfilModel;
