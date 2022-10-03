require('dotenv').config()
const mysql2 = require('mysql2');
const { database } = require('./keys');
const RentabilidadMP = require("./rentabilidadmpModel");
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});

exports.handler = async function (event) {
    const promise = new Promise(async function() {
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
            const rentabilidadesmp = [];
            var requestRentabilidadesMP = (await googleSheet.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: `${process.env.ID_HOJA_RENT_MP}`
            })).data;
            var recogerRentabilidadesMP = requestRentabilidadesMP.values;
    
            for (let i = 0; i < recogerRentabilidadesMP.length; i++) {
                var secuencial = recogerRentabilidadesMP[i][0];
                var escenario = recogerRentabilidadesMP[i][1];
                var ticker = recogerRentabilidadesMP[i][2];
                var d1 = recogerRentabilidadesMP[i][3];
                var d2 = recogerRentabilidadesMP[i][4];
                var d5 = recogerRentabilidadesMP[i][5];
                /* var m4 = recogerRentabilidadesMP[i][6];
                var m5 = recogerRentabilidadesMP[i][7];
                var m6 = recogerRentabilidadesMP[i][8]; */
                var idGrupo = recogerRentabilidadesMP[i][6];
                let newRentabilidadMP = new RentabilidadMP(
                    secuencial,
                    escenario,
                    ticker,
                    d1,
                    d2,
                    d5,
                    /* m4,
                    m5,
                    m6, */
                    idGrupo
                );
                newRentabilidadMP.push(rentabilidadesmp);
            }
            
            await agregarDatos(rentabilidadesmp, process.env.TABLE_ACCIONES_RENT_MP);
            await finalizarEjecucion();
        } catch (err) {
            console.error(err);
        }
    
        async function agregarDatos(datos, table) {
            console.log(datos);
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
        };
    });
    return promise;
};