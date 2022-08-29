# Boas vindas ao repositório do Trybe Futebol Clube! ⚽
Este projeto foi desenvolvido por mim durante o bloco 28 no curso de Desenvolvimento Web Fullstack na Trybe.<br>


# Sobre o projeto 🔍

<details> 
<summary>Consiste em uma aplicação <strong>full stack</strong>, em que me foi entregue o front end e eu construí:</summary> <br>

📊 **Banco de dados:**
  - Relacional, construído através do SequelizeORM com migrations, models e seeders para cada entidade;

🔙 **Back-end:**
 - Construído seguindo modelo REST, tentando ao mámixo respeitar os preceitos de SOLID, sendo feito 100% em Typescript;
 
🐋 **Docker:**
 - Cada camada da aplicação (front, back e db) conta com um Dockerfile, além de orquestração docker para dar conta de subir tudo junto ao mesmo tempo;
 
🧪 **Testes:**
 - Por último mas não menos importante, a API conta com uma bateria de testes de intergração, cobrindo mais de 80% das linhas de código da aplicação!
 
 </details>
 
 
 # Orientações 🗺️
 ## Como rodar o projeto? 🙋
 <details>
 <summary>Requisitos mínimos</summary>
 Na sua máquina você deve ter:

 - Sistema Operacional Distribuição Unix
 - Node versão 16
 - Docker
 - Docker-compose versão >=1.29.2

➡️ O `node` deve ter versão igual ou superior à `16.15.0 LTS`:
  - Para instalar o nvm, [acesse esse link](https://github.com/nvm-sh/nvm#installing-and-updating);
  - Rode os comandos abaixo para instalar a versão correta de `node` e usá-la:
    - `nvm install 16 --lts`
    - `nvm use 16`
    - `nvm alias default 16`

➡️ O`docker-compose` deve ter versão igual ou superior à`ˆ1.29.2`:
  * Use esse [link de referência para realizar a instalação corretamente no ubuntu](https://app.betrybe.com/course/back-end/docker/orquestrando-containers-com-docker-compose/6e8afaef-566a-47f2-9246-d3700db7a56a/conteudo/0006a231-1a10-48a2-ac82-9e03e205a231/instalacao/abe40727-6310-4ad8-bde6-fd1e919dadc0?use_case=side_bar);
  * Acesse o [link da documentação oficial com passos para desinstalar] (https://docs.docker.com/compose/install/#uninstallation) caso necessário.
 </details>
 
 
 <details>
 <summary>Instalação</summary> <br>
 Clone o repositório https://github.com/alexandrel3mes/project-tfc <br>
 
 - Em sequida, vá até a pasta raiz do projeto e rode o comando `npm install` ou `npm i` para instalar as dependências do projeto
 - Ainda na pasta raiz, rode `npm run compose:up` para subir as orquestrações Docker
 
 Por padrão, o front end ocupa a porta 3000, o back end 3001 e o db 3002
 </details>
 
 <details>
  <summary>Hora de rodar!</summary> <br>
 
🚪**Front End:**
 - Acesse o caminho `http://localhost:3000/` no navegador que preferir;
 

🔙 **Back-end:**
 - Caso queira, é possível acessar no `http://localhost:3001/` através de algum cliente HTTP como Insomnia, Postman ou Thunder Client;
 
 
 📊 **Banco de dados:**
  - Possível acessar através do MySQL Workbench ou qualquer outro método de visualização de banco de dados;

 
🧪 **Testes:**
 - Com a aplicação em pé, basta rodar `npm test` na pasta raiz para rodar os testes de integração;
 </details>


<!-- Olá, Tryber!

Esse é apenas um arquivo inicial para o README do seu projeto.

É essencial que você preencha esse documento por conta própria, ok?

Não deixe de usar nossas dicas de escrita de README de projetos, e deixe sua criatividade brilhar!

⚠️ IMPORTANTE: você precisa deixar nítido:
- quais arquivos/pastas foram desenvolvidos por você; 
- quais arquivos/pastas foram desenvolvidos por outra pessoa estudante;
- quais arquivos/pastas foram desenvolvidos pela Trybe.

-->
