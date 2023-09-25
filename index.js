const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Games = require("./database/games");
const Usuarios = require("./database/usuarios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const autenticar = require("./middlewares/autenticacao");

const secret = "adaskjlahdskjashd789a6dasjdhjkadshkady789a7dasd";

//ativando cors
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


connection.authenticate().then(() => {
    console.log('Conexão com o banco de dados estabelecida!');
}).catch((error) => {
    console.log(error);
});

//listando os games
app.get("/games", autenticar(secret), (req, res) => {

    var HATEOAS = [
        {
            href: "http://localhost/5000/game/0",
            method: "GET",
            rel: "get_game"
        },
        {
            ref: "http://localhost/5000/game/0",
            method: "DELETE",
            rel: "delete_game"
        },
        {   
            ref: "http://localhost/5000/auth",
            method: "POST",
            rel: "login"
        }
    ]


    //para acessar a variável do middleware autenticar
    console.log(req.logado);

    res.statusCode = 200;

    Games.findAll({
        order:[
            ['id', 'ASC']
        ]
    }).then(games => {
        res.json({
            games: games,
            links: HATEOAS
        });
    });

});

//buscando um game pelo id
app.get("/game/:id", autenticar(secret), (req, res) => {

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        var id = parseInt(req.params.id);

        var HATEOAS = [
            {
                ref: "http://localhost/5000/game/"+id,
                method: "DELETE",
                rel: "delete_game"
            },
            {
                ref: "http://localhost/5000/game/"+id,
                method: "PUT",
                rel: "edit_game"
            },
            {
                ref: "http://localhost/5000/games",
                method: "GET",
                rel: "delete_games"
            },
        ]


        Games.findOne({
            where: {
                id: id
            }
        }).then(game => {

            if(game != undefined){

                res.statusCode = 200;
                res.json({
                    game: game,
                    links: HATEOAS
                });

            /*
            res.json({
                id: game.id,
                titulo: game.titulo,
                ano: game.ano,
                preco: game.preco
            });
            */

            }else{
                res.sendStatus(404);
            }

        }).catch(() => {
            res.sendStatus(404);
        });

    }

});

//inserindo um game
app.post("/game", autenticar(secret), (req, res) => {

    var {titulo, ano, preco} = req.body;

    if(titulo == undefined){
        res.sendStatus(400);
    }else{

        Games.create({
            titulo: titulo,
            ano: ano,
            preco: preco
        }).then(() => {
            res.sendStatus(200);
        }).catch((erro) => {
            console.log(erro);
            res.sendStatus(400);
        });

    }

});

//excluindo um game
app.delete("/game/:id", autenticar(secret), (req, res) => {

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        var id = parseInt(req.params.id);

        Games.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.sendStatus(200);
        }).catch(() => {
            res.sendStatus(400);
        });

    }

});

app.put("/game/:id", autenticar(secret), (req, res) => {

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        var id = parseInt(req.params.id);

        var {titulo, ano, preco} = req.body;

        var game = {};

        if(titulo != undefined)
            if(titulo.length)
               game.titulo = titulo;
        
        if(ano != undefined) 
            if(ano.length)
               game.ano = ano;
        
        if(preco != undefined) 
            if(preco.length)
                game.preco = preco;

        Games.update(game,{
            where: {
                id: id
            }
        }).then(() => {
            res.sendStatus(200);
        }).catch(() => {
            res.sendStatus(400);
        });

    }

});

app.post("/auth", (req, res) => {

    var { login, senha } = req.body;

    if(login != undefined){

        if(login.length){

            Usuarios.findOne({
                where:{
                    login: login
                }
            }).then(usuario => {

                if(usuario != undefined){

                    if(usuario.senha == senha){

                        jwt.sign({id: usuario.id, email: usuario.email}, secret, { expiresIn: '1h' }, (erro, token) => {
                            if(erro){
                                res.statusCode = 400;
                                res.json({erro: "Falha na geração do token!"})
                            }else{
                                res.statusCode = 200;
                                res.json({token: token});
                            }
                        });

                    }else{
                        res.statusCode = 401;
                        res.json({erro: "Senha incorreta!"});
                    }

                }else{
                    res.statusCode = 404;
                    res.json({erro: "Usuário não encontrado!"});
                }

            }).catch(error => {
                res.statusCode = 404;
                res.json({erro: "Não foi possível buscar usuários!"});
            })


        }else{
            res.statusCode = 400;
            res.json({erro: "Login inválido!"});
        }

    }else{
        res.statusCode = 400;
        res.json({erro: "Login inválido!"});
    }

});

app.listen(5000, () => {
    console.log('API RODANDO');
});


/*=========================  ABAIXO TEM OS MÈTODOS DA API APENAS COM ARRAY =================


//simulando uma base de dados
var DB = {

    games: [
        {
            id: 11,
            titulo: "Call of Duty 2",
            ano: 2010,
            preco: 60.12
        },
        {
            id: 22,
            titulo: "Medal of Honor 2",
            ano: 2012,
            preco: 75.35
        },
        {
            id: 33,
            titulo: "Conter Strike",
            ano: 2007,
            preco: 33.99
        },
        {
            id: 44,
            titulo: "GTA5",
            ano: 2012,
            preco: 79.99
        },
        {
            id: 55,
            titulo: "Diablo 3",
            ano: 2013,
            preco: 79.99
        }
    ]

}

app.get("/games", (req, res) => {

    res.statusCode = 200;
    res.json(DB.games);
    
});

app.get("/games/:id", (req, res) => {

    
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        
        var id = parseInt(req.params.id);

        // usando o método find()
        var game = DB.games.find(item => item.id == id);

        if(game != undefined){
            res.statusCode = 200;
            res.json(game);
        }else{
            res.sendStatus(404);
        }

    }

});

//cadastro de game enviando "raw - json" ou "body - x-www-form-urlencoded"
app.post("/game", (req, res) => {

    //var id     = req.body.id; 
    //var titulo = req.body.titulo;
    //var ano    = req.body.ano;
    //var preco  = req.body.preco;

    var {id, titulo, ano, preco} = req.body;

    var novo = {
        id: id,
        titulo: titulo,
        ano: ano,
        preco: preco
    }

    //adicionando o novo item no array
    DB.games.push(novo);

    res.sendStatus(200);

});


//removendo um game do array que simula o banco de dados
app.delete("/game/:id", (req, res) => {

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        var id = parseInt(req.params.id);

        //procurando o índice do elemento do array onde o id == id
        var index = DB.games.findIndex(item => item.id == id);

        //encontrou o elemento no array games, pois o índice é > -1
        if(index != -1){
            //removendo 1 item do array, começando do índice informado
            DB.games.splice(index,1);
            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }

    }

});

//editando um game
app.put("/game/:id", (req, res) => {

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{

        var id = parseInt(req.params.id);

        var game = DB.games.find(item => item.id == id);

        if(game != undefined){

            var {titulo, ano, preco} = req.body;

            if(titulo != undefined) game.titulo = titulo;
            if(ano != undefined) game.ano = ano;
            if(preco != undefined) game.preco = preco;

            res.sendStatus(200);


        }else{
            res.sendStatus(404);
        }

    }

});
/*=========================  FIM DOS MÉTODOS DA API APENAS COM ARRAY =================*/

