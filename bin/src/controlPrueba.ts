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
        private alturaDiv = 50; 
        
        constructor(){
            this.cargarDatos().then(()=>{
                this.virtualizado(); 
            })
        }
        public virtualizado(){
            this._controlV = new cvirtualizacion.cVirtualizacion({
                id:"scroll",
                datos: this.data, 
                alturaDiv: this.alturaDiv,
                posicion: cvirtualizacion.posicion.vertical,
                ancho: 300,
                alto: 500,
                colorFondo: "pink",
                divContenedor: d3.select(".pruebaY")
            });
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
            } catch {
                console.log("Datos no cargados")
            }
        }
    }
}  