import { expect, test } from "vitest";
import {
  BoxModel,
  ButtonModel,
  ComponentModel,
  ContainerModel,
  getComponentPath,
} from "./component";

test("shallow", () => {
  const model: ComponentModel = {
    type: "Button",
    id: "a",
  };
  expect(getComponentPath(model, "a")).toEqual([]);
  expect(getComponentPath(model, "b")).toBeUndefined();
});

test("nested-1", () => {
  const model: ContainerModel = {
    type: "Box",
    id: "a",
    components: [
      {
        type: "Button",
        id: "b",
      },
      {
        type: "Button",
        id: "c",
      },
    ],
  };
  expect(getComponentPath(model, "a")).toEqual([]);
  expect(getComponentPath(model, "b")).toEqual(["components", 0]);
  expect(getComponentPath(model, "c")).toEqual(["components", 1]);
  expect(getComponentPath(model, "d")).toBeUndefined();
});

test("nested-2", () => {
  const model: ContainerModel = {
    type: "Box",
    id: "a",
    components: [
      {
        type: "Button",
        id: "b",
      },
      {
        type: "Box",
        id: "c",
        components: [
          {
            type: "Button",
            id: "d",
          },
          {
            type: "Button",
            id: "e",
          },
        ],
      } as ContainerModel,
    ],
  };
  expect(getComponentPath(model, "a")).toEqual([]);
  expect(getComponentPath(model, "b")).toEqual(["components", 0]);
  expect(getComponentPath(model, "c")).toEqual(["components", 1]);
  expect(getComponentPath(model, "d")).toEqual([
    "components",
    1,
    "components",
    0,
  ]);
  expect(getComponentPath(model, "e")).toEqual([
    "components",
    1,
    "components",
    1,
  ]);
  expect(getComponentPath(model, "f")).toBeUndefined();
});
