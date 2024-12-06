import { type ComponentChangeHandler } from "@/types/state/event";
import { type ComponentNode, isComponentState } from "@/types/state/component";
import { Component } from "./Component";

export interface ChildrenProps {
  nodes?: ComponentNode[];
  onChange: ComponentChangeHandler;
}

export function Children({ nodes, onChange }: ChildrenProps) {
  if (!nodes || nodes.length === 0) {
    return null;
  }
  return (
    <>
      {nodes.map((node, index) => {
        if (isComponentState(node)) {
          const key = node.id || index;
          return <Component key={key} {...node} onChange={onChange} />;
        } else if (typeof node === "string") {
          return node;
        } else if (!node) {
          // This is ok, just as with React, don't render
        } else {
          console.warn("chartlets: invalid child node encountered:", node);
        }
      })}
    </>
  );
}
