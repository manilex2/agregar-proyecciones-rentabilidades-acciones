require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const mysql2 = require('mysql2');
const RentabilidadMP = require("./rentabilidadmpModel");
const RentabilidadLP = require("./rentabilidadlpModel");
const { database } = require('./keys');
const {google} = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});
const PUERTO = 4300;

app.use(morgan('dev'));

app.get('/', async function (solicitud, respuesta) {
    const conn = mysql2.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        port: database.port,
        database: database.database
    });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const client = await auth.getClient();
    const googleSheet = google.sheets({ version: 'v4', auth: client });
    try {
        const rentabilidadeslp = [];
        var requestRentabilidadesLP = (await googleSheet.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: `${process.env.ID_HOJA_RENT_LP}`
        })).data;
        var recogerRentabilidadesLP = requestRentabilidadesLP.values;

        for (let i = 0; i < recogerRentabilidadesLP.length; i++) {
            var secuencial = recogerRentabilidadesLP[i][0];
            var escenario = recogerRentabilidadesLP[i][1];
            var ticker = recogerRentabilidadesLP[i][2];
            var d30 = recogerRentabilidadesLP[i][3];
            var m3 = recogerRentabilidadesLP[i][4];
            var m6 = recogerRentabilidadesLP[i][5];
            var a1 = recogerRentabilidadesLP[i][6];
            /* var a3 = recogerRentabilidadesLP[i][7];
            var a5 = recogerRentabilidadesLP[i][8];
            var a10 = recogerRentabilidadesLP[i][9]; */
            var idGrupo = recogerRentabilidadesLP[i][7];
            let newRentabilidadLP = new RentabilidadLP(
                secuencial,
                escenario,
                ticker,
                d30,
                m3,
                m6,
                a1,
                /* a3,
                a5,
                a10, */
                idGrupo
            );
            newRentabilidadLP.push(rentabilidadeslp);
        }
        
        await agregarDatos(rentabilidadeslp, process.env.TABLE_ACCIONES_RENT_LP);
        await finalizarEjecucion();
    } catch (err) {
        console.error(err);
    }

    async function agregarDatos(datos, table) {
        if (!datos || datos[0][0]==="#N/A") {
            console.log("No se encontraron datos.");
            return;
        } else {
            let sql1 = `DELETE FROM ${table} WHERE id_grupo=${datos[0].id_grupo}`;
            let sql2 = `ALTER TABLE ${table} AUTO_INCREMENT=1`;
            conn.query(sql1, function (err, result) {
                if (err) throw err;
            });
            conn.query(sql2, function (err, result) {
                if (err) throw err;
            });
            let sql3 = `INSERT INTO ${table} SET ?`;
            for (let i = 0; i < datos.length; i++) {
                const element = datos[i];
                conn.query(sql3, [element], function (err, result) {
                    if (err) throw err;
                });   
            }    
            console.log(`Agredados ${datos.length} datos a ${table}`);
        }
    };
    async function finalizarEjecucion() {
        conn.end();
        respuesta.send("OK");
    };
});

app.listen(PUERTO || process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${PUERTO || process.env.PORT}`);
});
