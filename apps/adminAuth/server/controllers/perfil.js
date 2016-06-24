/**
 * Created by André Timermann on 10/06/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/controllers/perfil.js
 *
 * Permissões:
 *  | Permissão                               | Descrição                                                                                       |
 *  |-----------------------------------------|-------------------------------------------------------------------------------------------------|
 *  | administrador__perfil_gerenciar         | Permissão para Gerenciar Perfis (Alterar, Criar, Excluir)                                       |
 *  |-----------------------------------------|-------------------------------------------------------------------------------------------------|
 *
 *  - Forçar para que apenas o gerenciador da conta tenha permissão de Gerenciar Perfis, então não precisa se preocupar em qual permissão vai editar,
 *         já q a limitação ficará na permissão
 *  - Só AdministradorGeral consegue alterar perfil de usuarios pelo crud de perfil (TODO: Administrador Conta é possível mais dá trabalho deixar para depois)
 *  - É permitido visualizar, vincular, mas não é possível Criar/alterar ou excluir perfis globais (sem conta vinculada)
 *
 */
"use strict";

const Controller = require('sindri-framework/controller');
const DataSync = require('sindri-framework/lib/dataSync');
const PerfilModel = require('../models/perfil');
const Auth = require('sindri-auth/auth');

class PerfilController extends Controller {

    routes() {

        let self = this;

        /**
         * Retorna todos os Perfis
         */
        self.get('/perfis', Auth.authenticate, (request, response) => {

            let dataSync = new DataSync(response);

            let user = request.user;
            let conditions;


            ///////////////////////////////////////////////////////////////////////
            // Validação de Permissões
            ///////////////////////////////////////////////////////////////////////

            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral && !user.conta,
                        msg: "Você deve estar associado a uma conta"
                    }
                ])) {

                return;
            }

            ///////////////////////////////////////////////////////////////////////
            // Apenas carrega perfis Globais (null) ou da conta atual
            ///////////////////////////////////////////////////////////////////////

            if (!request.user.administradorGeral) {

                // Define restrições
                conditions = {
                    whereRaw: ["perfil.conta_id = ? OR perfil.conta_id IS NULL", [user.conta]]
                };


            }


            PerfilModel
                .getCollections(true, conditions)
                .then((result) => {
                    dataSync.send(result);
                })
                .catch((err) => {
                    dataSync.exception(err);
                });

        });


        /**
         * Retorna um unico perfil
         */
        this.get('/perfis/:id(\\d+)', Auth.authenticate, (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;


            let user = request.user;

            ///////////////////////////////////////////////////////////////////////
            // Validação de Permissões
            ///////////////////////////////////////////////////////////////////////

            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral && !user.conta,
                        msg: "Você deve estar associado a uma conta"
                    }
                ])) {

                return;
            }

            ///////////////////////////////////////////////////////////////////////
            // Apenas carrega perfis Globais (null) ou da conta atual
            ///////////////////////////////////////////////////////////////////////

            let perfil = new PerfilModel();

            if (!request.user.administradorGeral) {

                // Define restrições
                perfil.setCondition({
                    whereRaw: ["perfil.conta_id = ? OR perfil.conta_id IS NULL", [user.conta]]
                });

            }


            perfil
                .setId(id)
                .then(function () {

                    return perfil.getData(true, true)

                })
                .then((result) => {

                    dataSync.send(result);

                })
                .catch((err) => {

                    dataSync.exception(err);

                });

        });

        /**
         * Salva novo Perfil
         */
        self.post('/perfis', Auth.authenticate, function (request, response) {

            // Salva
            let usuario = new PerfilModel();
            let dataSync = new DataSync(response);


            let user = request.user;

            ///////////////////////////////////////////////////////////////////////
            // Validação de Permissões
            ///////////////////////////////////////////////////////////////////////

            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral && !user.conta,
                        msg: "Você deve estar associado a uma conta"
                    },
                    {
                        // Para editar perfil ou é administrador Geral ou é Administrador da Conta e tem perfil gerenciador
                        test: !user.administradorGeral && (!user.administradorConta || !user.hasPerm('administrador__perfil_gerenciar')),
                        msg: "Você não tem permissão para criar Perfis"
                    },
                    {
                        test: !user.administradorGeral && request.body.conta !== undefined,
                        msg: "Você não tem permissão para alterar conta"
                    },
                    {
                        // TODO: Liberar pada AdminsitradorConta (Trabalhoso)
                        test: !user.administradorGeral && request.body.usuarios !== undefined,
                        msg: "Você não tem permissão para definir usuários"
                    }

                ])) {

                return;
            }

            ////////////////////////////////////////////////////////////
            // Força Conta Ao criar novo usuário quando Administrador Geral
            ////////////////////////////////////////////////////////////
            if (!request.user.administradorGeral) {
                request.body.conta = user.conta;
            }


            ////////////////////////////////////////////////////////////
            // Salva Dados no Base
            ////////////////////////////////////////////////////////////
            usuario
                .setData(request.body)
                .then(() => {

                    return usuario.save();

                })
                .then(function (result) {

                    self.sendModelResult(result, dataSync, false);

                })
                .catch((err) => {

                    dataSync.exception(err);

                });


        });


        /**
         * Atualiza Perfil
         */
        self.put('/perfis/:id(\\d+)', Auth.authenticate, (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let user = request.user;

            ///////////////////////////////////////////////////////////////////////
            // Apenas altera Perfis da conta atual
            ///////////////////////////////////////////////////////////////////////

            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral && !user.conta,
                        msg: "Você deve estar associado a uma conta"
                    },
                    {
                        // Para editar perfil ou é administrador Geral ou é Administrador da Conta e tem perfil gerenciador
                        test: !user.administradorGeral && (!user.administradorConta || !user.hasPerm('administrador__perfil_gerenciar')),
                        msg: "Você não tem permissão para editar Perfis"
                    },
                    {
                        test: !user.administradorGeral && request.body.conta !== undefined,
                        msg: "Você não tem permissão para alterar conta"
                    },
                    {
                        // TODO: Liberar pada AdminsitradorConta (Trabalhoso)
                        test: !user.administradorGeral && request.body.usuarios !== undefined,
                        msg: "Você não tem permissão para definir usuários"
                    }
                ])) {

                return;
            }


            ///////////////////////////////////////////////////////////////////////
            // Apenas altera usuários da conta atual
            ///////////////////////////////////////////////////////////////////////
            let perfil = new PerfilModel(id);

            if (!request.user.administradorGeral) {

                // Define restrições
                perfil.setCondition({
                    where: {
                        "perfil.conta_id": user.conta
                    }
                });

            }


            ////////////////////////////////////////////////////////////
            // Salva Dados no Base
            ////////////////////////////////////////////////////////////
            perfil
                .setData(request.body)

                .then(function () {

                    return perfil.save();

                })
                .then(function (result) {

                    self.sendModelResult(result, dataSync, false);

                })
                .catch(err => {

                    dataSync.exception(err);

                });

        });


        /**
         * Remove Perfil
         */
        self.delete('/perfis/:id(\\d+)', Auth.authenticate, (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let user = request.user;

            ///////////////////////////////////////////////////////////////////////
            // Apenas altera Perfis da conta atual
            ///////////////////////////////////////////////////////////////////////

            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral && !user.conta,
                        msg: "Você deve estar associado a uma conta"
                    },
                    {
                        // Para editar perfil ou é administrador Geral ou é Administrador da Conta e tem perfil gerenciador
                        test: !user.administradorGeral && (!user.administradorConta || !user.hasPerm('administrador__perfil_gerenciar')),
                        msg: "Você não tem permissão para remover Perfis"
                    }
                ])) {

                return;
            }


            ///////////////////////////////////////////////////////////////////////
            // Apenas altera usuários da conta atual
            ///////////////////////////////////////////////////////////////////////
            let perfil = new PerfilModel(id);

            if (!request.user.administradorGeral) {

                // Define restrições
                perfil.setCondition({
                    where: {
                        "perfil.conta_id": user.conta
                    }
                });

            }


            perfil
                .setId(id)
                .then(function () {

                    return perfil.delete();

                })
                .then(function (totalRemoved) {

                    if (totalRemoved > 0) {

                        // TODO: Existe o HttpStatusCode 205 q é retorno sem conteudo
                        dataSync.send(true)
                    }else{

                        dataSync.sendError("Não foi possível remover o perfil");
                    }

                })
                .catch(err => {

                    dataSync.exception(err);

                });

        });


        /**
         * Retorna Schema do Perfil
         */
        self.get('/perfis/schema', Auth.authenticate, function (request, response) {

            let dataSync = new DataSync(response);

            if (request.user.administradorGeral) {

                dataSync.send(PerfilModel.getSchema('default'));



            } else {

                dataSync.send(PerfilModel.getSchema('usuario'));


            }


        });

    }


}

module.exports = PerfilController;
