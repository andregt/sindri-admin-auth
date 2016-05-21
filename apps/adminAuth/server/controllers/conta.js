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
         * Grava novo Registro
         *
         */
        this.post('/contas', function(request, response){

            // Salva
            let conta = new ContaModel();
            let dataSync = new DataSync(response);

            conta
                .setData(request.body)
                .then(() => {

                    return conta.save();
                    
                })
                .then(function(result){


                    self.sendModelResult(result, dataSync);

                })
                .catch((err) => {
                    
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
