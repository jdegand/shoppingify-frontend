import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "../components/Login";

describe("Login Functionality", () => {
  test("label should be rendered", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const usernameLabel = screen.getByLabelText(/username/i);
    expect(usernameLabel).toBeInTheDocument();
  });

  test("password input should be rendered", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const passwordLabel = screen.getByLabelText(/password/i);
    expect(passwordLabel).toBeInTheDocument();
  });

  test("button should be rendered", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const buttonEl = screen.getByText(/sign in/i, { selector: "button" }); //screen.getByRole('button', {name: /sign in/i});
    expect(buttonEl).toBeInTheDocument();
  });

  test("username input should be empty", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const usernameLabel = screen.getByLabelText(/username/i);
    expect(usernameLabel.value).toBe("");
  });

  test("password input should be empty", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const passwordLabel = screen.getByLabelText(/password/i);
    expect(passwordLabel.value).toBe("");
  });
});
