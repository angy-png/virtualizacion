var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var pruebaControl;
(function (pruebaControl) {
    class cPruebaControl {
        constructor() {
            this.usuarios = new Map();
            this.data = [];
            this.alturaItem = 23;
            this.cargarDatos().then(() => {
                this.divContenedor();
                // this.divContenedorx(); 
            });
        }
        divContenedor() {
            this._controlV = new cvirtualizacion.cVirtualizacion({
                id: "Ventana-scroll",
                alturaItem: this.alturaItem,
                posicion: cvirtualizacion.posicion.vertical,
                ancho: 400,
                alto: 400,
                colorFondo: "pink",
                divContenedor: d3.select("body")
            });
            this._controlV.ObtenerDatos(this.data);
            this._conten = this._controlV.contenedor;
        }
        //  public divContenedorx(){
        //     this._controlV = new cvirtualizacion.cVirtualizacion({
        //         id: "Ventana-scroll",
        //         alturaItem: this.alturaItem,
        //         posicion: cvirtualizacion.posicion.horizontal, 
        //         ancho: 400,
        //         alto: 400,
        //         alturaDatos: this.alturaTotal, 
        //         colorFondo: "pink"
        //     });
        //     this._controlV.ObtenerDatos(this.data)
        //     this._conten = this._controlV.contenedor;
        // }
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
                }
                catch (_a) {
                    console.log("Datos no cargados");
                }
            });
        }
    }
    pruebaControl.cPruebaControl = cPruebaControl;
})(pruebaControl || (pruebaControl = {}));
//# sourceMappingURL=controlPrueba.js.map