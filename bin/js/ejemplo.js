"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var figuras;
(function (figuras) {
    // 🔹 Enum con los tipos de figura
    let TipoFigura;
    (function (TipoFigura) {
        TipoFigura["Circulo"] = "C\u00EDrculo";
        TipoFigura["Cuadrado"] = "Cuadrado";
    })(TipoFigura || (TipoFigura = {}));
    class Figuras {
        constructor(containerId) {
            this.container;
            this.container.append("label").text("Tipo de figura: ");
            this.selectTipo = this.container
                .append("select")
                .attr("id", "selectFigura");
            this.selectTipo
                .selectAll("option")
                .data(Object.values(TipoFigura))
                .enter()
                .append("option")
                .attr("value", d => d)
                .text(d => d);
            this.contenedorInputs = this.container
                .append("div")
                .attr("id", "contenedorInputs");
            this.container.append("label").text(" Color: ");
            this.inputColor = this.container
                .append("input")
                .attr("type", "color")
                .attr("id", "colorFigura")
                .attr("value", "#000000");
            this.botonAgregar = this.container
                .append("button")
                .text("Agregar figura")
                .on("click", () => this.agregarFigura());
            this.selectTipo.on("change", () => this.mostrarInputs());
            this.mostrarInputs();
        }
        // --- Método para mostrar inputs según el tipo ---
        mostrarInputs() {
            const tipo = this.selectTipo.property("value");
            // Limpia inputs previos
            this.contenedorInputs.html("");
            this.inputRadio = undefined;
            this.inputLado = undefined;
            switch (tipo) {
                case TipoFigura.Circulo:
                    this.contenedorInputs.append("label").text(" Radio: ");
                    this.inputRadio = this.contenedorInputs
                        .append("input")
                        .attr("type", "number")
                        .attr("id", "radio")
                        .attr("min", "1")
                        .attr("placeholder", "Radio");
                    break;
                case TipoFigura.Cuadrado:
                    this.contenedorInputs.append("label").text(" Lado: ");
                    this.inputLado = this.contenedorInputs
                        .append("input")
                        .attr("type", "number")
                        .attr("id", "lado")
                        .attr("min", "1")
                        .attr("placeholder", "Lado");
                    break;
            }
        }
        agregarFigura() {
            const tipo = this.selectTipo.property("value");
            const color = this.inputColor.property("value");
            let medida;
            switch (tipo) {
                case TipoFigura.Circulo:
                    medida = this.inputRadio
                        ? +this.inputRadio.property("value")
                        : undefined;
                    break;
                case TipoFigura.Cuadrado:
                    medida = this.inputLado
                        ? +this.inputLado.property("value")
                        : undefined;
                    break;
            }
        }
    }
    figuras.Figuras = Figuras;
})(figuras || (figuras = {}));
const app = new figuras.Figuras("app");
//# sourceMappingURL=ejemplo.js.map