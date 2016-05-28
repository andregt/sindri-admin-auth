/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/controllers/conta.js
 */
"use strict";

const Controller = require('sindri-framework/controller');
const DataSync = require('sindri-framework/lib/dataSync');
const ContaModel = require('../models/conta');

class ContaController extends Controller {

    routes() {

        let self = this;

        /**
         * Retorna Todos as Contas
         *
         */
        this.get('/contas', (request, response) => {

            let dataSync = new DataSync(response);

            ContaModel
                .getCollections(undefined, undefined, true)
                .then((result) => {
                    dataSync.send(result);
                })
                .catch((err) => {
                    dataSync.exception(err);

                });

        });

        /**
         * Retorna Todos as Contas
         * Aceita apenas id, ref:
         * https://github.com/pillarjs/path-to-regexp#custom-match-parameters
         *
         */
        this.get('/contas/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let conta = new ContaModel();

            conta
                .setId(id)
                .then(function () {

                    return conta.getData()

                })
                .then((result) => {

                    dataSync.send(result);

                })
                .catch((err) => {

                    dataSync.exception(err);

                });

        });

        /**
         * Grava novo Registro
         *
         */
        this.post('/contas', function (request, response) {

            // Salva
            let conta = new ContaModel();
            let dataSync = new DataSync(response);

            conta
                .setData(request.body)
                .then(() => {

                    return conta.save();

                })
                .then(function (result) {

                    self.sendModelResult(result, dataSync);

                })
                .catch((err) => {

                    dataSync.exception(err);

                });


        });


        /**
         * Atualiza Registro
         * Aceita apenas id, ref:
         * https://github.com/pillarjs/path-to-regexp#custom-match-parameters
         *
         */
        this.put('/contas/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let conta = new ContaModel();

            conta
                .setId(id)
                .then(function () {

                    return conta.setData(request.body)

                })
                .then(function () {

                    return conta.save();

                })
                .then(function (result) {

                    self.sendModelResult(result, dataSync);

                })
                .catch(err => {

                    dataSync.exception(err);

                });

        });

        /**
         * TODO: Estudar o DELETE para muitos registros (verifica se é possível "postar" um json com lista de itens) ou se (vai precisar usar POST mesmo)
         *
         *
         * Remove Registro
         * Aceita apenas id, ref:
         * https://github.com/pillarjs/path-to-regexp#custom-match-parameters
         *
         */
        this.delete('/contas/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let conta = new ContaModel();

            conta
                .setId(id)
                .then(function () {

                    return conta.delete();

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
         * Retorna Informação do Formulário para ser processado pelo Cliente
         */
        this.get('/contas/schema/:template?', function (request, response) {

            let dataSync = new DataSync(response);
            let template = request.params.template;

            dataSync.send(ContaModel.getSchema(template));

        });

    }


}

module.exports = ContaController;
