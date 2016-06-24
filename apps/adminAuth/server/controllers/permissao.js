/**
 * Created by André Timermann on 10/06/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/controllers/permissao.js
 *
 * Somente Admin pode acessar Permissões, portanto não existe permissão para permissão
 *
 * - Só carrega permissões que o usuario logado tem
 *
 */
"use strict";

const Controller = require('sindri-framework/controller');
const DataSync = require('sindri-framework/lib/dataSync');
const PermissaoModel = require('../models/permissao');
const Auth = require('sindri-auth/auth');

class PermissaoController extends Controller {

    routes() {

        let self = this;

        /**
         * Retorna todos os Permissao
         */
        self.get('/permissoes', Auth.authenticate, (request, response) => {

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
            // Apenas Carrega Permissões que o usuário tem acesso
            ///////////////////////////////////////////////////////////////////////

            if (!request.user.administradorGeral) {

                // Define restrições
                conditions = {
                    whereIn: ["permissao.permissao", user.permissions]
                };


            }


            PermissaoModel
                .getCollections(true, conditions)
                .then((result) => {
                    dataSync.send(result);
                })
                .catch((err) => {
                    dataSync.exception(err);
                });

        });


        /**
         * Retorna uma unico permissao
         */
        this.get('/permissoes/:id(\\d+)', Auth.authenticate, (request, response) => {

            let dataSync = new DataSync(response);
            let user = request.user;

            let id = request.params.id;

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
            // Apenas Carrega Permissões que o usuário tem acesso
            ///////////////////////////////////////////////////////////////////////

            let permissao = new PermissaoModel();

            if (!request.user.administradorGeral) {

                // Define restrições
                permissao.setCondition({
                    whereIn: ["permissao.permissao", user.permissions]
                });

            }


            permissao
                .setId(id)
                .then(function () {
                    return permissao.getData(true, true)
                })
                .then((result) => {
                    dataSync.send(result);
                })
                .catch((err) => {
                    dataSync.exception(err);
                });

        });

        /**
         * Salva novo Permissao
         */
        self.post('/permissoes', Auth.authenticate, function (request, response) {

            // Salva
            let usuario = new PermissaoModel();
            let dataSync = new DataSync(response);

            ///////////////////////////////////////////////////////////////////////
            // Validação de Permissões
            ///////////////////////////////////////////////////////////////////////
            let user = request.user;
            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral,
                        msg: "Você não tem Permissão para Criar Permissão"
                    }

                ])) {

                return;
            }

            ///////////////////////////////////////////////////////////////////////
            // Persiste na Base
            ///////////////////////////////////////////////////////////////////////

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
         * Atualiza Permissao
         */
        self.put('/permissoes/:id(\\d+)', Auth.authenticate, (request, response) => {

            let dataSync = new DataSync(response);

            ///////////////////////////////////////////////////////////////////////
            // Validação de Permissões
            ///////////////////////////////////////////////////////////////////////
            let user = request.user;

            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral,
                        msg: "Você não tem Permissão para Alterar Permissão"
                    }

                ])) {

                return;
            }

            ///////////////////////////////////////////////////////////////////////
            // Persiste na Base
            ///////////////////////////////////////////////////////////////////////


            let id = request.params.id;

            let permissao = new PermissaoModel(id);

            permissao
                .setData(request.body)

                .then(function () {

                    return permissao.save();

                })
                .then(function (result) {

                    self.sendModelResult(result, dataSync, false);

                })
                .catch(err => {

                    dataSync.exception(err);

                });

        });


        /**
         * Remove Permissao
         */
        self.delete('/permissoes/:id(\\d+)', Auth.authenticate, (request, response) => {

            let dataSync = new DataSync(response);

            ///////////////////////////////////////////////////////////////////////
            // Validação de Permissões
            ///////////////////////////////////////////////////////////////////////
            let user = request.user;
            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral,
                        msg: "Você não tem Permissão para remover Permissões"
                    }

                ])) {

                return;
            }

            ///////////////////////////////////////////////////////////////////////
            // Persiste na Base
            ///////////////////////////////////////////////////////////////////////

            let id = request.params.id;

            let permissao = new PermissaoModel();

            permissao
                .setId(id)
                .then(function () {

                    return permissao.delete();

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
         * Retorna Schema do Permissao
         */
        self.get('/permissoes/schema/:template?', Auth.authenticate, function (request, response) {

            let dataSync = new DataSync(response);
            let template = request.params.template;

            dataSync.send(PermissaoModel.getSchema(template));

        });

    }


}

module.exports = PermissaoController;
