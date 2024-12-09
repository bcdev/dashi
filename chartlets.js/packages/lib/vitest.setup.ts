import "@testing-library/jest-dom";
import { vi } from "vitest";
import { createCanvas } from "canvas";

// Mock getContext for HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((type) => {
  const canvas = createCanvas(100, 100);
  return canvas.getContext(type);
});
