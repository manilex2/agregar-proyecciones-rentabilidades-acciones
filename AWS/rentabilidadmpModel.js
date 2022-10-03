module.exports = class RentabilidadMP {
    constructor (
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
    ) {
        this.secuencial = secuencial;
        this.escenario = escenario;
        this.ticker = ticker;
        this.d1 = d1;
        this.d2 = d2;
        this.d5 = d5;
        /* this.m4 = m4;
        this.m5 = m5;
        this.m6 = m6; */
        this.idGrupo = idGrupo
    }
    push(rentabilidad) {
        rentabilidad.push({
            secuencial: this.secuencial,
            escenario: this.escenario,
            ticker: this.ticker,
            d1: this.d1,
            d2: this.d2,
            d5: this.d5,
            /* m4: this.m4,
            m5: this.m5,
            m6: this.m6, */
            id_grupo: this.idGrupo
        });
    }
}