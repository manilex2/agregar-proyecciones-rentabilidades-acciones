module.exports = class RentabilidadMP {
    constructor (
        secuencial,
        escenario,
        ticker,
        m1,
        m2,
        m3,
        m4,
        m5,
        m6,
        idGrupo
    ) {
        this.secuencial = secuencial;
        this.escenario = escenario;
        this.ticker = ticker;
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
        this.m4 = m4;
        this.m5 = m5;
        this.m6 = m6;
        this.idGrupo = idGrupo
    }
    push(rentabilidad) {
        rentabilidad.push({
            secuencial: this.secuencial,
            escenario: this.escenario,
            ticker: this.ticker,
            m1: this.m1,
            m2: this.m2,
            m3: this.m3,
            m4: this.m4,
            m5: this.m5,
            m6: this.m6,
            id_grupo: this.idGrupo
        });
    }
}