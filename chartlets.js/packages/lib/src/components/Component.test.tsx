import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Component, type ComponentProps } from "./Component";
import { registry } from "@/components/registry";
import type { FC } from "react";

describe("Component", () => {
  beforeEach(() => {
    registry.clear();
  });

  afterEach(() => {
    registry.clear();
  });

  it("should not render unknown Component types", () => {
    const boxProps = {
      type: "Box",
      id: "bx",
      children: ["Hello!", "World!"],
      onChange: () => {},
    };
    render(<Component {...boxProps} />);
    // to inspect rendered component, do:
    // expect(document.body).toEqual({});
    expect(document.querySelector("#bx")).toBe(null);
  });

  it("should render a known component", () => {
    interface DivProps extends ComponentProps {
      text: string;
    }
    const Div: FC<DivProps> = ({ text }) => <div>{text}</div>;
    registry.register("Div", Div as FC<ComponentProps>);
    const divProps = {
      type: "Div",
      id: "root",
      text: "Hello!",
      onChange: () => {},
    };
    render(<Component {...divProps} />);
    // to inspect rendered component, do:
    // expect(document.body).toEqual({});
    expect(screen.getByText("Hello!")).not.toBeUndefined();
  });
});
