var cvirtualizacion;
(function (cvirtualizacion) {
    let posicion;
    (function (posicion) {
        posicion[posicion["horizontal"] = 1] = "horizontal";
        posicion[posicion["vertical"] = 2] = "vertical";
    })(posicion = cvirtualizacion.posicion || (cvirtualizacion.posicion = {}));
    class cVirtualizacion {
        // Constructor parametrizado
        constructor(configuracion) {
            this.datos = [];
            this.scrollPos = 0;
            this.configuracion = configuracion;
            this.contenedor = configuracion.divContenedor
                .append("div")
                .attr("id", configuracion.id)
                .style("width", configuracion.ancho + "px")
                .style("height", configuracion.alto + "px")
                .style("background-color", configuracion.colorFondo)
                .style("border", "1px solid #999")
                .style("position", "relative")
                // condición ? valor_si_verdadero : valor_si_falso (ternario)
                // ==igualdad de valor
                // === igualdad estricta(compara el valor asi como el tipo de dato)
                .style("overflow-y", configuracion.posicion === posicion.vertical ? "scroll" : "hidden")
                .style("overflow-x", configuracion.posicion === posicion.horizontal ? "scroll" : "hidden");
            this.listaVirtual = this.contenedor.append("div")
                .style("position", "relative");
            this.altoAncho();
        }
        altoAncho() {
            switch (this.configuracion.posicion) {
                case posicion.vertical:
                    this.listaVirtual.style("height", `${this.configuracion.alturaTotal}px`);
                    this.contenedor.on("scroll", (event) => {
                        this.scrollPos = event.target.scrollTop;
                        //console.log(">>Test scrool detected: ", this.scrollPos);
                        this.dibujar(this.scrollPos);
                    });
                    break;
                case posicion.horizontal:
                    this.listaVirtual.style("width", `${this.configuracion.alturaTotal}px`);
                    this.contenedor.on("scroll", (event) => {
                        this.scrollPos = event.target.scrollLeft;
                        this.dibujar(this.scrollPos);
                    });
                    break;
            }
            console.log("Creando lista con altura:", this.configuracion.alturaTotal);
            console.log("valor de scroll horizontal(X)", this.scrollPos);
            console.log("valor de width", this.configuracion.alturaTotal);
        }
        ObtenerDatos(datos) {
            this.datos = datos;
        }
        dibujar(scroll = 0) {
            const miClase = this;
            const alturaItem = this.configuracion.alturaItem;
            let visible = 0;
            switch (this.configuracion.posicion) {
                case posicion.horizontal:
                    visible = this.configuracion.ancho;
                    console.log(visible);
                    break;
                case posicion.vertical:
                    visible = this.configuracion.alto;
                    break;
            }
            // scroll son los px que se desplazo  
            // .floor redondea hacia abajo 
            const inicio = Math.floor(scroll / alturaItem);
            // .ceil redondea hacia arriba 
            const numRenderizar = Math.ceil(visible / alturaItem);
            const fin = Math.min(inicio + numRenderizar, this.datos.length);
            console.log("Numero de datos a mostrar", numRenderizar);
            console.log("Renderizando elementos de", inicio, "a", fin);
            const datosVisibles = this.datos.slice(inicio, fin);
            console.log("debug", datosVisibles.length);
            console.log("datosVisibles", datosVisibles);
            const items = this.listaVirtual
                .selectAll("div.item")
                .data(datosVisibles, (d) => d.id);
            items.enter()
                .append("div")
                .attr("class", "item")
                .style("position", "absolute")
                .style("width", miClase.configuracion.posicion === posicion.vertical ? "100%" : `${alturaItem}px`)
                .style("height", `${alturaItem}px`)
                .style("border", "1px solid #000000ff")
                .style("text-align", "center")
                .each(function (d, i) {
                const div = d3.select(this);
                const indexReal = inicio + i;
                const pos = indexReal * alturaItem;
                switch (miClase.configuracion.posicion) {
                    case posicion.horizontal:
                        div.style("transform", `translateX(${pos}px)`);
                        break;
                    case posicion.vertical:
                        div.style("transform", `translateY(${pos}px)`);
                        break;
                }
                div.text(`${d.id}`);
            });
            // items.each(function (d, i) {
            //     const div = d3.select(this);
            //     const indexReal = inicio + 1;
            //     const pos = indexReal * alturaItem;
            //     switch (miClase.configuracion.posicion) {
            //         case posicion.horizontal:
            //             div.style("transform", `translateX(${pos}px)`);
            //             break;
            //         case posicion.vertical:
            //             div.style("transform", `translateY(${pos}px)`)
            //             break;
            //     }
            // });
            items.exit().remove();
        }
    }
    cvirtualizacion.cVirtualizacion = cVirtualizacion;
})(cvirtualizacion || (cvirtualizacion = {}));
//# sourceMappingURL=virtualizacion.js.map