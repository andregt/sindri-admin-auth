/**
 * Created by André Timermann on 09/05/16.
 *
 * sindri-admin-auth/apps/adminAuth/server/controllers/conta.js
 *
 * Permissões:
 *  | Permissão                               | Descrição                                                                                       |
 *  |-----------------------------------------|-------------------------------------------------------------------------------------------------|
 *  | administrador__usuario_visualizar       | Permissão para visualizar usuários                                                              |
 *  | administrador__usuario_criar            | Permissão para criar novos usuários                                                             |
 *  | administrador__usuario_gerenciar        | Permissão para gerenciar usuários (alterar usuários existentes, exceto administrador da conta)  |
 *  | administrador__usuario_excluir          | Permissão para excluir usuário (exceto administrador da conta)                                  |
 *  | administrador__usuario_alterar_senha    | Permissão para alterar sua própria senha                                                        |
 *  | administrador__usuario_gerenciar_senhas | Permissão para gerenciar senha de outros usuários (exceto sua própria e administrador da conta) |
 *  | administrador__usuario_gerenciar_perfis | Permissão de alterar perfil (exceto seu próprio perfil e do administrador da conta)             |
 *  |-----------------------------------------|-------------------------------------------------------------------------------------------------|
 *
 *  - O Usuário só podem alterar perfis de outros usuários para perfis que ele também tenha
 *  - Usuário não pode alterar status (ativo/inativo) do usuario logado e não pode alterar perfil do usuario logado (consigo mesmo)
 *  - Usuário comum não pode visualizar/alterar/remover adminConta ou adminusuario
 *
 *  - Só serão carregados usuários da conta logada, exceto se for o adminstrador geral do sistema
 *
 *
 */
"use strict";

const Controller = require('sindri-framework/controller');
const DataSync = require('sindri-framework/lib/dataSync');
const UsuarioModel = require('../models/usuario');
const Auth = require('sindri-auth/auth');

class UsuarioController extends Controller {

    routes() {

        let self = this;

        /**
         * Retorna Usuário Especifico
         *
         */
        self.get('/usuarios', Auth.authenticate, function (request, response) {


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
                    },
                    {
                        test: !user.administradorGeral && !user.hasPerm('administrador__usuario_visualizar'),
                        msg: "Você não tem permissão para visualizar usuários"
                    }
                ])) {

                return;
            }

            ///////////////////////////////////////////////////////////////////////
            // Apenas carrega usuários da conta atual
            ///////////////////////////////////////////////////////////////////////

            if (!request.user.administradorGeral) {

                if (request.user.administradorConta) {

                    // Define restrições
                    conditions = {
                        where: {
                            "usuario.conta_id": user.conta,
                            "usuario.administradorGeral": false
                        }
                    };

                } else {

                    // Define restrições
                    conditions = {
                        where: {
                            "usuario.conta_id": user.conta,
                            "usuario.administradorGeral": false,
                            "usuario.administradorConta": false
                        }
                    };

                }

            }

            ///////////////////////////////////////////////////////////////////////
            // Consulta
            ///////////////////////////////////////////////////////////////////////

            UsuarioModel
                .getCollections(true, conditions)
                .then((result) => dataSync.send(result))
                .catch((err) => self.sendError(err, dataSync));


        });

        /**
         * Retorna um único usuário
         * Aceita apenas id, ref:
         * https://github.com/pillarjs/path-to-regexp#custom-match-parameters
         *
         */
        self.get('/usuarios/:id(\\d+)', Auth.authenticate, function (request, response) {


            let dataSync = new DataSync(response);

            let id = request.params.id;

            let user = request.user;

            let usuario = new UsuarioModel();


            ///////////////////////////////////////////////////////////////////////
            // Validação de Permissões
            ///////////////////////////////////////////////////////////////////////

            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral && !user.conta,
                        msg: "Você deve estar associado a uma conta"
                    },
                    {
                        test: !user.administradorGeral && !user.hasPerm('administrador__usuario_visualizar'),
                        msg: "Você não tem permissão para visualizar usuários"
                    }
                ])) {

                return;
            }


            ///////////////////////////////////////////////////////////////////////
            // Apenas carrega usuários da conta atual
            ///////////////////////////////////////////////////////////////////////

            if (!request.user.administradorGeral) {


                if (request.user.administradorConta) {
                    // Define restrições
                    usuario.setCondition({
                        where: {
                            "usuario.conta_id": user.conta,
                            "usuario.administradorGeral": false
                        }
                    });
                } else {
                    // Define restrições
                    usuario.setCondition({
                        where: {
                            "usuario.conta_id": user.conta,
                            "usuario.administradorGeral": false,
                            "usuario.administradorConta": false
                        }
                    });
                }

            }


            usuario
                .setId(id)
                .then(() => usuario.getData(true, true))
                .then((result) => dataSync.send(result))
                .catch((err) => self.sendError(err, dataSync));


        });

        /**
         * Grava novo Usuário
         *
         */
        self.post('/usuarios', Auth.authenticate, function (request, response) {


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
                            test: !user.administradorGeral && !user.hasPerm('administrador__usuario_criar'),
                            msg: "Você não tem permissão para criar usuários"
                        },
                        {
                            test: !user.administradorGeral && request.body.administradorGeral !== undefined,
                            msg: "Você não tem permissão para alterar administradorGeral"
                        },
                        {
                            test: !user.administradorGeral && request.body.conta !== undefined,
                            msg: "Você não tem permissão para alterar conta"
                        },

                        {
                            test: !user.administradorGeral && !user.administradorConta && request.body.administradorConta !== undefined,
                            msg: "Você não tem permissão para alterar administradorConta"
                        },
                        {
                            test: !user.administradorGeral && !user.administradorConta && request.body.alterarSenha !== undefined,
                            msg: "Você não tem permissão para alterar alterarSenha"
                        },
                        {
                            test: !user.administradorGeral && !user.hasPerm('administrador__usuario_gerenciar_perfis') && request.body.perfis !== undefined,
                            msg: "Você não tem permissão para definir perfis"
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
                let usuario = new UsuarioModel();

                usuario
                    .setData(request.body)
                    .then(() => usuario.save())
                    .then((result) => self.sendModelResult(result, dataSync, false))
                    .catch((err) => self.sendError(err, dataSync));

            }
        );


        /**
         * Atualiza Registro
         * Aceita apenas id, ref:
         * https://github.com/pillarjs/path-to-regexp#custom-match-parameters
         *
         */
        self.put('/usuarios/:id(\\d+)', Auth.authenticate, (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let usuario = new UsuarioModel(parseInt(id));

            let user = request.user;

            ///////////////////////////////////////////////////////////////////////
            // Apenas altera usuários da conta atual
            ///////////////////////////////////////////////////////////////////////

            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral && !user.conta,
                        msg: "Você deve estar associado a uma conta"
                    },
                    {
                        test: !user.administradorGeral && !user.hasPerm('administrador__usuario_gerenciar'),
                        msg: "Você não tem permissão para gerenciar usuários"
                    },
                    {
                        test: !user.administradorGeral && request.body.administradorGeral !== undefined,
                        msg: "Você não tem permissão para alterar administradorGeral"
                    },
                    {
                        test: !user.administradorGeral && request.body.conta !== undefined,
                        msg: "Você não tem permissão para alterar conta"
                    },
                    {
                        test: !user.administradorGeral && !user.administradorConta && request.body.administradorConta !== undefined,
                        msg: "Você não tem permissão para alterar administradorConta"
                    },
                    {
                        test: !user.administradorGeral && !user.administradorConta && request.body.alterarSenha !== undefined,
                        msg: "Você não tem permissão para alterar alterarSenha"
                    },
                    {
                        test: !user.administradorGeral && (String(user.id) == String(id)) && request.body.ativo !== undefined,
                        msg: "Você não tem permissão para alterar ativo"
                    },
                    {
                        test: !user.administradorGeral && (String(user.id) == String(id)) && request.body.perfis !== undefined,
                        msg: "Você não tem permissão para alterar perfis"
                    },
                    {
                        test: !user.administradorGeral && (String(user.id) == String(id)) && !user.hasPerm('administrador__usuario_alterar_senha') && request.body.senha !== undefined,
                        msg: "Você não tem permissão para alterar sua senha"
                    },
                    {
                        test: !user.administradorGeral && (String(user.id) != String(id)) && !user.hasPerm('administrador__usuario_gerenciar_senhas') && request.body.senha !== undefined,
                        msg: "Você não tem permissão para alterar senha"
                    },
                    {
                        test: !user.administradorGeral && !user.hasPerm('administrador__usuario_gerenciar_perfis') && request.body.perfis !== undefined,
                        msg: "Você não tem permissão para alterar perfis"
                    }
                ])) {

                return;
            }


            ///////////////////////////////////////////////////////////////////////
            // Apenas altera usuários da conta atual
            ///////////////////////////////////////////////////////////////////////
            if (!request.user.administradorGeral) {
                if (request.user.administradorConta) {
                    // Define restrições
                    usuario.setCondition({
                        where: {
                            "usuario.conta_id": user.conta,
                            "usuario.administradorGeral": false
                        }
                    });
                } else {
                    // Define restrições
                    usuario.setCondition({
                        where: {
                            "usuario.conta_id": user.conta,
                            "usuario.administradorGeral": false,
                            "usuario.administradorConta": false
                        }
                    });
                }

            }

            ///////////////////////////////////////////////////////////////////////
            // Atualiza Registro
            ///////////////////////////////////////////////////////////////////////
            usuario
                .setData(request.body)
                .then(() => usuario.save())
                .then((result) => self.sendModelResult(result, dataSync, false))
                .catch(err => self.sendError(err, dataSync));


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
        self.delete('/usuarios/:id(\\d+)', Auth.authenticate, (request, response) => {

            let dataSync = new DataSync(response);

            let id = request.params.id;

            let user = request.user;

            let usuario = new UsuarioModel();


            ///////////////////////////////////////////////////////////////////////
            // Apenas altera usuários da conta atual
            ///////////////////////////////////////////////////////////////////////

            if (self.forbidden(dataSync, [
                    {
                        test: !user.administradorGeral && !user.conta,
                        msg: "Você deve estar associado a uma conta"
                    },
                    {
                        test: !user.administradorGeral && !user.hasPerm('administrador__usuario_excluir'),
                        msg: "Você não tem permissão para excluir usuários"
                    }
                ])) {

                return;
            }

            ///////////////////////////////////////////////////////////////////////
            // Apenas altera usuários da conta atual
            ///////////////////////////////////////////////////////////////////////
            if (!request.user.administradorGeral) {
                if (request.user.administradorConta) {
                    // Define restrições
                    usuario.setCondition({
                        where: {
                            "usuario.conta_id": user.conta,
                            "usuario.administradorGeral": false
                        }
                    });
                } else {
                    // Define restrições
                    usuario.setCondition({
                        where: {
                            "usuario.conta_id": user.conta,
                            "usuario.administradorGeral": false,
                            "usuario.administradorConta": false
                        }
                    });
                }

            }


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

                    self.sendError(err, dataSync);

                });

        });


        /**
         * Retorna Informação do Formulário para ser processado pelo Cliente
         */
        self.get('/usuarios/schema', Auth.authenticate, function (request, response) {

            let dataSync = new DataSync(response);

            let user = request.user;

            if (request.user.administradorGeral) {

                dataSync.send(UsuarioModel.getSchema('default'));

            } else if (request.user.administradorConta) {

                let schema = UsuarioModel.getSchema('conta');

                // Configuraça Exibição de campos
                self.configPermission(schema, user);

                dataSync.send(schema);

            } else {

                let schema = UsuarioModel.getSchema('usuario');

                self.configPermission(schema, user);

                dataSync.send(schema);

            }


        });

    }

    /**
     * Configura Exibição de campos
     *
     * @param schema
     * @param user
     */
    configPermission(schema, user) {


        // Ativo
        schema.ativo.removeFieldWhenIdEqual = user.id;

        // Remove Campo de Perfil quando não tiver permissão
        if (!user.hasPerm('administrador__usuario_gerenciar_perfis')) {
            delete schema.perfis;
        } else {
            // Desbilita Perfis quando for usuario logado
            schema.perfis.removeFieldWhenIdEqual = user.id;
        }

        if (!user.hasPerm('administrador__usuario_alterar_senha')) {
            // Desbilita senha quando for usuario logado
            schema.senha.removeFieldWhenIdEqual = user.id
        }

        if (!user.hasPerm('administrador__usuario_gerenciar_senhas')) {
            // Desabilita senha quando não for usuario logado
            schema.senha.removeFieldWhenIdDiff = user.id;

        }


    }


}

module.exports = UsuarioController;
