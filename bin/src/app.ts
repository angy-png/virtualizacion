namespace app {
    export class main {
        _circulos: circulos.Ccirculos | null = null;
        _figuras: figuras.cFiguras | null = null;
        _virtualizacion: virtualizacionB.cVirtualizacionB | null = null;
        _pruebaV: pruebaControl.cPruebaControl | null = null
        constructor() {
            d3.select("body")
                .append("button")
                .text("Suma")
                .on("click", () => {
                    if (!this._circulos) this._circulos = new circulos.Ccirculos();
                    this._circulos.mostrar();

                    if (this._figuras) this._figuras.ocultar();
                    // if (this._virtualizacion) this._virtualizacion.ocultar();
                });


            d3.select("body")
                .append("button")
                .text("Figuras")
                .on("click", () => {
                    if (!this._figuras) this._figuras = new figuras.cFiguras();
                    this._figuras.mostrar();

                    if (this._circulos) this._circulos.ocultar();
                    // if (this._virtualizacion) this._virtualizacion.ocultar();
                });

            d3.select("body")
                .append("button")
                .text("Virtualizacion")
                .on("click", () => {
                    if (!this._virtualizacion) this._virtualizacion = new virtualizacionB.cVirtualizacionB();
                    // this._virtualizacion.mostrar(); 
                 
                    if (this._circulos) this._circulos.ocultar();
                    if (this._figuras) this._figuras.ocultar();

                })

            d3.select("body")
            .append("button")
            .text("Prueba de control")
            .on("click", ()=>{
                if(!this._pruebaV) this._pruebaV = new pruebaControl.cPruebaControl();
            })
  
            d3.select("body")
                .append("p").text("-----------------------------------")
        }
    }
    let mainApp = new app.main();

}