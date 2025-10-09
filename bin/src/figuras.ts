namespace figuras {
   
    //tipo numerico
    enum tipoFigura {
        circulo = "circulo", 
        cuadrado = "cuadrado",
    }
    //crear una sola interfaz con dato de enum 

    interface ICirculo {
        id: number;
        cx: number; //coordenada x
        cy: number; //coordenada y
        r: number;
        color: string;
    }
//opcionales
    interface ICuadrado {
        id: number;
        x: number;
        y: number;
        lado: number;
        color: string;
    }


    export class cFiguras {
        private figuras: Map<number, ICirculo | ICuadrado> = new Map();

        private contenedor: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
        private selectTipo: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;
        private inputColor: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private botonAgregar: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
        private botonEliminar: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
        private contenedorInputs: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

        private inputRadio: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputLado: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;

        private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>

        private svgWidth = 400;
        private svgHeight = 300;
        private contador: number = 1;
        private selectId: number | null = null;
       

        constructor() {
            this.contenedor = d3.select("body")
                .append("div")
                .attr("id", "contenedorBase");

            this.contenedor.append("label").text("Tipo de figura: ")
            this.selectTipo = this.contenedor
                .append("select")
                .attr("id", "selectFigura");

            this.selectTipo
                .selectAll("option")
                //Devuelve un arreglo ["circulo", "cuadrado"] 
                .data(Object.values(tipoFigura))
                .enter()
                .append("option")
                .attr("value", d => d)
                .text(d => d);

            this.contenedorInputs = this.contenedor
                .append("div")
                .attr("id", "contenedorInputs");

            this.contenedor.append("label").text(" Color: ");
            this.inputColor = this.contenedor
                .append("input")
                .attr("type", "color")
                .attr("id", "colorFigura");

            this.botonAgregar = this.contenedor
                .append("button")
                .text("Agregar figura")
                .on("click", () => {
                    this.agregarFigura();
                });

            // this.botonEliminar = this.contenedor
            //     .append("button")
            //     .text("eliminar figura")
            //     .on("click", () => {
            //         this.eliminarSeleccionado();
            //     });

            this.svg = this.contenedor.append("svg")
                .attr("width", this.svgWidth)
                .attr("height", this.svgHeight)
                .style("border", "1px solid black")
                .style("display", "block");

            //se activa cuando se cambia el valor de un elemento        
            this.selectTipo.on("change", () => this.mostrarInputs());
            this.mostrarInputs();
        }

        public mostrarInputs() {
            const tipo = this.selectTipo.property("value");
            //mostar o ocultar 
            this.contenedorInputs.html("");

            switch (tipo) {
                case tipoFigura.circulo:
                    this.contenedorInputs.append("label").text(" Radio: ");
                    this.inputRadio = this.contenedorInputs
                        .append("input")
                        .attr("type", "number")
                        .attr("id", "radio")
                        .attr("min", "1")
                        .attr("placeholder", "Radio");
                    break;

                case tipoFigura.cuadrado:
                    this.contenedorInputs.append("label").text(" Lado: ")
                    this.inputLado = this.contenedorInputs
                        .append("input")
                        .attr("type", "number")
                        .attr("id", "lado")
                        .attr("placeholder", "Lado")
                    break;
            }
        }

        private agregarFigura(): void {
            const tipo = this.selectTipo.property("value");
            const color = this.inputColor.property("value");
            let medida: number;

            switch (tipo) {
                case tipoFigura.circulo:
                    medida = Number(this.inputRadio.property("value"))
                    const nuevoCirculo: ICirculo = {
                        id: this.contador++,
                        cx: Math.random() * (this.svgWidth - 2 * medida) + medida,
                        cy: Math.random() * (this.svgHeight - 2 * medida) + medida,
                        r: medida,
                        color: color
                    }
                    this.figuras.set(nuevoCirculo.id, nuevoCirculo);
                    console.log(nuevoCirculo)
                    break;

                case tipoFigura.cuadrado:
                    medida =  Number(this.inputLado.property("value"))
                    const nuevoCuadrado: ICuadrado = {
                        id: this.contador++,
                        x: Math.random() * (this.svgWidth - medida),
                        y: Math.random() * (this.svgHeight - medida),
                        lado: medida,
                        color: color
                    }
                    this.figuras.set(nuevoCuadrado.id, nuevoCuadrado);
                    console.log(nuevoCuadrado);
                    break;
            }
               this.renderizar();
        }

           
        private renderizar() {
            const data = Array.from(this.figuras.values());
            console.log(data)
            
            // Vincular los datos a los <g> del SVG
            const grupos = this.svg.selectAll<SVGGElement, ICirculo | ICuadrado>("g.figura")
                .data(data, d => d.id);

            //figuras nuevas
            const gruposEnter = grupos.enter()
                .append("g")
                .attr("class", "figura")
                .each(function (d) {
                    const g = d3.select(this); //aquí entra d3.select(this)
                    console.log("Esto es this (nuevo elemento):", this); 

                    //usar switch en base al enum
                    if ("r" in d) {
                        g.append("circle")
                            .attr("cx", d.cx)
                            .attr("cy", d.cy)
                            .attr("r", 0)
                            .attr("fill", d.color)
                            .transition()
                            .duration(800)
                            .attr("r", d.r)      
                    } else {
                        g.append("rect")
                            .attr("x", d.x)
                            .attr("y", d.y)
                            .attr("width", 0)
                            .attr("height", 0)
                            .attr("fill", d.color)
                            .transition()
                            .duration(800)
                            .attr("width", d.lado)
                            .attr("height", d.lado);
                    }
                });

            //figuras existentes
            grupos.each(function (d) {
                const g = d3.select(this);
                console.log("Esto es this (actualizar elemento):", this); 
                if ("r" in d) {
                    g.select("circle")
                        .transition()
                        .duration(800)
                        .attr("cx", d.cx)
                        .attr("cy", d.cy)
                        .attr("r", d.r)
                        .attr("fill", d.color);
                } else {
                    g.select("rect")
                        .transition()
                        .duration(800)
                        .attr("x", d.x)
                        .attr("y", d.y)
                        .attr("width", d.lado)
                        .attr("height", d.lado)
                        .attr("fill", d.color);
                }
            });

            //figuras eliminadas
            grupos.exit()
                .each(function () {
                    const g = d3.select(this);
                    console.log("Esto es this (eliminar elemento):", this); 
                    g.transition()
                        .duration(800)
                        .style("opacity",0)
                        .remove();
                });
        }

        public mostrar() {
            this.contenedor.style("display", "block")
        }
        public ocultar() {
            this.contenedor.style("display", "none")
        }

    }
}