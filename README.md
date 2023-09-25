# PRIMEIRA API COM NODEJS
### _Curso de Formação NodeJS da Udemy_

## Endpoints
### GET /games
Este endpoint lista todos os games cadastrados no banco de dados.
#### Parâmetros
Nenhum
#### Respostas
##### OK 200
Resposta para a listagem.
##### 401 Falha na autenticação
Houve falha no processo de autenticação. 

###### Exemplo de resposta bem-sucedida
```
[
    {
        "id": 7,
        "titulo": "GTA 5",
        "ano": 2012,
        "preco": 99.99,
        "createdAt": "2023-09-24T16:22:31.000Z",
        "updatedAt": "2023-09-24T16:23:34.000Z"
    },
    {
        "id": 8,
        "titulo": "Medal of Honor",
        "ano": 2008,
        "preco": 56.78,
        "createdAt": "2023-09-24T16:23:05.000Z",
        "updatedAt": "2023-09-24T16:23:05.000Z"
    }
]
```


### Passo a passo de instalação dos pacotes
```sh
npm init
npm install express --save     (usado para trabalhar com rotas)
npm install nodemon -g         (facilita rodar a aplicação, atualizando automaticamente)
npm install body-parser --save (usado para receber parâmetros de formulários)
npm install sequelize --save   (biblioteca usanda para trabalharcom mysql, postgre, mariaDB, SQLite e Microsoft SQL)
npm install mysql2 --save      (permite a sequelize trabalhar com mysql)
npm install jsonwebtoken --save (biblioteca gerada para criação do bearer token de autenticação)
```