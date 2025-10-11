namespace figuras {
    enum tipoFigura {
        circulo = 1,
        cuadrado = 2,
        pentagono = 3
    }

    interface iFiguras {
        id: number;
        figura: tipoFigura;
        x: number;
        y: number;
        medida: number;
        color: string;
    }

    export class cFiguras {
        private figuras: Map<number, iFiguras> = new Map();

        private contenedor: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
        private selectTipo: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;
        private inputColor: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private botonAgregar: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;
        private botonEliminar: d3.Selection<HTMLButtonElement, unknown, HTMLElement, any>;

        private input: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private label: d3.Selection<HTMLLabelElement, unknown, HTMLElement, any>;

        private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>

        private svgWidth = 400;
        private svgHeight = 300;
        private contador: number = 1;
        private selectId: number | null = null;

        constructor() {
            this.contenedor = d3.select("body")
                .append("div")
                .attr("id", "contenedorBase")
                .style("background-color", "#ffffffff") //color fondo
                .style("text-align", "center") //centrar texto
                .style("width", "600px") //ancho del elemento 
                .style("padding", "30px 30px") //espacio entre elemento
                .style("box-shadow", "5px 5px 15px gray"); //sombreado

            this.contenedor
                .append("H1")
                .text("Figuras")
                .style("color", "black")
                .style("font-size", "30px") //tamaño de fuente
                .style("font-family", "new times roman") //estilo de fuente

            this.contenedor.append("label")
                .text("Tipo de figura: ");

            this.contenedor.append("br")

            this.selectTipo = this.contenedor
                .append("select")
                .attr("id", "selectFigura")
                .style("width", "150px") //ancho 
                .style("height", "30px") //alto 
                .style("text-align", "center")

            this.selectTipo
                .selectAll("option")
                // extraer los keys y filtrar las clases que no se pueden convertir a number
                .data(Object.keys(tipoFigura).filter(k => isNaN(Number(k))))
                .enter()
                .append("option")
                // d es una clave del tipo de tipoFigura(enum)
                .attr("value", d => tipoFigura[d as keyof typeof tipoFigura]) // valor numérico (1 o 2)
                .text(d => d);
            this.contenedor.append("br");
            this.label = this.contenedor
                .append("label")
            this.contenedor.append("br");


            this.input = this.contenedor
                .append("input")
                .attr("type", "number")
                .attr("min", "1")
                .style("width", "150px")
                .style("height", "30px")
                .style("text-align", "center");

            this.contenedor.append("br")
            // Campos generales (color de figura y boton de agregar)
            this.contenedor.append("label").text("Color: ");

            this.contenedor.append("br");

            this.inputColor = this.contenedor
                .append("input")
                .attr("type", "color")
                .attr("id", "colorFigura")
                .style("width", "150px")
                .style("height", "30px")

            this.contenedor.append("br")

            this.botonAgregar = this.contenedor
                .append("button")
                .text("Agregar figura")
                .style("background", "#1c940dff")
                .style("color", "#fff")
                .style("border", "none")//borde nula
                .style("padding", "8px 15px") //espacio entre elemento vertical / horizontal
                .style("margin", "10px 10px") //borde entre 
                .style("cursor", "pointer")
                .on("click", () => {
                    this.agregarFigura();
                });

            this.botonEliminar = this.contenedor
                .append("button")
                .text("Eliminar figura")
                .style("background", "#cc0000")
                .style("color", "#fff")
                .style("border", "none")
                .style("padding", "8px 15px")
                .style("margin", "10px 10px")
                .style("cursor", "pointer")
                .on("click", () => this.eliminarSeleccionado());

            this.svg = this.contenedor.append("svg")
                .attr("width", this.svgWidth)
                .attr("height", this.svgHeight)
                .style("background-color", "#cfcfcfff")

            //se activa cuando se cambia el valor de un elemento        
            this.selectTipo.on("change", () => this.mostrarInputs());
            this.mostrarInputs();
        }

        public mostrarInputs() {
            const tipo = Number(this.selectTipo.property("value"));
            switch (tipo) {
                case tipoFigura.circulo:
                    this.label.text("Radio: ")
                    break;

                case tipoFigura.cuadrado:
                    this.label.text("Lado: ")
                    break;

                case tipoFigura.pentagono:
                    this.label.text("Radio: ")
                    break

            }
        }

        private agregarFigura(): void {
            const tipo = Number(this.selectTipo.property("value"));
            const color = this.inputColor.property("value");
            let medida: number;

            const nuevaFigura: iFiguras = {
                id: this.contador++,
                figura: tipo,
                x: 0,
                y: 0,
                medida: 0,
                color: color
            };

            medida = Number(this.input.property("value"));
            nuevaFigura.medida = medida;
            nuevaFigura.x = Math.random() * (this.svgWidth - 2 * medida) + medida;
            nuevaFigura.y = Math.random() * (this.svgHeight - 2 * medida) + medida;

            this.figuras.set(nuevaFigura.id, nuevaFigura);
            console.log("Nueva figura", nuevaFigura)
            this.renderizar();
        }

        private eliminarSeleccionado(): void {
            // has verifica que el valor entre () existe en circulosMap
            if (this.selectId !== null && this.figuras.has(this.selectId)) {
                this.figuras.delete(this.selectId);//elimina directamente por id
                this.selectId = null;
                this.renderizar();
            } else {
                alert("Selecciona un círculo primero :)");
            }
        }

        public generarPoligono(px, py, radio, lados): string {
            const puntos = [];
            //angulos entre vertices en radianes  //540° pentagono 
            const angulo = (2 * Math.PI) / lados;

            for (let i = 0; i < lados; i++) {
                const rad = i * angulo - Math.PI / 2; // -90° para que apunte hacia arriba
                const x = px + radio * Math.cos(rad); //se obtiene los vertices 
                const y = py + radio * Math.sin(rad);
                puntos.push([x, y]);
            }
            // p es cada vertice que se use mediante ",", posteriormente se une en uno solo 
            return puntos.map(p => p.join(",")).join(" ");
        }


        private renderizar() {
            const data = Array.from(this.figuras.values());
            const thisClase = this;

            const grupos = this.svg.selectAll<SVGGElement, iFiguras>("g.figura")
                .data(data, d => d.id);

            grupos.enter()
                .append("g")
                .attr("class", "figura")
                .each(function (d) {
                    const g = d3.select(this);
                    console.log("Esto es this (nuevo elemento):", this);

                    switch (d.figura) {
                        case tipoFigura.circulo:
                            g.append("circle")
                                .attr("cx", d.x)
                                .attr("cy", d.y)
                                .attr("r", 0)
                                .attr("fill", d.color)
                                .transition()
                                .duration(800)
                                .attr("r", d.medida);
                            break;

                        case tipoFigura.cuadrado:
                            g.append("rect")
                                .attr("x", d.x)
                                .attr("y", d.y)
                                .attr("width", 0)
                                .attr("height", 0)
                                .attr("fill", d.color)
                                .transition()
                                .duration(800)
                                .attr("width", d.medida)
                                .attr("height", d.medida);
                            break;

                        case tipoFigura.pentagono:
                            g.append("polygon")
                                .attr("points", thisClase.generarPoligono(d.x, d.y, 0, 5))
                                .transition()
                                .duration(800)
                                .attr("points", thisClase.generarPoligono(d.x, d.y, d.medida, 5)) // x, y radio, lados
                                .attr("fill", d.color);

                    }
                    //arrow fuction cuando se quiere usar this de la clase
                    g.on("click", () => {
                        thisClase.selectId = d.id;
                        console.log("Figura seleccionada, id:", thisClase.selectId);
                    });

                    g.call(
                        d3.drag<SVGGElement, iFiguras>()
                            .on("drag", function (event, d) {
                                const medida = d.medida;
                                d.x = Math.max(medida, Math.min(thisClase.svgWidth - medida, event.x));
                                d.y = Math.max(medida, Math.min(thisClase.svgHeight - medida, event.y));

                                switch (d.figura) {
                                    case tipoFigura.circulo:
                                        d3.select(this).select("circle")
                                            .attr("cx", d.x)
                                            .attr("cy", d.y);
                                        break;

                                    case tipoFigura.cuadrado:
                                        d3.select(this).select("rect")
                                            .attr("x", d.x)
                                            .attr("y", d.y);
                                        break;
                                    case tipoFigura.pentagono:
                                        d3.select(this).select("polygon")
                                            .attr("points", thisClase.generarPoligono(d.x, d.y, medida, 5))
                                }
                            })
                    );
                });

            // Figuras existentes
            grupos.each(function (d) {
                const g = d3.select(this);
                console.log("Esto es this (actualizar elemento):", this);
                switch (d.figura) {
                    case tipoFigura.circulo:
                        g.select("circle")
                            .transition()
                            .duration(800)
                            .attr("cx", d.x)
                            .attr("cy", d.y)
                            .attr("r", d.medida)
                            .attr("fill", d.color);
                        break;

                    case tipoFigura.cuadrado:
                        g.select("rect")
                            .transition()
                            .duration(800)
                            .attr("x", d.x)
                            .attr("y", d.y)
                            .attr("width", d.medida)
                            .attr("height", d.medida)
                            .attr("fill", d.color);
                        break;

                    case tipoFigura.pentagono:
                        g.select("polygon")
                            .transition()
                            .duration(800)
                            .attr("points", thisClase.generarPoligono(d.x, d.y, d.medida, 5))
                            .attr("fill", d.color);
                }
            });

            // Figuras eliminadas
            grupos.exit()
                .each(function () {
                    const g = d3.select(this);
                    console.log("Esto es this (eliminar elemento):", this);
                    g.transition()
                        .duration(1000)
                        .style("opacity", 0)
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