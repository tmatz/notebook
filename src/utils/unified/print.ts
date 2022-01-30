import { inspect } from "unist-util-inspect";

export function print<Input>(...tags: string[]) {
  return (tree: Input) => {
    console.log(tags.join(" "), inspect(tree));
    return tree;
  };
}
