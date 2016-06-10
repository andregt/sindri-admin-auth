/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/controllers/conta.js
 */
"use strict";

const Controller = require('sindri-framework/controller');
const DataSync = require('sindri-framework/lib/dataSync');
const UsuarioModel = require('../models/usuario');

class UsuarioController extends Controller {

    routes() {

        let self = this;

        /**
         * Retorna Usuário Especifico
         *
         */
        this.get('/usuarios', (request, response) => {

            let dataSync = new DataSync(response);

            UsuarioModel
                .getCollections(true)
                .then((result) => {
                    dataSync.send(result);
                })
                .catch((err) => {
                    dataSync.exception(err);

                });

        });

        /**
         * Retorna Todos as Usuarios
         * Aceita apenas id, ref:
         * https://github.com/pillarjs/path-to-regexp#custom-match-parameters
         *
         */
        this.get('/usuarios/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let usuario = new UsuarioModel();

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
         * Grava novo Usuário
         *
         */
        this.post('/usuarios', function (request, response) {

            // Salva
            let usuario = new UsuarioModel();
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
         * Atualiza Registro
         * Aceita apenas id, ref:
         * https://github.com/pillarjs/path-to-regexp#custom-match-parameters
         *
         */
        this.put('/usuarios/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            // let usuario = new UsuarioModel();

            // usuario.getData(false, true).then(function(){
            //
            //     console.log(arguments)
            //
            //     usuario.save().then(function(result){
            //
            //         // self.sendModelResult(result, dataSync);
            //
            //         console.log(result);
            //
            //     }).catch(function(){
            //
            //         console.log(arguments)
            //
            //     })
            //
            //
            // });


            let usuario = new UsuarioModel(id);

            usuario
                .setData(request.body)

                .then(function () {

                    return usuario.save();

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
         * Remove Usuario
         *
         * Aceita apenas id, ref:
         * https://github.com/pillarjs/path-to-regexp#custom-match-parameters
         *
         */
        this.delete('/usuarios/:id(\\d+)', (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let usuario = new UsuarioModel();

            usuario
                .setId(id)
                .then(function () {

                    return usuario.delete();

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
        this.get('/usuarios/schema/:template?', function (request, response) {

            let dataSync = new DataSync(response);
            let template = request.params.template;

            dataSync.send(UsuarioModel.getSchema(template));

        });

    }


}

module.exports = UsuarioController;
