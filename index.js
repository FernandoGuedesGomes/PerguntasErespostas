const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const pergunta = require("./database/pergunta");
const resposta = require("./database/resposta");

connection
  .authenticate()
  .then(() => {
    console.log("Conexão bem sucedida!");
  })
  .catch((error) => {
    console.log(error);
  });




app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/", (req, res) => {
  pergunta.findAll({
    raw: true, order: [
      ['id', 'desc']
    ]
  }).then(perguntas => {
    res.render("index", {
      perguntas: perguntas
    });
  });

});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;

  pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect("/");
  })


});


app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  pergunta.findOne({
    where: { id: id }
  }).then(pergunta => {
    if (pergunta != undefined) {

      resposta.findAll({
        where: { perguntaId: pergunta.id },
        order: [
          ["id", "DESC"]
        ]
      }).then(resposta => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: resposta
        });
      })


    } else {
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;

  resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect(`/pergunta/${perguntaId}`);
  })
})



app.listen(8080, () => { console.log("app rodando"); });