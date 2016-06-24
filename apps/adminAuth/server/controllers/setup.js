/**
 * **Created on 19/06/16**
 *
 * Setup inicial do SindriAdminAuth, como configuração de menus, permissões, Usuário padrão
 *
 * sindri-admin-auth/apps/adminAuth/server/controllers/setup.js
 * @author André Timermann <andre@andregustvo.org>
 *
 */
"use strict";

const Controller = require('sindri-framework/controller');
const MenuModel = require('../models/menu');
const PermissaoModel = require('../models/permissao');
const logger = require('sindri-logger');

class SetupController extends Controller {

    setup() {

        let self = this;


        Promise.resolve()

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Cadastro de Menus
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
            .then(function () {

                return MenuModel.createEntryMenu(null, {
                    nome: 'administracao',
                    titulo: 'Administração',
                    descricao: 'Menu Principal que agrupa tarefas administrativas',
                    ordem: 9999,
                    icone: 'zmdi zmdi-view-compact'
                });

            })
            .then(function () {

                return MenuModel.createEntryMenu("administracao", {
                    nome: 'administracao__contas',
                    titulo: 'Contas',
                    descricao: 'Cadastro de Contas',
                    ordem: 10,
                    icone: 'zmdi zmdi-accounts-list zmdi-hc-fw',
                    alvo: 'admin.conta'
                });

            })

            .then(function () {

                return MenuModel.createEntryMenu("administracao", {
                    nome: 'administracao__usuarios',
                    titulo: 'Usuários',
                    descricao: 'Cadastro de Usuários',
                    ordem: 20,
                    icone: 'zmdi zmdi-accounts zmdi-hc-fw',
                    alvo: 'admin.usuario'
                });

            })
            .then(function () {

                return MenuModel.createEntryMenu("administracao", {
                    nome: 'administracao__perfis',
                    titulo: 'Perfis',
                    descricao: 'Cadastro de Perfis',
                    ordem: 30,
                    icone: 'zmdi zmdi-assignment-account zmdi-hc-fw',
                    alvo: 'admin.perfil'
                });

            })
            .then(function () {

                return MenuModel.createEntryMenu("administracao", {
                    nome: 'administracao__permissoes',
                    titulo: 'Permissões',
                    descricao: 'Cadastro de Permissões',
                    ordem: 40,
                    icone: 'zmdi zmdi-key zmdi-hc-fw',
                    alvo: 'admin.permissao'
                });

            })
            .then(function () {

                return MenuModel.createEntryMenu("administracao", {
                    nome: 'administracao__menu',
                    titulo: 'Menu',
                    descricao: 'Cadastro de Menu',
                    ordem: 50,
                    icone: 'zmdi zmdi-menu zmdi-hc-fw',
                    alvo: 'admin.menu'
                });

            })



            // ==========================================================
            // Carrega Permissões - Usuários
            // ==========================================================
            .then(function () {

                return PermissaoModel.createPermissao({
                    permissao: 'administrador__usuario_criar',
                    titulo: 'Criar Usuários',
                    descricao: 'Permissão para criar novo usuário',
                    categoria: 'Administração'
                });

            })
            .then(function () {

                return PermissaoModel.createPermissao({
                    permissao: 'administrador__usuario_gerenciar',
                    titulo: 'Gerenciar Usuários',
                    descricao: 'Permissão para alterar usuário já existente',
                    categoria: 'Administração'
                });

            })
            .then(function () {

                return PermissaoModel.createPermissao({
                    permissao: 'administrador__usuario_excluir',
                    titulo: 'Excluir Usuários',
                    descricao: '',
                    categoria: 'Administração'
                });

            })
            .then(function () {

                return PermissaoModel.createPermissao({
                    permissao: 'administrador__usuario_visualizar',
                    titulo: 'Visualizar Usuários',
                    descricao: '',
                    categoria: 'Administração',
                    menus: ['administracao__usuarios']
                });

            })
            .then(function () {

                return PermissaoModel.createPermissao({
                    permissao: 'administrador__usuario_alterar_senha',
                    titulo: 'Alterar Senha',
                    descricao: 'Permissão para alterar a própria senha',
                    categoria: 'Administração'
                });

            })
            .then(function () {

                return PermissaoModel.createPermissao({
                    permissao: 'administrador__usuario_gerenciar_senhas',
                    titulo: 'Gerenciar Senhas',
                    descricao: 'Permissão para alterar a senha de qualquer usuário',
                    categoria: 'Administração'
                });

            })
            .then(function () {

                return PermissaoModel.createPermissao({
                    permissao: 'administrador__usuario_gerenciar_perfis',
                    titulo: 'Alterar Perfil do Usuário',
                    descricao: 'Permissão para alterar perfis de qualquer usuário',
                    categoria: 'Administração'
                });

            })
            // ==========================================================
            // Carrega Permissões - Perfis
            // ==========================================================
            .then(function () {

                return PermissaoModel.createPermissao({
                    permissao: 'administrador__perfil_gerenciar',
                    titulo: 'Gerenciar Perfis',
                    descricao: 'Permissão para criar, editar e remover perfis',
                    categoria: 'Administração',
                    menus: ['administracao__perfis']
                });

            })



            // ==========================================================
            // Carrega Usuário Padrão
            // ==========================================================
            .catch(function (err) {

                console.log(err.stack);

            });

    }


}

module.exports = SetupController;
