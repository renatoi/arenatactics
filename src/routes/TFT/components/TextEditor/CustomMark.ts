interface That {
  readonly Parser: Function;
  readonly Compiler: Function;
}
function CustomMarkPlugin(
  this: That,
  { beginMarker = "[[", endMarker = "]]" } = {}
) {
  function inlineTokenizer(eat: Function, value: string, silent?: boolean) {
    const keepBegin = value.indexOf(beginMarker);
    const keepEnd = value.indexOf(endMarker);
    if (keepBegin !== 0 || keepEnd === -1) return;

    /* istanbul ignore if - never used (yet) */
    if (silent) return true;

    const processedValue = value.substring(beginMarker.length, keepEnd);
    const split =
      processedValue.indexOf("=") > 0 ? processedValue.split("=") : undefined;

    const identifier = Array.isArray(split) ? split[0] : processedValue;
    const param = Array.isArray(split) ? split[1] : undefined;

    return eat(beginMarker + processedValue + endMarker)({
      type: "customMark",
      value: processedValue,
      identifier,
      param
    });
  }

  inlineTokenizer.locator = (value: string, fromIndex: number) => {
    return value.indexOf(beginMarker, fromIndex);
  };

  const Parser = this.Parser;

  // Inject inlineTokenizer
  const inlineTokenizers = Parser.prototype.inlineTokenizers;
  const inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.customMark = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf("text"), 0, "customMark");

  const Compiler = this.Compiler;
  if (Compiler) {
    const visitors = Compiler.prototype.visitors;
    if (!visitors) return;
    visitors.customMark = (node: any) => {
      return node.data.blackedOut;
    };
  }
}

export default CustomMarkPlugin;
