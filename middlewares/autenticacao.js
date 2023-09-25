const jwt = require("jsonwebtoken");

function autenticar(secret){

    return (req, res, next) => {

        const userToken = req.headers['authorization'];
    
        if(userToken != undefined){

            const bearer = userToken.split(' ');
            var token = bearer[1];

            jwt.verify(token, secret, (erro, data) => {
                
                if(erro){
                    res.statusCode = 400;
                    res.json({erro: "Erro ao validar token!"});
                }else{
                    //console.log(data);
                    req.token = token;
                    req.logado = {
                        id: data.id,
                        email: data.email
                    }

                    next();
                }

            });

        }else{
            res.statusCode = 401;
            res.json({erro: "Token inválido!"});
        }
    };
    
}

module.exports = autenticar;