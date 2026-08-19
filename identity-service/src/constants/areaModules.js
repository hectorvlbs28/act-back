// Whitelist de módulos que un área puede habilitar. Al agregar módulos futuros
// (Inventario, Calendario, Bitácora) solo hace falta extender este arreglo.
const AVAILABLE_MODULES = ['password_manager'];

// Password Manager viene habilitado por defecto en toda área nueva, por ser función "core".
const DEFAULT_MODULES = ['password_manager'];

module.exports = { AVAILABLE_MODULES, DEFAULT_MODULES };
