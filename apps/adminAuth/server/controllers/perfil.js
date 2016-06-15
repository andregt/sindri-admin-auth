/**
 * Created by André Timermann on 10/06/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/controllers/perfil.js
 */
"use strict";

const Controller = require('sindri-framework/controller');
const DataSync = require('sindri-framework/lib/dataSync');
const PerfilModel = require('../models/perfil');

class PerfilController extends Controller {

    routes() {

        let self = this;

        /**
         * Retorna todos os Perfis
         */
        self.get('/perfis', (request, response) => {

            let dataSync = new DataSync(response);

            PerfilModel
                .getCollections(true)
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
        this.get('/perfis/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let usuario = new PerfilModel();

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
         * Salva novo Perfil
         */
        self.post('/perfis', function (request, response) {

            // Salva
            let usuario = new PerfilModel();
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
         * Atualiza Perfil
         */
        self.put('/perfis/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;


            let perfil = new PerfilModel(id);

            perfil
                .setData(request.body)

                .then(function () {

                    return perfil.save();

                })
                .then(function (result) {

                    self.sendModelResult(result, dataSync);

                })
                .catch(err => {

                    dataSync.exception(err);

                });

        });


        /**
         * Remove Perfil
         */
        self.delete('/perfis/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let perfil = new PerfilModel();

            perfil
                .setId(id)
                .then(function () {

                    return perfil.delete();

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
         * Retorna Schema do Perfil
         */
        self.get('/perfis/schema/:template?', function (request, response) {

            let dataSync = new DataSync(response);
            let template = request.params.template;

            dataSync.send(PerfilModel.getSchema(template));

        });

    }


}

module.exports = PerfilController;
