/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/models/usuario.js
 */
'use strict';

const Model = require('sindri-framework/model');
const _ = require('lodash');
const logger = require('sindri-logger');

/**
 * @extends Model
 */
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

            icone: {
                type: 'string',
                size: 256,
                nullable: false,
                client: {
                    'default': {
                        label: "Ícone",
                        ord: 2,
                        grid: {
                            available: false
                        }
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

    /**
     * Cria dados do Menu de acordo com a permissão do usuário passado
     * TODO: Nome ficou confuso, mudar para algo como generateMenu, ou getAuthrorizedMenu
     *
     * @param id
     * @param returnAll Retorna Todos os Menus sem verificar Permissão
     */
    static createMenu(id, returnAll) {

        let Self = this;

        let authorizedMenu;

        if (id) {

            logger.debug("01 - Carregando Menus Autorizados...");

            let query;

            // Se retorna ou não todos os usuários
            if (returnAll) {

                query = Self.db(Self.tableName)
                    .select('menu.menu_id')
                    .where('menu.ativo', true);

            } else {

                query = Self.db(Self.tableName)
                    .distinct('menu.menu_id')
                    .leftJoin('permissao__menu', 'menu.menu_id', 'permissao__menu.menu_id')
                    .leftJoin('permissao', 'permissao__menu.permissao_id', 'permissao.permissao_id')
                    .leftJoin('perfil__permissao', 'permissao.permissao_id', 'perfil__permissao.permissao_id')
                    .leftJoin('perfil', 'perfil__permissao.perfil_id', 'perfil.perfil_id')
                    .leftJoin('usuario__perfil', 'perfil.perfil_id', 'usuario__perfil.perfil_id')
                    .where({
                        'usuario__perfil.usuario_id': id,
                        'menu.ativo': true,
                        'permissao.ativo': true,
                        'perfil.ativo': true
                    });

            }


            return query
                .then(function (result) {

                    authorizedMenu = _.map(result, 'menu_id');

                    logger.debug("02 - Carregando Menus Disponíveis...");
                    return Self.db(Self.tableName)
                        .distinct('menu.*')
                        .where('menu.ativo', true);


                }).then(function (availableMenu) {


                    return Self._parseMenuData(authorizedMenu, availableMenu);


                });

        } else {

            Promise.resolve([]);

        }


    }

    /**
     * Formata dados Cru do banco de dados e gera uma estrutura organizada para enviar ao cliente
     *
     * @private
     * @param authorizedMenu
     * @param availableMenu
     */
    static _parseMenuData(authorizedMenu, availableMenu) {

        let Self = this;
        logger.debug("03 - Processando Menus...");
        logger.debug(" -> Menus Autorizados: " + authorizedMenu);
        logger.debug(" -> Menus Disponíveis: " + _.map(availableMenu, 'menu_id'));

        // Converte Array para Objeto Indexado
        availableMenu = _.reduce(availableMenu, function (acumulator, menu) {
            acumulator[menu.menu_id] = menu;
            return acumulator;

        }, {});


        let menu = [];

        logger.debug("04 - Lendo Menus...");
        _.each(authorizedMenu, function (menuId) {

            logger.debug("");
            logger.debug("");
            logger.debug("Lendo Menu: " + menuId);
            Self._analysisMenu(menu, availableMenu, menuId, []);

        });

        return menu;

    }

    /**
     * Analisa Menus para adicionalos em seguida de forma Ordenada e Hierarquizada
     *
     * @param menu              Menus Atualis para serem adicionado
     * @param availableMenu     Id dos Menus Disponíveis
     * @param menuId            Menu que está sendo analisado no momento
     * @param childrens         Menus Filhos desde menu para ser adicionado posteriormente
     *
     * @private
     */
    static _analysisMenu(menu, availableMenu, menuId, childrens) {


        let Self = this;

        // Verifica se o Menu Existe para ser adicionado
        if (availableMenu[menuId]) {

            let newMenu = availableMenu[menuId];

            childrens.push(menuId);

            // Verifica se é menu principal, se for, então adiciona
            if (newMenu.menuPai === null) {

                logger.debug(`   ` + childrens + '!');
                Self._addMenu(menu, availableMenu, childrens);

            }
            // Se não foir navega até o pai adicionando como filho
            else {
                logger.debug(`   ` + childrens);
                Self._analysisMenu(menu, availableMenu, newMenu.menuPai, childrens);
            }

        } else {
            logger.error('ERRO: menu não encontrado')
        }


    }

    /**
     * Adiciona Menu ao resultado final
     *
     * @param menu              Lista de Menus Atuais
     * @param availableMenu     Ids dos menus disponíveis
     * @param newMenus          Lista de Menu para ser adicionado
     *
     * @returns {}  Menu Criado
     * @private
     */
    static _addMenu(menu, availableMenu, newMenus) {

        let Self = this;


        //  Controle de parada: quando não tiver mais filhos para de adicionar
        if (newMenus.length > 0) {

            logger.debug('');
            logger.debug("   Criando Menus : " + newMenus);

            let menuId = newMenus.pop();


            // Verifica se Menu Existe
            let result = _.find(menu, ['menu_id', menuId]);

            /////////////////////////////////////////
            // Se não existe cadastra
            /////////////////////////////////////////
            if (!result) {


                logger.debug(`      Adicionando Menu:`);
                logger.debug(`         ${menuId}`);

                menu.push(availableMenu[menuId]);

                // Obtém novamente agora que foi adicionada para criar filhos
                result = _.find(menu, ['menu_id', menuId]);
                result.filhos = [];


                /////////////////////////////////////////
                // ORDENA MENU
                /////////////////////////////////////////


                logger.debug(`      Menu:`);
                logger.debug(`         ` + _.map(menu, "ordem"));
                logger.debug(`      Menu Ordenado:`);
                menu = _.sortBy(menu, ['ordem']);
                logger.debug(`         ` + _.map(menu, "ordem"));

            } else {
                logger.debug(`      Já existe Menu: ${menuId}`);
            }

            /////////////////////////////////////////
            // Adiciona Filho
            /////////////////////////////////////////
            logger.debug(`      Adicionando Filhos:`);
            logger.debug(`         ${newMenus}`);
            result.filhos = Self._addMenu(result.filhos, availableMenu, newMenus)

        } else {
            logger.debug("         Sem Filhos!!!");
        }

        return menu;
    }

    /**
     * Cadastra Menu, usado para Setup inicial, realizando todas as verificações necessárias:
     *  - Se tem menu pai, procura menu pai, e salva
     *
     * @param parentMenu
     * @param menu
     *
     * @returns {*|Promise.<TResult>}
     */
    static createEntryMenu(parentMenu, menu) {

        let Self = this;

        logger.debug(`Verificando menu '${menu.nome}'...`);

        return Self

        /////////////////////////////////////////
        // Verifica se Já foi Cadastrado
        /////////////////////////////////////////
            .exist('nome', menu.nome)

            .then(function (exist) {

                if (!exist) {

                    ///////////////////////////////////////////////////////
                    // Tem um Menu Pai, Carrega id do Pai
                    ///////////////////////////////////////////////////////
                    if (parentMenu) {

                        logger.debug(`Menu '${menu.nome}' tem pai '${parentMenu}', procurando...`);
                        // Obtém Id
                        return Self.exist('nome', parentMenu).then(function (exist) {

                            if (exist) {
                                return Self.findOneByColumn('nome', parentMenu, true)
                            } else {
                                return null;
                            }

                        }).then(function (parentId) {

                            if (parentId) {
                                logger.debug(`Pai de '${parentMenu}' encontrado!!`);
                                return Self._createEntryMenu2(parentId, menu)
                            } else {

                                logger.debug(`Pai '${parentMenu}' não existe em '${menu.nome}'!!! Abortando...`);
                                return false;
                            }

                        })


                    }
                    ///////////////////////////////////////////////////////
                    // Não tem Menu Pai, apenas cria menu
                    ///////////////////////////////////////////////////////
                    else {

                        return Self._createEntryMenu2(null, menu)

                    }


                }
                // Já existe, sai
                else {
                    logger.debug(`Menu '${menu.nome}' já existe!`);
                    return true;
                }

            });


    }

    /**
     * Cria Menu
     *
     * @param parentId
     * @param menu
     * @returns {*|Promise.<TResult>}
     * @private
     */
    static _createEntryMenu2(parentId, menu) {

        let Self = this;

        logger.debug(`Cadastrando menu '${menu.nome}'. Pai: ${parentId}...`);

        if (parentId) {
            menu.menuPai = parentId;
        }

        let menuAdmin = new Self();

        return menuAdmin

            .setData(menu)

            .then(function () {

                return menuAdmin.save();

            }).then(function (result) {

                logger.debug(result);

            });

    }
}

module.exports = MenuModel;
