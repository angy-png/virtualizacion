namespace pruebaControl{
      interface iUsuario {
        id: number;
        nombre: string;
        edad: number;
    }

    export class cPruebaControl{
        private _controlV: cvirtualizacion.cVirtualizacion; 
        private _conten: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

        private usuarios: Map<number, iUsuario> = new Map();
        private data: iUsuario[] = [];
        private alturaItem = 50; 
        private alturaTotal = 0;  

        constructor(){
            this.cargarDatos().then(()=>{
                // this.divContenedor();  
                this.divY(); 
            })
        }
        public divY(){
            this._controlV = new cvirtualizacion.cVirtualizacion({
                id:"scroll vertical",
                alturaItem: this.alturaItem,
                posicion: cvirtualizacion.posicion.horizontal,
                ancho: 300,
                alto: 500,
                alturaTotal: this.alturaTotal,
                colorFondo: "pink",
                divContenedor: d3.select(".pruebaY")
            });
            this._controlV.ObtenerDatos(this.data)
            this._conten = this._controlV.contenedor
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
                  console.log("Altura total: ", this.alturaTotal)
               
            } catch {
                console.log("Datos no cargados")
            }
        }
    }
}  