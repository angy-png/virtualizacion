namespace circulos {
    export class Ccirculos {
        private contenedor: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private input1: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private input2: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private resultado: d3.Selection<HTMLParagraphElement, unknown, HTMLElement, any>;

        constructor() {
              this.contenedor = d3.select("body")
                .append("div")
                .attr("id", "contenedor")
            var transform  = d3.zoomIdentity
            .translate(100, 0).scale(1); 
               
               
            this.input1 = this.contenedor
                .append("input")
                .attr("type", "number")
                .property("value",10 )
                .attr("placeholder", "Numero 1");

            this.input2 = this.contenedor
                .append("input")
                .attr("type", "number")
                .property("value",10 )
                .attr("placeholder", "Numero 2");

            this.contenedor
                .append("button")
                .text("Sumar")
                .on("click", () => this.sumar());

            this.resultado = this.contenedor
                .append("p");
        }

        private sumar() {
            const valor1 = Number(this.input1.property("value" ));
            const valor2 = Number(this.input2.property("value"));
            const suma = valor1 + valor2; 
            this.resultado.text(`Resultado: ${suma}`);
        }

        public mostrar(){
            this.contenedor.style("display", "block"); 
        }
        public ocultar(){
            this.contenedor.style("display", "none")
        }
    }
     
} 
