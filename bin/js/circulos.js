var circulos;
(function (circulos) {
    class Ccirculos {
        constructor() {
            this.contenedor = d3.select("body")
                .append("div")
                .attr("id", "contenedor");
            var transform = d3.zoomIdentity
                .translate(100, 0).scale(1);
            this.input1 = this.contenedor
                .append("input")
                .attr("type", "number")
                .property("value", 10)
                .attr("placeholder", "Numero 1");
            this.input2 = this.contenedor
                .append("input")
                .attr("type", "number")
                .property("value", 10)
                .attr("placeholder", "Numero 2");
            this.contenedor
                .append("button")
                .text("Sumar")
                .on("click", () => this.sumar());
            this.resultado = this.contenedor
                .append("p");
        }
        sumar() {
            const valor1 = Number(this.input1.property("value"));
            const valor2 = Number(this.input2.property("value"));
            const suma = valor1 + valor2;
            this.resultado.text(`Resultado: ${suma}`);
        }
        mostrar() {
            this.contenedor.style("display", "block");
        }
        ocultar() {
            this.contenedor.style("display", "none");
        }
    }
    circulos.Ccirculos = Ccirculos;
})(circulos || (circulos = {}));
//# sourceMappingURL=circulos.js.map