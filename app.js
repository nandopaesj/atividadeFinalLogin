const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

//middleware para configurar a sessao
app.use(session({
    secret: 'meusegredoseguro',
    resave: false, 
    saveUninitialized: true,//nao renovar a sessao a cade req

    cookie: { secure: false,
       maxAge: 60 * 1000 //  1 minuto 
    }
}));

app.use(express.json());

app.get('/',( req, res )=>{
    if(req.session.usuario){

        if(req.session.visitas){            
            req.session.visitas++
        }else{
            req.session.visitas = 1
        }  
        res.send(`
            Olá ${req.session.usuario},
            Você visitou esta página
             ${req.session.visitas} vezes.
        `);       

    }else{
        res.send(' Você visitou esta'+
            ' página 1 vez. Faça o login!');
    }
});

app.post('/login', (req, res)=>{

    const { username, password } = req.body;

    if(username === 'marcos' && password === '123'){

        req.session.usuario = username;
        res.send('Login bem sucedido!');
    }else{
        res.send('Credenciais inválidas!')
    }
});

app.get('/perfil', (req, res)=>{
    if(req.session.usuario){
        res.send(`Bem vindo ao seu perfil , ${req.session.usuario}`);
    }else{
        res.send('Faça o login primeiro');
    }
});

app.get('/logout', (req, res)=>{
    req.session.destroy( (err) =>{

        if(err){
            return res.send('Erro ao sair')
        }
        res.send('Logout realizado!')
    });
});


// CÓDIGOS DE STATUS DA AULA ANTERIOR
app.get('/sucesso', (req, res) => {
    res.status(200).send('Requisição concluída com sucesso (200)');
})

app.post('/criar', (req, res) => {
    res.status(201).send('Recurso criado com sucesso (201)');
})

app.get('/nao-encontrado', (req, res) => {
    res.status(404).send('Página ou recurso não encontrado (404)');
})

app.get("/nao-autorizado", (req, res) => {
    res.status(401).json({
        status: 401,
        message: "Você precisa estar logado para acessar esse recurso"
    })
});

app.get("/proibido", (req, res) => {
    res.status(403).send('Usuário não autorizado (403)');
});

app.post("/somente-get", (req, res) => {
    res.status(501).send('Utilize somente o método GET (501)');
});

app.post("/usuario", (req, res) => {
    res.status(409).send('Houve um conflito: Usuário já existe (409)');
});

app.get("/limite", (req, res) => {
    res.status(429).send('Muitas requisições estão sendo feitas! Se acalma ai pai (429)');
});



app.listen(PORT, ()=>{
    console.log(`Servidor rodando http://localhost:${PORT}`);
});