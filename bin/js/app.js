var app;
(function (app) {
    class main {
        constructor() {
            this._circulos = null;
            this._figuras = null;
            this._virtualizacion = null;
            d3.select("body")
                .append("button")
                .text("Suma")
                .on("click", () => {
                if (!this._circulos)
                    this._circulos = new circulos.Ccirculos();
                this._circulos.mostrar();
                if (this._figuras)
                    this._figuras.ocultar();
                // if (this._virtualizacion) this._virtualizacion.ocultar();
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
                // if (this._virtualizacion) this._virtualizacion.ocultar();
            });
            d3.select("body")
                .append("button")
                .text("Virtualizacion")
                .on("click", () => {
                if (!this._virtualizacion)
                    this._virtualizacion = new virtualizacion.cVirtualizacion();
                // this._virtualizacion.mostrar(); 
                if (this._circulos)
                    this._circulos.ocultar();
                if (this._figuras)
                    this._figuras.ocultar();
            });
            d3.select("body")
                .append("p").text("-----------------------------------");
        }
    }
    app.main = main;
    let mainApp = new app.main();
})(app || (app = {}));
//# sourceMappingURL=app.js.map