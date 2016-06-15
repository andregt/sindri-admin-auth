/**
 * Created by André Timermann on 10/06/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/controllers/permissao.js
 */
"use strict";

const Controller = require('sindri-framework/controller');
const DataSync = require('sindri-framework/lib/dataSync');
const PermissaoModel = require('../models/permissao');

class PermissaoController extends Controller {

    routes() {

        let self = this;

        /**
         * Retorna todos os Permissao
         */
        self.get('/permissoes', (request, response) => {

            let dataSync = new DataSync(response);

            PermissaoModel
                .getCollections(true)
                .then((result) => {
                    dataSync.send(result);
                })
                .catch((err) => {
                    dataSync.exception(err);
                });

        });


        /**
         * Retorna um unico permissao
         */
        this.get('/permissoes/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let usuario = new PermissaoModel();

            usuario
                .setId(id)
                .then(function () {

                    return usuario.getData(true, true)

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
        self.post('/permissoes', function (request, response) {

            // Salva
            let usuario = new PermissaoModel();
            let dataSync = new DataSync(response);

            usuario
                .setData(request.body)
                .then(() => {

                    return usuario.save();

                })
                .then(function (result) {

                    self.sendModelResult(result, dataSync);

                })
                .catch((err) => {

                    dataSync.exception(err);

                });


        });


        /**
         * Atualiza Permissao
         */
        self.put('/permissoes/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;


            let permissao = new PermissaoModel(id);

            permissao
                .setData(request.body)

                .then(function () {

                    return permissao.save();

                })
                .then(function (result) {

                    self.sendModelResult(result, dataSync);

                })
                .catch(err => {

                    dataSync.exception(err);

                });

        });


        /**
         * Remove Permissao
         */
        self.delete('/permissoes/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let permissao = new PermissaoModel();

            permissao
                .setId(id)
                .then(function () {

                    return permissao.delete();

                })
                .then(function () {

                    // TODO: Existe o HttpStatusCode 205 q é retorno sem conteudo
                    self.sendModelResult(true, dataSync);

                })
                .catch(err => {

                    dataSync.exception(err);

                });

        });


        /**
         * Retorna Schema do Permissao
         */
        self.get('/permissoes/schema/:template?', function (request, response) {

            let dataSync = new DataSync(response);
            let template = request.params.template;

            dataSync.send(PermissaoModel.getSchema(template));

        });

    }


}

module.exports = PermissaoController;
