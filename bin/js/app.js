var app;
(function (app) {
    class main {
        constructor() {
            this._circulos = null;
            this._figuras = null;
            d3.select("body")
                .append("button")
                .text("Circulos")
                .on("click", () => {
                if (!this._circulos)
                    this._circulos = new circulos.Ccirculos();
                this._circulos.mostrar();
                if (this._figuras)
                    this._figuras.ocultar();
            });
            d3.select("body")
                .append("button")
                .text("Figuras")
                .on("click", () => {
                if (!this._figuras)
                    this._figuras = new figuras.cFiguras();
                this._figuras.mostrar();
                if (this._circulos)
                    this._circulos.ocultar();
            });
            d3.select("body")
                .append("p").text("-----------------------------------");
        }
    }
    app.main = main;
    let mainApp = new app.main();
})(app || (app = {}));
//# sourceMappingURL=app.js.map