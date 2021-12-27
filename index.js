const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const fs = require("fs")
const PromiseFtp = require("promise-ftp");
const ftp = new PromiseFtp();
var path = require('path');
const request = require('request');

app.set('view engine', 'ejs')
app.use(express.static('public'))
//Carregamento do bodyPerser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



async function downloadArquivo(loja) {
    var config = {
        host: {
            host: "172.30.3.11",
            user: "con5ftp",
            password: "Senha,123",
        },
        folder: `acrux/versao/sinvcar/${loja}/SINVCAR_DB.ctrl`,       // pasta no servidor a ser baixada
        local: `./public/upload/${loja}/SIVICAR_DB.ctrl`  // pasta no projeto
    }
    console.log("Iniciando conexão")
    var serverMessage = await ftp.connect(config.host)
    console.log(serverMessage)
    console.log("Iniciando download")
    var stream = await ftp.get(config.folder);
    console.log("Retornando DOWNLOAD")
    var pipe = await stream.pipe(fs.createWriteStream(config.local));
    console.log("finalizando conexão")
    return ftp.end()
}

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.get("/loja/:loja", async (req, res) => {
    var loja = req.params.loja
    await downloadArquivo(loja)
    var arquivo = `/upload/${loja}/SIVICAR_DB.ctrl`
    console.log("arquivo")
    console.log(arquivo)
    res.render('download', { arquivo: arquivo })
})


app.listen(8080, () => {
    console.log("Servidor rodando!")
})