/**
 * Created by André Timermann on 10/06/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/controllers/menu.js
 */
"use strict";

const Controller = require('sindri-framework/controller');
const DataSync = require('sindri-framework/lib/dataSync');
const MenuModel = require('../models/menu');

class MenuController extends Controller {

    routes() {

        let self = this;

        /**
         */
        self.get('/menu', (request, response) => {

            let dataSync = new DataSync(response);

            MenuModel
                .getCollections(true)
                .then((result) => {
                    dataSync.send(result);
                })
                .catch((err) => {
                    dataSync.exception(err);
                });

        });


        /**
         * Retorna um unico menu
         */
        this.get('/menu/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let usuario = new MenuModel();

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
         * Salva novo Menu
         */
        self.post('/menu', function (request, response) {

            // Salva
            let usuario = new MenuModel();
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
         * Atualiza Menu
         */
        self.put('/menu/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;


            let menu = new MenuModel(id);

            menu
                .setData(request.body)

                .then(function () {

                    return menu.save();

                })
                .then(function (result) {

                    self.sendModelResult(result, dataSync);

                })
                .catch(err => {

                    dataSync.exception(err);

                });

        });


        /**
         * Remove Menu
         */
        self.delete('/menu/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let menu = new MenuModel();

            menu
                .setId(id)
                .then(function () {

                    return menu.delete();

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
         * Retorna Schema do Menu
         */
        self.get('/menu/schema/:template?', function (request, response) {

            let dataSync = new DataSync(response);
            let template = request.params.template;

            dataSync.send(MenuModel.getSchema(template));

        });

    }


}

module.exports = MenuController;
