# JSC Wasmer Demo

This demonstrates running a simple WASM program with Wasmer in JavaScriptCore (JSC).

## Demo

Clone this repository and add the `output.js` and `jsc.swift` files to an existing XCode Project. For instance, creating a default SwiftUI project, adding the two files, and replacing the `ContentView.swift` file with this...

```swift
import SwiftUI

struct ContentView: View {
    
    var status = runJsc()
    
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundColor(.accentColor)
            Text("Status: " + status)
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

...should be enough to print this result in the console:

```
hello world
(exit code: 0)
```

## How It Works

JSC, as a JS Runtime, lacks many environment functions present in NodeJS and the browser.

### Require

JSC Does not support `require` from NodeJS. To fix this, we could:

 1. Implement `require` in Swift. This would involve implementing the [NodeJS CommonJS resolution algorithm](https://nodejs.org/api/modules.html#all-together).
 2. Pre-process the JS and inline all of the `require` calls using something like [WebPack](https://webpack.js.org).

Option 1 would require quite a bit of code, so this repository opts for option 2. The `/index.js` file is built by webpack (using the `webpack.config.js` configuration), and the output is `output.js`. Note: `wasmer_wasi_js_bg.wasm` is a virtual file and must be excluded in the webpack configuration.

To build `output.js` yourself, assuming you have NodeJS installed, just run these commands in this repository:

```bash
# Only needs to be run once, to download dependencies.
npm ci
# This builds `output.js`.
npx webpack -c ./webpack.config.mjs
```

### Web API Functions

Currently, it appears that the `@wasmer/wasi` package requires at least two web/Node APIs:

 1. `Buffer` - The NodeJS Buffer data structure. We can patch this with the `buffer` NPM package using `globalThis.Buffer = require("buffer").Buffer;`
 2. `TextEncoder` / `TextDecoder` - The Web (and NodeJS) UTF-8 encoder/decoders. This can be patched with: `require("fastestsmallesttextencoderdecoder");`

### Callback

Since wasmer uses lots of `async` / `await`, we construct an `isDone` function in `jsc.swift` to print the results. The JavaScript in `index.js` can call that function by calling `jscp.done(<result>)`.
