namespace cvirtualizacion {
    export enum posicion {
        horizontal = 1,
        vertical = 2
    }
    export interface iVirtu {
        id: string;
        alturaItem: number;
        posicion: posicion;
        ancho: number;
        alto: number;
        colorFondo: string;
        divContenedor: d3.Selection<HTMLDivElement, any, any, any>
    }

    export class cVirtualizacion {
        public contenedor: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private listaVirtual: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private datos: any[] = [];
        private configuracion: iVirtu;
        private scrollPos: number = 0; 
        private alturaTotal = 0;

          // Constructor parametrizado
        constructor(configuracion: iVirtu) {
            this.ObtenerDatos(this.datos)

            this.configuracion = configuracion;
            this.contenedor = configuracion.divContenedor
                .append("div")
                .attr("id", configuracion.id)
                .style("width", configuracion.ancho + "px")
                .style("height", configuracion.alto + "px")
                .style("background-color", configuracion.colorFondo)
                .style("border", "1px solid #999")
                // condición ? valor_si_verdadero : valor_si_falso (ternario)
                // ==igualdad de valor
                // === igualdad estricta(compara el valor asi como el tipo de dato)
                .style("overflow-y", configuracion.posicion === posicion.vertical ? "scroll" : "hidden")
                .style("overflow-x", configuracion.posicion === posicion.horizontal ? "scroll" : "hidden");

            this.listaVirtual = this.contenedor.append("div")
                .style("position", "relative");

            switch (configuracion.posicion) {
                case posicion.vertical:
                    this.listaVirtual.style("height", `${this.alturaTotal}px`);
                    this.contenedor.on("scroll", (event: any) => {
                        this.scrollPos = event.target.scrollTop;
                        this.dibujar(this.scrollPos)
                        console.log("valor de scroll vertical(Y) ", this.scrollPos)
                    })
                    break;
                case posicion.horizontal:
                    this.listaVirtual.style("width", `${this.alturaTotal}px`);
                    this.contenedor.on("scroll", (event: any) => {
                        this.scrollPos = event.target.scrollLeft;
                        this.dibujar(this.scrollPos)
                        console.log("valor de scroll horizontal(X)", this.scrollPos)
                    })
                    break;
            }
        }

        public ObtenerDatos(datos) {
            this.datos = datos;
            console.log(this.datos.length)
            this.alturaTotal = this.datos.length * this.configuracion.alturaItem;
            this.dibujar();
        }

        public dibujar(scroll: number = 0) {
            const miClase = this;
            const alturaItem = this.configuracion.alturaItem;
            let visible = 0;

            switch (this.configuracion.posicion) {
                case posicion.horizontal:
                    visible = this.configuracion.alto;
                    break;
                case posicion.vertical:
                    visible = this.configuracion.ancho;
                    break;
            }

            // scroll son los px que se desplazo  
            const inicio = Math.floor(scroll / alturaItem);
            const numRenderizar = Math.ceil(visible / alturaItem);
            const fin = Math.min(inicio + numRenderizar, this.datos.length);
            console.log("Numero de datos a mostrar", numRenderizar)
            console.log("Renderizando elementos de", inicio, "a", fin);

            const datosVisibles = this.datos.slice(inicio, fin);

            console.log("datosVisibles", datosVisibles)

            const items = this.listaVirtual.selectAll<HTMLDivElement, any>(".item")
                .data(datosVisibles, (d: any) => d.id);

            const enter = items.enter()
                .append("div")
                .attr("class", "item")
                .style("position", "absolute")
                .style("width", "100%")
                .style("height", `${alturaItem}px`)
                .style("border-bottom", "1px solid #ccc")
                .each(function (d, i) {
                    const div = d3.select(this);
                    console.log("esto es i en enter", i)
                    console.log("esto es this en enter", this)

                    // if (i % 2 === 0) {
                    //     div.style("background-color", "#b92cb9ff")
                    // }

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
                    // div.text(`${d.id}: ${d.nombre} (${d.edad} años)`);
                });

            items.each(function(d, i){
                const div = d3.select(this); 
                const indexReal = inicio +1;
                const pos = indexReal *alturaItem;

                switch (miClase.configuracion.posicion){
                    case posicion.horizontal:
                        div.style("transform", `translateX(${pos}px)`); 
                        break; 
                    case posicion.vertical:
                        div.style("transform",`translateY(${pos}px)` )
                        break; 
                }
            });
            items.exit().remove(); 
        }
    }
}