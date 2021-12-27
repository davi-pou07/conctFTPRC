const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const fs = require("fs")
const PromiseFtp = require("promise-ftp");
const ftp = new PromiseFtp();
var path = require('path');

app.set('view engine', 'ejs')
app.use(express.static('public'))
//Carregamento do bodyPerser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



async function downloadArquivo(loja) {
    var erros = []
    var config = {
        host: {
            host: "172.30.3.11",
            user: "con5ftp",
            password: "Senha,123",
        },
        folder: `acrux/versao/sinvcar/${loja}/SINVCAR_DB.ctrl`,       // pasta no servidor a ser baixada
        local: `./public/upload/${loja}`  // pasta no projeto
    }


    if (!fs.existsSync(config.local)) {
        fs.mkdirSync(config.local);
    } else {
        console.log("Diretorio Existente");
    }


    console.log("Iniciando conexão")
    try {
        var serverMessage = await ftp.connect(config.host)
        console.log(serverMessage)
    } catch (erro) {
        console.log(erro)
        erros.push({ codErro: 1, erro: "Erro a se conectar com o provedor do arquivo na rede local" })
    }

    console.log("Iniciando download")
    try {
        var stream = await ftp.get(config.folder);
        console.log("Download realizado")
    } catch (error) {
        console.log(error)
        erros.push({ codErro: 2, erro: "Não encontrar arquivos na loja solicitada" })
    }

    try {
        console.log("Retornando DOWNLOAD para pasta local")
        var pipe = await stream.pipe(fs.createWriteStream(`${config.local}/SIVICAR_DB.ctrl`));
    } catch (error) {
        console.log(error)
        erros.push({ codErro: 3, erro: "Não foi possivel encaminhar arquivo para pasta local" })
    }

    if (erros[0] != undefined) {
        fs.writeFile(`./public/erros/erro${Date.now()}.txt`, erros)
    }

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
    console.log(arquivo)

    fs.stat(`./public${arquivo}`, (error, stats) => {
        if (error) {
            console.log(error);
            console.log("Arquivo inexistente")
            res.send("Arquivo inexistente")
        }
        else {
            console.log(stats);
            res.render('download', { arquivo: arquivo })
        }
    });
})
/*
req.file.buffer.toString('base64')





let buff = new Buffer(data, 'base64');
fs.writeFileSync('stack-abuse-logo-out.png', buff);



var formData = new FormData();
var imagefile = document.querySelector('#file');
formData.append("image", imagefile.files[0]);
axios.post('upload_file', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
*/


app.listen(8080, () => {
    console.log("Servidor rodando!")
})