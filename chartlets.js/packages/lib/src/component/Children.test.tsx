import type { FC } from "react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { registry } from "@/component/Registry";
import { type ComponentProps } from "./Component";
import { Children } from "./Children";

describe("Children", () => {
  beforeEach(() => {
    registry.clear();
  });

  afterEach(() => {
    registry.clear();
  });

  function expectDocumentIsEmpty() {
    // Note, the following 3 lines test that document is empty
    // but there is always one empty "div" in it.
    expect(document.body.firstElementChild).not.toBe(null);
    expect(document.body.firstElementChild!.tagName).toBe("DIV");
    expect(document.body.firstElementChild!.firstElementChild).toBe(null);
  }

  it("should not render undefined nodes", () => {
    render(<Children onChange={() => {}} />);
    expectDocumentIsEmpty();
  });

  it("should not render empty nodes", () => {
    render(<Children nodes={[]} onChange={() => {}} />);
    expectDocumentIsEmpty();
  });

  it("should render all child types", () => {
    interface DivProps extends ComponentProps {
      text: string;
    }
    const Div: FC<DivProps> = ({ text }) => <div>{text}</div>;
    registry.register("Div", Div as FC<ComponentProps>);
    const divProps = {
      type: "Div",
      text: "Hello",
      onChange: () => {},
    };
    render(
      <Children
        nodes={[
          divProps, // ok, regular component
          "World", // ok, text
          null, // ok, not rendered
          undefined, // ok, not rendered
          <div />, // not ok, emits warning, not rendered
        ]}
        onChange={() => {}}
      />,
    );
    // to inspect rendered component, do:
    // expect(document.body).toEqual({});
    expect(screen.getByText("Hello")).not.toBeUndefined();
    expect(screen.getByText("World")).not.toBeUndefined();
  });
});
