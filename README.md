

<h1 align="center">
     🚧 <a href="#" alt="site do ecoleta"> Cashbackzada </a> 🚧
</h1>

<h3 align="center">
    🚀 Plataforma para cadastro de revendedores, produtos e promoções...💚
</h3>

<h4 align="center">
	🚧 O desafio falava de fazer um front-end, porém como não fornecia uma api para o projeto, decidi dedicar o tempo para fazer o front e uma parte para o back-end, o que faz sentido para vaga que estou aplicando =) .  
  Foram cerca de 14 horas de trabalho para construção de toda plataforma,enviado o teste no dia seguinte do recebimento, tentei realizar todos requisitos tanto no front quanto no back e deixar uma lista de proximos passos ... 🚧
</h4>

---

## 💻 Sobre o projeto

💡 Cashbackzada - Boticário quer disponibilizar um sistema para seus revendedores(as) cadastrarem suas compras e acompanhar o retorno de cashback de cada um.


---

## ⚙️ Funcionalidades

- [x] Front end; 
  - [x] login para informar e-mail e senha; 
  - [x] cadastro de um novo revendedor(a) solicitando Nome completo, CPF, e- mail e senha
  - [x] cadastro de compras onde deverá ser informado o código, valor ,descrição e nome
  - [x] listagem das compras cadastradas exibindo as informações  
  - [x] Design responsivo
  - [x] Uso de localstore e cookie para session com jwt
  - [x] Consumo de api 

- [x] Backend usando NodeJs e Express:
  - [x] API usando logger com morgan
  - [x] Testes usando jest
  - [x] Knex para realizar migrations e seeds no SQLITE
  - [x] uso de dotenv
  - [x] criação de um jwt para auth
  - [x] Uso do docker
  - [x] http com REST requests para rodar no vscode usando o pacote Rest Client - facilita o entendimento das rotas do back
  - [x] Adicionado um serviço de envio de email no cadastro, porém necessário configuração de produção


---

## 👨‍💻  TO-DO - ROADMAP

Pelo tempo reduzido para o desafio, ficou uma lista de tarefas a se realizar mapeadas para melhoria já num roadmap, que deixaria a plataforma ainda melhor e completa:

- BACKEND; 
  - [ ] separar lógica dos controllers para camada de service, foi iniciado porém não finalizado; 
  - [ ] adicionar um middleware de rateLimit para adicionar uma camada de segurança contra ataque DDos e requisições abusivas
  - [ ] adicionar controller de cashback e service de calculo
  - [ ] Terminar o swagger para documentação da api
  - [ ] Implementar banco de cache como Redis, para melhor gerenciamento de requisição

- FRONTEND; 
  - [ ] adicionar coberturar de teste com jest e react testing library; 
  - [ ] adicionar dados dinamicos na table de cashback - facilmente implementada com material ui.
  - [ ] ativar funcionalidade de mudança de status das requisições de novos produtos
  - [ ] criar componentes reutilizáveis 


### Observações

- Foi criado um dockercompose para colocar a aplicação em container, porém foi verificado que tem uma alta demora para subir o frontend e suas dependencias, cerca de 400 segundos. Isso faz com que, o serviço da porta do container usando docker suba mais rapído do que as dependencias necessária para o react rodar e entrar na porta usando yarn.
Caso opte o uso com docker, aguarde um tempo pois a porta 3000 subirá apesar da demora, beba um cafézin e acompanhe pelo logg do docker. NESSE PROJETO ESPECIFICAMENTE A PRIMEIRA SUBIDA COMPLETA NO CONTAINER...

- https://github.com/yarnpkg/yarn/issues/1496  (existe um issue aberta sobre o caso , é algo comum com uso do yarn pelo visto,com a desativação do antivirus se sugere uma pequena melhora no desempenho )

- Recomendo NPM para o back e Yarn para o Front caso rode de maneira individual, em docker ambos usam Yarn via script

- Se for subir individualmente certifique que já não tenha o nodemodules, se tiver apague.. se for subir o docker primeiro e depois individualmente, pare o docker e exclua o nodemodules e faça o processo individual. Isso evita conflitos de dependencias e cache.

- Historico de commit do github,o projeto foi feito todo numa "tacada" com pouco tempo para registrar o processo normal de um desenvolvimento...é melhor deixar com historico para acompanhamento do desenvolvimento e boas praticas de git.

- Para melhor entendimento das rotas, deixei um arquivo chamado http no backend. Dentro do roadmap sugiro a criação da documentação da api via SWAGGER ou criação de uma biblioteca de requisições de testes de do Postman. O arquivo env foi postado, porém não é uma boa pratica...recomendo em produção colocar em um path na azure ou aws, para n ambientes e n maquinas.

---

## 🚀 Como executar o projeto

Este projeto é divido em duas partes:
1. Backend - na localhost 3333 ou 4000
2. Frontend -  na localhost 3000

----

💡Pode ser levantando ambos usando docker, ou indivualmente. Aconselho o uso de yarn para ter menores chances de erro de dependencias, porém pode ser usando npm tambem.

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)
Docker instalado caso queira executar a aplicação no container.

Clone o repositório, utilizando **git clone** ou faça o **download** do repositório.

#### 🎲 Rodando o Backend individualmente (servidor)

```bash

# Clone este repositório
$ git clone git@github.com:santosrennan/cashbackzada.git

# Vá para a pasta server
$ cd backend

# Instale as dependências
$ npm install 

# Rode as migrations
$ npx knex migrate:latest

# Execute a aplicação em modo de desenvolvimento
$ npm start

# O servidor deve estar na porta:3333 ou 4000 - acesse http://localhost:3333 

```

#### 🧭 Rodando a aplicação web (Frontend) individualmente



```bash

# Clone este repositório
$ git clone git@github.com:santosrennan/cashbackzada.git

# Vá para a pasta da aplicação Front End
$ cd react-frontend

# Instale as dependências
$ yarn install

# Execute a aplicação em modo de desenvolvimento
$ yarn start

# A aplicação será aberta na porta:3000 - acesse http://localhost:3000

```

#### 🧭 Rodando via Dockercompose front e backend por container

💡 Olhe nas observações o primeiro item,ao rodar a primeira vez aguarde o tempo da carga das dependencias no container.

```bash

# Clone este repositório
$ git clone git@github.com:santosrennan/cashbackzada.git

# Vá para a pasta da aplicação onde está o dockercompose

# Execute a aplicação em modo de desenvolvimento
$ docker compose up -d

# A aplicação será aberta na porta:3000 para o front e 3333 para back --- Aguarde a instalação de dependencias pelo script do yarn install no frontend.. pode demorar um pouco como já falado anteriormente pelas depedencias do yarn .. cerca de 4 a 6 minutos e toda aplicação estará aberta no container

```

---

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

```
git, node, express, knex, axios, sqlite, reactjs, cors, dotenv, docker, morgan , entre outros...
```

---


## 📝 Licença

Este projeto esta sobe a licença [MIT](./LICENSE).

Feito por mim Rennan Santos 👋🏽 Problemas no projeto ? manda email rennandossantos1@gmail.com

---
