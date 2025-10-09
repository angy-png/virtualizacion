namespace app {
    export class main {
        _circulos: circulos.Ccirculos | null = null;
        _figuras: figuras.cFiguras | null = null;
        constructor() {
            d3.select("body")
                .append("button")
                .text("Circulos")
                .on("click", () => {
                    if (!this._circulos) this._circulos = new circulos.Ccirculos();
                    this._circulos.mostrar();

                    if (this._figuras) this._figuras.ocultar();
                });


            d3.select("body")
                .append("button")
                .text("Figuras")
                .on("click", () => {
                    if (!this._figuras) this._figuras = new figuras.cFiguras();
                    this._figuras.mostrar();

                    if (this._circulos) this._circulos.ocultar();
                });
             d3.select("body")
             .append("p").text("-----------------------------------")
        }
    }
    let mainApp = new app.main();

}