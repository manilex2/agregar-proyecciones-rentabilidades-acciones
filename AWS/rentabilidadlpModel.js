module.exports = class RentabilidadLP {
    constructor (
        secuencial,
        escenario,
        ticker,
        d30,
        m3,
        m6,
        a1,
        a3,
        a5,
        a10,
        idGrupo
    ) {
        this.secuencial = secuencial;
        this.escenario = escenario;
        this.ticker = ticker;
        this.d30 = d30;
        this.m3 = m3;
        this.m6 = m6;
        this.a1 = a1;
        this.a3 = a3;
        this.a5 = a5;
        this.a10 = a10;
        this.idGrupo = idGrupo
    }
    push(rentabilidad) {
        rentabilidad.push({
            secuencial: this.secuencial,
            escenario: this.escenario,
            ticker: this.ticker,
            d30: this.d30,
            m3: this.m3,
            m6: this.m6,
            a1: this.a1,
            a3: this.a3,
            a5: this.a5,
            a10: this.a10,
            id_grupo: this.idGrupo
        });
    }
}