
const Client = require('ssh2-sftp-client');
const sftp = new Client;
const fs = require("fs")
const PromiseFtp = require("promise-ftp");
const { Socket } = require('dgram');
const ftp = new PromiseFtp();


const config = {
    host: {
        host: "172.30.3.11",
        user: "con5ftp",
        password: "Senha,123",
    },
    folder: "acrux/versao/sinvcar/516/SINVCAR_DB.ctrl",       // pasta no servidor a ser baixada
    local: './upload/SIVICAR_DB.ctrl'  // pasta no projeto
}


console.log("Iniciando conexão")
ftp.connect(config.host).then(serverMessage => {
    console.log(serverMessage)
    return ftp.get(config.folder);

}).then(stream => {
    console.log(stream)
    console.log("Retornando STREAM")
    stream.pipe(fs.createWriteStream(config.local));
}).then(() => {
    return ftp.end()
})

/*
function download() {
    console.log("Iniciando a conexão")
    sftp.connect(config.host).then(() => {
        console.log("Conexão REALIZADA")
        return sftp.get(config.folder, config.local).then(() => {
            sftp.end();
        }).catch(erro => {
            console.log("Erro no download")
            console.log(erro)
        })
    }).catch(err => {
        console.log("Erro na conexão")
        console.log(err)
    })
}
*/
