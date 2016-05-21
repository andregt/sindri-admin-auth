create table `conta` (`conta_id` int unsigned not null auto_increment primary key, `nome` VARCHAR (255) not null default '', `email` VARCHAR (255) not null default '', `cpfCnpj` VARCHAR (15) not null default '', `tipoCadastro` BIT (1) not null comment '0 -> Pessoa Física 1 -> Pessoa Jurídica', `endereco` VARCHAR (255) not null default '', `numero` VARCHAR (15) not null default '', `complemento` VARCHAR (15) not null default '', `cep` VARCHAR (15) not null default '', `bairro` VARCHAR (255) not null default '', `telefone` VARCHAR (32) not null default '', `celular` VARCHAR (32) not null default '', `municipio` VARCHAR (255) not null default '', `estado` VARCHAR (255) not null default '', `pais` VARCHAR (255) not null default '', `rg` VARCHAR (15) not null default '', `inscricaoEstadual` VARCHAR (15) not null default '', `sexo` CHAR (1) not null default '' comment 'M -> Masculino F -> Feminino', `dataNascimento` DATE null, `dataCadastro` TIMESTAMP not null default CURRENT_TIMESTAMP, `ativo` BIT (1) not null default 1 comment '1 -> Ativo 0 -> Inativo', `removido` BIT (1) null default 0 comment '0 -> Não Removido 1 -> Removido');
alter table `conta` add unique idx_conta_email(`email`);
alter table `conta` add unique idx_conta_cpfCnpj(`cpfCnpj`);
alter table `conta` add unique idx_conta_rg(`rg`);
alter table `conta` add unique idx_conta_inscricaoEstadual(`inscricaoEstadual`) ;

create table `usuario` (`usuario_id` int unsigned not null auto_increment primary key, `conta_id` int unsigned null, `usuario` VARCHAR (255) not null comment 'Pode ser nulo quando acesso via facebook ou outros', `senha` TEXT (1024), `administradorConta` BIT (1) not null default 0 comment 'Tem todos os acessos para a conta que pertence  0 -> Não 1 -> Sim', `administradorGeral` BIT (1) not null default 0 comment 'Administrador Geral do sistema (tem acesso a todos os dados, independente da conta)  0 -> Não 1 -> Sim', `nome` VARCHAR (255) not null default '' comment 'Nome do Usuario', `email` VARCHAR (255) not null default '', `imagem` VARCHAR (255) not null default '' comment 'Imagem ou foto do usuário no sistema', `dataCadastro` TIMESTAMP not null default CURRENT_TIMESTAMP, `ativo` BIT (1) null default 1 comment '1 -> Ativo 0 -> Inativo', `removido` BIT (1) not null default 0 comment '0 -> Não Removido 1 -> Removido', `expiracaoSenha` DATETIME null, `alterarSenha` BIT (1) not null default 0 comment '0 -> Não pede para alterar senha 1 -> Pede para alterar senha, próximo logon', `token` TEXT (1024) comment 'Token de autenticação');
alter table `usuario` add unique idx_usuario_usuario(`usuario`);
alter table `usuario` add unique idx_usuario_email(`email`) ;

create table `perfil` (`perfil_id` int unsigned not null auto_increment primary key, `conta_id` int unsigned null comment 'Perfil pode ser global ou pertencer a uma conta, se null é global ou chave estrangeira para conta', `nome` VARCHAR (64) not null, `descricao` VARCHAR (512) not null default '' comment 'Descrição do perfil', `ativo` BIT (1) not null default 1 comment '0 -> Inativo 1 -> Ativo', `removido` BIT (1) not null default 0 comment '0 -> Não removido 1 -> Removido') ;

create table `permissao` (`permissao_id` int unsigned not null auto_increment primary key, `permissao` VARCHAR (128) not null comment 'Nome da permissão, (Nome no sistema) ', `titulo` VARCHAR (63) not null comment 'Nome Amigável da permissão, que será exibido para o usuário', `descricao` VARCHAR (512) not null default '' comment 'Descritivo da permissão', `ativo` BIT (1) not null default 1 comment '0 -> Inativo 1 -> Ativo', `categoria` VARCHAR (64) not null default '' comment 'Categoria da permissão, para melhor organizão para o usuário');
alter table `permissao` add unique idx_permissao_permissao(`permissao`) ;

create table `menu` (`menu_id` int unsigned not null auto_increment primary key, `nome` VARCHAR (64) not null comment 'Nome do Menu, usado internamente pelo sistema', `titulo` VARCHAR (64) not null comment 'Título do menu', `descricao` VARCHAR (512) not null default '', `menuPai` int unsigned null comment 'Aponta para um menu superior (hierarquia)', `target` VARCHAR (1024) not null default '' comment 'Destino do menu, podendo ser uma url, uma rota ou outro valor usado para ativar o menu', `ordem` SMALLINT not null default 0 comment 'Ordem de exibição', `icone` VARCHAR (32) not null default '' comment 'Nome do ícone que será exibido no menu', `contador` SMALLINT not null default 0 comment 'Contador que será exibido no menu 0 Para sem pendência (não exibe nada)', `alerta` BIT (1) not null default 0 comment '0 -> Sem icone de alerta 1 -> Icone de alerta indicando que este item merece atenção', `ativo` BIT (1) not null default 1);
alter table `menu` add unique idx_menu_nome(`nome`) ;

create table `usuario__perfil` (`usuario__perfil_id` int unsigned not null auto_increment primary key, `perfil_id` int unsigned not null, `usuario_id` int unsigned not null);
alter table `usuario__perfil` add unique idx_usuario__perfil(`perfil_id`, `usuario_id`) ;

create table `perfil__permissao` (`perfil__permissao_id` int unsigned not null auto_increment primary key, `perfil_id` int unsigned not null, `permissao_id` int unsigned not null);
alter table `perfil__permissao` add unique idx_perfil__permissao(`perfil_id`, `permissao_id`) ;

create table `permissao__menu` (`permissao__menu_id` int unsigned not null auto_increment primary key, `permissao_id` int unsigned not null, `menu_id` int unsigned not null);
alter table `permissao__menu` add unique idx_permissao__menu(`permissao_id`, `menu_id`) ;

alter table `usuario` add constraint fk_conta___usuario foreign key (`conta_id`) references `conta` (`conta_id`) ;

alter table `perfil` add constraint fk_conta___perfil foreign key (`conta_id`) references `conta` (`conta_id`) ;

alter table `menu` add constraint fk_menu___menu foreign key (`menuPai`) references `menu` (`menu_id`) ;

alter table `usuario__perfil` add constraint fk_usuario___usuario__perfil foreign key (`usuario_id`) references `usuario` (`usuario_id`) on delete CASCADE; ;

alter table `usuario__perfil` add constraint fk_perfil___usuario__perfil foreign key (`perfil_id`) references `perfil` (`perfil_id`) on delete CASCADE ;

alter table `perfil__permissao` add constraint fk_perfil___perfil__permissao foreign key (`perfil_id`) references `perfil` (`perfil_id`) on delete CASCADE; ;

alter table `perfil__permissao` add constraint fk_permissao___perfil__permissao foreign key (`permissao_id`) references `permissao` (`permissao_id`) on delete CASCADE ;

alter table `permissao__menu` add constraint fk_permissao___permissao__menu foreign key (`permissao_id`) references `permissao` (`permissao_id`) on delete CASCADE; ;

alter table `permissao__menu` add constraint fk_menu___permissao__menu foreign key (`menu_id`) references `menu` (`menu_id`) on delete CASCADE ;