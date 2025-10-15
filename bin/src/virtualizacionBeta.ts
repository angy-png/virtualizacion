namespace virtualizacionB {
    interface iUsuario {
        id: number;
        nombre: string;
        edad: number;
    }

    export class cVirtualizacionB {
        private contenedorY: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private contenedorX: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
        
        private listaVirtual: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private listaVirtualX: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

        private usuarios: Map<number, iUsuario> = new Map();
        private data: iUsuario[] = [];

        private alturaItem = 23;
        private alturaItemX = 150;

        private alturaTotal = 0;
        private alturaTotalX = 0;

        private alturaVisible = 300;
        private alturaVisibleX = 400;

        constructor() {
            //carga los datos primero, y cuando termina, inicializa todo lo demas 
            this.cargarDatos().then(() => {
                this.inicializar();
            });

            this.cargarDatosX().then(() => {
                this.inicializarX();
            });
        }

        public async cargarDatos() {
            try {
                const response = await fetch("http://127.0.0.1:5500/bin/usuarios.json");
                this.data = await response.json();
                for (let i = 0; i < this.data.length; i++) {
                    const item = this.data[i];
                    const usuarioNuevo: iUsuario = {
                        id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                        nombre: item.nombre ? String(item.nombre) : "No existe",
                        edad: item.edad !== undefined && item.edad !== null ? Number(item.edad) : 0
                    }
                    this.usuarios.set(usuarioNuevo.id, usuarioNuevo);
                }
                this.alturaTotal = this.data.length * this.alturaItem;
                console.log("Altura total del contenedor", this.alturaTotal)
            } catch {
                console.log("Datos no cargados")
            }
        }

        private inicializar() {
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
            this.contenedorY.on("scroll", (event: any) => {
                const scrollTop = event.target.scrollTop;

                console.log("valor de scroll", scrollTop)
                this.actualizarLista(scrollTop);
            })
        }

        private actualizarLista(scrollTop: number) {
            const miClase = this;
            // scrollTop son los px que se desplazo  
            const inicio = Math.floor(scrollTop / this.alturaItem);
            //redondea a un entero mas cercano 
            const numRenderizar = Math.ceil(this.alturaVisible / this.alturaItem)
            //final de los elementos visibles, sin pasarse del total del arreglo
            const fin = Math.min(inicio + numRenderizar, this.data.length);
     
            console.log("Numero de datos a mostrar", numRenderizar)
            console.log("Renderizando elementos de", inicio, "a", fin);

            //Obtener solo los usuarios visibles map a arreglo 
            const datosVisibles = Array.from(this.usuarios.values()).slice(inicio, fin);

            // Selección de los elementos div.item y unión con los datos
            const items = this.listaVirtual
                .selectAll("div.item")
                .data(datosVisibles, (d: iUsuario) => d.id); // key = id

            items.enter()
                .append("div")
                .attr("class", "item")
                .style("position", "absolute")
                .style("height", `${this.alturaItem}px`)
                .style("width", "100%")
                // se pasa el dato del valor y el indice 
                .each(function (d, i) {
                    const g = d3.select(this); // 'this' es el div actual(cada dato)
                    console.log("esto es i en enter", i)
                     
                    console.log("esto es this en enter", this)
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

        public async cargarDatosX() {
            try {
                const response = await fetch("http://127.0.0.1:5500/bin/usuarios.json");
                this.data = await response.json();
                for (let i = 0; i < this.data.length; i++) {
                    const item = this.data[i];
                    const usuarioNuevo: iUsuario = {
                        id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                        nombre: item.nombre ? String(item.nombre) : "No existe",
                        edad: item.edad !== undefined && item.edad !== null ? Number(item.edad) : 0
                    }
                    this.usuarios.set(usuarioNuevo.id, usuarioNuevo);
                }
                this.alturaTotalX = this.data.length * this.alturaItemX;
                console.log("Altura total del contenedor", this.alturaTotalX)

            } catch {
                console.log("Datos no cargados")
            }
        }

        private inicializarX() {
            this.contenedorX = d3.select("body")
                .append("div")
                .style("width", "400px")
                
                .style("height", `${this.alturaVisibleX}px`)
                .style("overflow-x", "scroll")
                .style("border", "1px solid #999")
                .style("position", "relative")
            // .style("background-color", "red")

            this.listaVirtualX = this.contenedorX.append("div")
                .style("width", `${this.alturaTotalX}px`)
                .style("flex-direction", "row")

            console.log("Creando lista con altura:", this.alturaTotalX);

            this.contenedorX.on("scroll", (event: any) => {
                const scrollLeft = event.target.scrollLeft;
                this.actualizarListaX(scrollLeft);
            })
        }

        private actualizarListaX(scrollLeft: number) {
            const miClase = this;
            const inicio = Math.floor(scrollLeft / this.alturaItemX);
            const numRenderizar = Math.ceil(this.alturaVisibleX / this.alturaItemX);

            const fin = Math.min(inicio + numRenderizar, this.data.length);
            // const fin = Math.min(inicio + Math.ceil(this.datosRenderizar),this.data.length);

            console.log("Numero de datos a mostrar", numRenderizar)
            console.log("Renderizando elementos de", inicio, "a", fin);

            //Obtener solo los usuarios visibles
            const datosVisibles = Array.from(this.usuarios.values()).slice(inicio, fin);

            // Selección de los elementos div.item y unión con los datos
            const items = this.listaVirtualX
                .selectAll("div.itemx")
                .data(datosVisibles, (d: iUsuario) => d.id); // key = id

            items.enter()
                .append("div")
                .attr("class", "itemx")
                .style("position", "absolute")
                .style("top", "0px")
                .style("width", `${this.alturaItemX}px`)

                // se pasa el dato del valor y el indice 
                .each(function (d, i) {
                    const g = d3.select(this); // 'this' es el div actual

                    console.log("esto es this en enter", this)
                    // Posición vertical usando translateY
                    g.style("transform", `translateX(${(inicio + i) * miClase.alturaItemX}px)`);
                    // Estilos opcionales
                    g.style("background-color", "#e99ee9ff")
                        .style("padding", "10px")

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
}