import * as React from "react";
import { render, screen } from "@testing-library/react";
import { AuthContext } from "../context/AuthProvider";

/**
 * Test default values by rendering a context consumer without a
 * matching provider
 */
test("AuthContext shows default value", () => {
  render(<AuthContext />);
  expect(screen.getByText(/^My Name Is:/)).toHaveTextContent(
    "My Name Is: Unknown"
  );
});

/**
 * To test a component tree that uses a context consumer but not the provider,
 * wrap the tree with a matching provider
 */
test("AuthContext shows value from provider", () => {
  render(<AuthContext />);
  expect(screen.getByText(/^My Name Is:/)).toHaveTextContent(
    "My Name Is: C3P0"
  );
});

/**
 * A tree containing both a providers and consumer can be rendered normally
 */
test("NameProvider/Consumer shows name of character", () => {
  render(<AuthContext />);
  expect(screen.getByText(/^My Name Is:/).textContent).toBe(
    "My Name Is: Leia Organa"
  );
});
