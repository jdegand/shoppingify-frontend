import { rest } from "msw";

export const handlers = [
  rest.post("http://localhost:3500/auth", (req, res, ctx) => {
    return res(ctx.cookie("jwt", "abc-123"));
  }),
];
