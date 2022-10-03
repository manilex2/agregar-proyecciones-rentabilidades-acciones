module.exports = class Proyeccion {
    constructor (
        ticker,
        fecha,
        precio,
        forecast,
        pesimista,
        optimista,
        idGrupo
    ) {
        this.ticker = ticker;
        this.fecha = fecha;
        this.precio = precio;
        this.forecast = forecast;
        this.pesimista = pesimista;
        this.optimista = optimista;
        this.idGrupo = idGrupo
    }
    push(proyecciones) {
        proyecciones.push({
            ticker: this.ticker,
            fecha: this.fecha,
            precio: this.precio,
            forecast: this.forecast,
            pesimista: this.pesimista,
            optimista: this.optimista,
            id_grupo: this.idGrupo
        });
    }
}