/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/models/usuario.js
 */
'use strict';

const Model = require('sindri-framework/model');
const auth = require('sindri-auth/auth');
const _ = require('lodash');
const validator = require('validator');


/**
 * Nome da Aba
 * @type {string}
 */
const tabAttrName = 'Propriedades';

class UsuarioModel extends Model {

    setup() {

        /* Colocado dentro do setup() para evitar dependencia circular (quando ocorre dependencia circular, o nodejs retorna undefined para o modulo ) */
        const ContaModel = require('./conta');
        const PerfilModel = require('./perfil');

        this.connection = 'default';

        this.tableName = 'usuario';

        this.primaryKey = 'usuario_id';

        this.url = "/usuarios";

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
                            tab: tabAttrName,
                            placeholder: "Selecione uma Conta",
                            noResultsText: "Nenhuma Conta Encontrada",
                            nullOption: "-- Nenhuma Conta Vinculada --",
                            format: "${row.nome} - ${row.email} (#${row.id})"
                        },
                        grid: {
                            nullText: "Nenhuma conta vinculada",
                            customValue: '${row.entity["conta__email"]} (#${row.entity[col.field]})'

                        }
                    },
                    // Usuário De contas não tem acesso a alterar Conta
                    conta: false,
                    usuario: false
                }
            },

            perfis: {
                type: "ManyToMany",
                model: PerfilModel,
                relationTable: "usuario__perfil",
                // foreignKey: "perfil_id",    // Normalmente não usado (detecta automatico)
                // localKey: "usuario_id",      // Normalmente não usado (detecta automatico)
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
            }

        };


        this.schema = {

            usuario_id: {
                type: 'numeric',
                name: 'id' // Automatico para Primay Key, mas está aqui para ilustrar oq poderia ser feito com outros campos tb (renomear)
            },

            // TODO: Usuário deve ser minusculo, contar letras, numeros, underscore ou ponto
            usuario: {
                type: 'string',
                size: 255,
                nullable: false,
                validation: {
                    required: undefined,
                    unique: "Usuário já existe",
                    custom: function (fieldName, fieldInfo, oldData, options, model) {

                        if (validator.isAlphanumeric(fieldInfo.value)) {
                            return true;
                        } else {
                            return "Usuário deve conter apenas letras e números";
                        }
                    }
                },
                client: {
                    'default': {
                        label: "Usuário",
                        ord: 1,
                        form: {
                            tab: tabAttrName
                        }
                    }
                }

            },

            senha: {
                type: 'string',
                // size: 255,
                nullable: false,
                validation: ['password'],
                select: false,
                set: function bcrypt(value, fieldName, model) {

                    // TODO: Criar Filtro no sindriModel (Verificar Viabilidade)
                    if (value) {
                        return auth.createHash(value);
                    } else {
                        return "";
                    }

                },
                client: {
                    'default': {
                        ord: 2,
                        forceType: "password",
                        form: {
                            tab: tabAttrName
                        }

                    }
                }
            },

            nome: {
                type: 'string',
                size: 255,
                nullable: false,
                validation: ['required'],
                client: {
                    'default': {
                        grid: {
                            available: false
                        },
                        label: "Nome Completo",
                        ord: 3,
                        form: {
                            tab: tabAttrName
                        }

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
                        label: "E-mail",
                        ord: 4,
                        form: {
                            tab: tabAttrName
                        }
                    }
                }
            },

            administradorGeral: {
                type: "bool",
                'default': false,
                client: {
                    'default': {
                        label: "Administrador Geral",
                        ord: 5,
                        grid: {
                            gridOptions: {
                                width: 90,
                                displayName: "Adm Geral",
                                // TODO: Criar plugin sindriGrid para boolean
                                cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity[col.field] ? "Sim" : "Não" }}</div>'
                            }
                        },
                        form: {
                            tab: tabAttrName
                        }
                    },
                    // Usuário De contas não tem acesso a alterar Conta
                    conta: false,
                    usuario: false
                }
            },

            administradorConta: {
                type: "bool",
                'default': false,
                client: {
                    'default': {
                        label: "Administrador da Conta",
                        ord: 6,
                        grid: {
                            gridOptions: {
                                displayName: "Adm Conta",
                                width: 90,
                                // TODO: Criar plugin sindriGrid para boolean
                                cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity[col.field] ? "Sim" : "Não" }}</div>'
                            }
                        },
                        form: {
                            tab: tabAttrName
                        } // Usuário Normal não tem acesso a alterar administrador de conta

                    },
                    usuario: false
                }

            },

            // TODO: Expiração será manual? configurar Periodo de expiração em dias e data de alteração
            // expiracaoSenha: {
            //     type: "datetime",
            //     'default': null,
            //     client: {
            //         'default': {
            //             label: "Senha Expira em",
            //             available: false
            //         }
            //     }
            // },

            alterarSenha: {
                type: "bool",
                'default': false,
                client: {
                    'default': {
                        label: "Exigir troca de senha na próxima autenticação",
                        ord: 7,
                        available: false,
                        grid: {
                            gridOptions: {
                                displayName: "Trocar Senha",
                                width: 120,
                                // TODO: Criar plugin sindriGrid para boolean
                                cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity[col.field] ? "Sim" : "Não" }}</div>'
                            }
                        },
                        form: {
                            tab: tabAttrName
                        }
                    },
                    usuario: false
                }
            },

            ativo: {
                type: "bool",
                'default': true,
                client: {
                    'default': {
                        label: "Conta Ativa",
                        ord: 8,
                        grid: {
                            gridOptions: {
                                displayName: "Status",
                                width: 60,
                                cellTemplate: '<div class="ui-grid-cell-contents">{{ row.entity[col.field] ? "Ativo" : "Inativo" }}</div>'
                            }
                        },
                        form: {
                            tab: tabAttrName
                        }
                    }
                }
            }


        };

    }

    /**
     * Verifica se Token existe,
     *
     * Deve retornar:
     *  null ou false caso não encontre
     *  Objeto instancia Error caso ocorra um erro
     *  Objeto representando Usuario, com todas as informações de perfil etc
     *
     * @param username
     * @param token
     */
    static getUser(username, token) {

        var self = this;
        let usuario = new UsuarioModel();

        return usuario
            .db(usuario.tableName)
            .count('* as t')
            .where({
                'usuario': username,
                'token': token,
                'ativo': true
            })
            .then(function (row) {

                if (row[0].t === 1) {

                    return self.loadUser(username);

                } else {
                    return false;
                }
            });

    }

    /**
     * Dado Objeto com Informação do Usuario, retorna Dados que vão para o Cliente (Filtra)
     *
     * @param   {Object} user Dados do Usuário
     *
     * @returns {Object} Dados do Usuário Filtrado
     */
    static getClientUser(user) {


        return {
            id: user.id,
            user: user.usuario,
            name: user.nome,
            email: user.email,
            image: user.image,
            registrationDate: new Date(user.dataCadastro),
            accountAdmin: user.administradorConta,
            admin: user.administradorGeral,
            permissions: user.permissions
        };

    }

    /**
     * Retorna Hash
     *
     * @param  {[type]} username [description]
     * @return {[type]}          [description]
     */
    static getHash(username) {

        let usuario = new UsuarioModel();

        return usuario
            .db(usuario.tableName)
            .select('senha')
            .where({
                'usuario': username,
                'ativo': true
            })
            .then(function (row) {

                ////////////////////////////////
                // Usuário Existe
                ////////////////////////////////
                if (row[0]) {
                    // Forçar usuário a aguardar 1 segundo
                    return row[0].senha;

                } else {

                    return false;

                }

            });


    }

    /**
     * Salva Token no Banco de Dados
     *
     * @param username
     * @param token
     * @param knexConnections
     * @param s
     * @param done
     */
    static saveToken(username, token) {

        let usuario = new UsuarioModel();

        return usuario.db('usuario')
            .where({
                'usuario': username,
                'ativo': true
            })
            .update('token', token);


    }

    /**
     * Carrega Informações do Usuário
     *
     * @param username
     *
     */
    static loadUser(username) {


        let self = this;
        let usuario = new UsuarioModel();

        let user;

        /////////////////////////////////////////////////////////////
        //Carrega Info do Usuário
        /////////////////////////////////////////////////////////////
        return usuario.db('usuario')
            .first('usuario_id as id', 'usuario', 'administradorConta', 'administradorGeral', 'nome', 'email', 'imagem', 'dataCadastro', 'conta_id as conta')
            .where({
                "ativo": true,
                "usuario": username
            })
            .then(function (row) {

                // Pegamos o valor do primeiro byte
                user = row;

            })
            /////////////////////////////////////////////////////////////
            // Carrega Lista de Permissões
            /////////////////////////////////////////////////////////////
            .then(function () {

                return usuario.db
                    .distinct('pe.permissao AS permissao')
                    .from('usuario as u')
                    .join('usuario__perfil as up', 'up.usuario_id', 'u.usuario_id')
                    .join('perfil as p', 'up.perfil_id', 'p.perfil_id')
                    .join('perfil__permissao AS pp', 'p.perfil_id', 'pp.perfil_id')
                    .join('permissao as pe', 'pp.permissao_id', 'pe.permissao_id')
                    .where({
                        "p.ativo": true,
                        "u.ativo": true,
                        "u.usuario": username
                    });

            })
            /////////////////////////////////////////////////////////////
            // Retorna usuário
            /////////////////////////////////////////////////////////////
            .then(function (rows) {

                user.permissions = _.map(rows, 'permissao');
                user.administradorConta = !!user.administradorConta[0];
                user.administradorGeral = !!user.administradorGeral[0];

                return user;

            });

    }


}

module.exports = UsuarioModel;
