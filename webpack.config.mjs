import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: 'development',
    entry: path.resolve(__dirname, './index.js'),
    externals: { 'wasmer_wasi_js_bg.wasm': true },
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'output.js'
    }
};
