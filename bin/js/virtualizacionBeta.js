var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var virtualizacionB;
(function (virtualizacionB) {
    class cVirtualizacionB {
        constructor() {
            this.usuarios = new Map();
            this.data = [];
            this.alturaItem = 23;
            this.alturaItemX = 150;
            this.alturaTotal = 0;
            this.alturaTotalX = 0;
            this.alturaVisible = 300;
            this.alturaVisibleX = 400;
            //carga los datos primero, y cuando termina, inicializa todo lo demas 
            this.cargarDatos().then(() => {
                this.inicializar();
            });
            this.cargarDatosX().then(() => {
                this.inicializarX();
            });
        }
        cargarDatos() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch("http://127.0.0.1:5500/bin/usuarios.json");
                    this.data = yield response.json();
                    for (let i = 0; i < this.data.length; i++) {
                        const item = this.data[i];
                        const usuarioNuevo = {
                            id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                            nombre: item.nombre ? String(item.nombre) : "No existe",
                            edad: item.edad !== undefined && item.edad !== null ? Number(item.edad) : 0
                        };
                        this.usuarios.set(usuarioNuevo.id, usuarioNuevo);
                    }
                    this.alturaTotal = this.data.length * this.alturaItem;
                    console.log("Altura total del contenedor", this.alturaTotal);
                }
                catch (_a) {
                    console.log("Datos no cargados");
                }
            });
        }
        inicializar() {
            this.contenedorY = d3.select("body")
                .append("div")
                .style("width", "500px")
                .style("height", `${this.alturaVisible}px`)
                .style("overflow-y", "scroll") //scroll en eje Y 
                .style("overflow-x", "hidden") //oculta el desbordamiento del eje x
                .style("border", "1px solid #999");
            this.listaVirtual = this.contenedorY.append("div")
                .style("position", "relative") //desplazamiento respecto al documento 
                .style("height", `${this.alturaTotal}px`);
            console.log("Creando lista con altura:", this.alturaTotal);
            // detecta el evento del scroll y actualiza la posicion del scroll vertical 
            this.contenedorY.on("scroll", (event) => {
                const scrollTop = event.target.scrollTop;
                console.log("valor de scroll", scrollTop);
                this.actualizarLista(scrollTop);
            });
        }
        actualizarLista(scrollTop) {
            const miClase = this;
            // scrollTop son los px que se desplazo  
            const inicio = Math.floor(scrollTop / this.alturaItem);
            //redondea a un entero mas cercano 
            const numRenderizar = Math.ceil(this.alturaVisible / this.alturaItem);
            //final de los elementos visibles, sin pasarse del total del arreglo
            const fin = Math.min(inicio + numRenderizar, this.data.length);
            console.log("Numero de datos a mostrar", numRenderizar);
            console.log("Renderizando elementos de", inicio, "a", fin);
            //Obtener solo los usuarios visibles map a arreglo 
            const datosVisibles = Array.from(this.usuarios.values()).slice(inicio, fin);
            // Selección de los elementos div.item y unión con los datos
            const items = this.listaVirtual
                .selectAll("div.item")
                .data(datosVisibles, (d) => d.id); // key = id
            items.enter()
                .append("div")
                .attr("class", "item")
                .style("position", "absolute")
                .style("height", `${this.alturaItem}px`)
                .style("width", "100%")
                // se pasa el dato del valor y el indice 
                .each(function (d, i) {
                const g = d3.select(this); // 'this' es el div actual(cada dato)
                console.log("esto es i en enter", i);
                console.log("esto es this en enter", this);
                // Posición vertical usando translateY
                g.style("transform", `translateY(${(inicio + i) * miClase.alturaItem}px)`);
                // Estilos opcionales
                g.style("background-color", "#e99ee9ff")
                    .style("padding", "5px");
                // Texto del usuario
                g.text(`${d.id}: ${d.nombre} (${d.edad} años)`);
            });
            // Actualizar elementos existentes
            items.each(function (d, i) {
                const g = d3.select(this);
                g.style("transform", `translateY(${(inicio + i) * miClase.alturaItem}px)`)
                    .text(`${d.id}: ${d.nombre} (${d.edad} años)`);
            });
            //Eliminar elementos que ya no están en vista
            items.exit().remove();
        }
        // ---------------------------------------------------------------------------------
        cargarDatosX() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch("http://127.0.0.1:5500/bin/usuarios.json");
                    this.data = yield response.json();
                    for (let i = 0; i < this.data.length; i++) {
                        const item = this.data[i];
                        const usuarioNuevo = {
                            id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                            nombre: item.nombre ? String(item.nombre) : "No existe",
                            edad: item.edad !== undefined && item.edad !== null ? Number(item.edad) : 0
                        };
                        this.usuarios.set(usuarioNuevo.id, usuarioNuevo);
                    }
                    this.alturaTotalX = this.data.length * this.alturaItemX;
                    console.log("Altura total del contenedor", this.alturaTotalX);
                }
                catch (_a) {
                    console.log("Datos no cargados");
                }
            });
        }
        inicializarX() {
            this.contenedorX = d3.select("body")
                .append("div")
                .style("width", "400px")
                .style("height", `${this.alturaVisibleX}px`)
                .style("overflow-x", "scroll")
                .style("border", "1px solid #999")
                .style("position", "relative");
            // .style("background-color", "red")
            this.listaVirtualX = this.contenedorX.append("div")
                .style("width", `${this.alturaTotalX}px`)
                .style("flex-direction", "row");
            console.log("Creando lista con altura:", this.alturaTotalX);
            this.contenedorX.on("scroll", (event) => {
                const scrollLeft = event.target.scrollLeft;
                this.actualizarListaX(scrollLeft);
            });
        }
        actualizarListaX(scrollLeft) {
            const miClase = this;
            const inicio = Math.floor(scrollLeft / this.alturaItemX);
            const numRenderizar = Math.ceil(this.alturaVisibleX / this.alturaItemX);
            const fin = Math.min(inicio + numRenderizar, this.data.length);
            // const fin = Math.min(inicio + Math.ceil(this.datosRenderizar),this.data.length);
            console.log("Numero de datos a mostrar", numRenderizar);
            console.log("Renderizando elementos de", inicio, "a", fin);
            //Obtener solo los usuarios visibles
            const datosVisibles = Array.from(this.usuarios.values()).slice(inicio, fin);
            // Selección de los elementos div.item y unión con los datos
            const items = this.listaVirtualX
                .selectAll("div.itemx")
                .data(datosVisibles, (d) => d.id); // key = id
            items.enter()
                .append("div")
                .attr("class", "itemx")
                .style("position", "absolute")
                .style("top", "0px")
                .style("width", `${this.alturaItemX}px`)
                // se pasa el dato del valor y el indice 
                .each(function (d, i) {
                const g = d3.select(this); // 'this' es el div actual
                console.log("esto es this en enter", this);
                // Posición vertical usando translateY
                g.style("transform", `translateX(${(inicio + i) * miClase.alturaItemX}px)`);
                // Estilos opcionales
                g.style("background-color", "#e99ee9ff")
                    .style("padding", "10px");
                // Texto del usuario
                g.text(`${d.id}: ${d.nombre} (${d.edad} años)`);
            });
            // Actualizar elementos existentes
            items.each(function (d, i) {
                const g = d3.select(this);
                g.style("transform", `translateX(${(inicio + i) * miClase.alturaItemX}px)`)
                    .text(`${d.id}: ${d.nombre} (${d.edad} años)`);
            });
            //Eliminar elementos que ya no están en vista
            items.exit().remove();
        }
    }
    virtualizacionB.cVirtualizacionB = cVirtualizacionB;
})(virtualizacionB || (virtualizacionB = {}));
//# sourceMappingURL=virtualizacionBeta.js.map