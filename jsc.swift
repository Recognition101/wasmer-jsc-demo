import Foundation
import JavaScriptCore

var output = ""

func runJsc() -> String {
    guard let url = Bundle.main.url(forResource: "./output", withExtension: "js") else {
        return "URL Could Not Be Constructed"
    }
    guard let data = try? Data(contentsOf: url) else {
        return "Could Not Read File"
    }
    let content = String(decoding: data, as: UTF8.self)
    
    let context = JSContext()!
    context.evaluateScript(
        "const global = (() => this)();" +
        "global.jscp = { };" +
        "global.document = { baseURI: \"/\" };")
    
    let gateway = context.objectForKeyedSubscript("jscp" as NSString)
    gateway?.setObject(isDone, forKeyedSubscript: "done" as NSString)
    
    context.evaluateScript(content)
    
    return "Success"
}

let isDone: @convention(block) (String) -> String = { (arg) in
    output = arg
    print(arg)
    return ""
}
