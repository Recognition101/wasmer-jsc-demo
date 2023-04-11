require("fastestsmallesttextencoderdecoder");
globalThis.Buffer = require("buffer").Buffer;

const wasiModule = require("@wasmer/wasi");

// Most of this function is just copied from:
// https://github.com/wasmerio/wasmer-js/blob/main/examples/node/helloworld.mjs
const main = async () => {
    await wasiModule.init();
    const wasi = new wasiModule.WASI({ env: { }, args: [ ] });

    // These bytes are read from:
    // https://github.com/wasmerio/wasmer-js/blob/main/tests/demo.wasm
    const buf = new Uint8Array([
        0,97,115,109,1,0,0,0,1,12,2,96,4,127,127,127,127,1,127,96,0,0,2,26,1,
        13,119,97,115,105,95,117,110,115,116,97,98,108,101,8,102,100,95,119,
        114,105,116,101,0,0,3,2,1,1,5,3,1,0,1,7,19,2,6,109,101,109,111,114,121,
        2,0,6,95,115,116,97,114,116,0,1,10,29,1,27,0,65,0,65,8,54,2,0,65,4,65,
        12,54,2,0,65,1,65,0,65,1,65,20,16,0,26,11,11,18,1,0,65,8,11,12,104,101,
        108,108,111,32,119,111,114,108,100,10
    ]);

    const module = await WebAssembly.compile(buf);
    await wasi.instantiate(module, {});

    const exitCode = wasi.start();
    const stdout = wasi.getStdoutString();
    if (typeof jscp !== "undefined") {
        jscp.done(`${stdout}(exit code: ${exitCode})`);
    }
    console.log(`${stdout}(exit code: ${exitCode})`);
};

main();
