import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";
import Quote from "../components/Quote";
import { rest } from "msw";

const TIMEOUT = 10000; // ms

const renderQuote = () => render(<Quote />);

it("render a quote on loaded", async () => {
  server.use(
    rest.get("https://api.quotable.io/random", (_req, res, ctx) => {
      return res(
        ctx.json({
          _id: "WkOl1qSWFoz9",
          tags: ["famous-quotes", "wisdom"],
          content:
            "Kindness is more important than wisdom, and the recognition of this is the beginning of wisdom.",
          author: "Theodore Isaac Rubin",
          authorSlug: "theodore-isaac-rubin",
          length: 95,
          dateAdded: "2021-05-05",
          dateModified: "2021-05-05",
        })
      );
    })
  );
  renderQuote();

  expect(await screen.findByText("Theodore Isaac Rubin")).toBeInTheDocument();
});

it(
  "render a different quote every 5 seconds",
  async () => {
    server.use(
      rest.get("https://api.quotable.io/random", (_req, res, ctx) => {
        return res(
          ctx.json({
            _id: "WkOl1qSWFoz9",
            tags: ["famous-quotes", "wisdom"],
            content:
              "Kindness is more important than wisdom, and the recognition of this is the beginning of wisdom.",
            author: "Theodore Isaac Rubin",
            authorSlug: "theodore-isaac-rubin",
            length: 95,
            dateAdded: "2021-05-05",
            dateModified: "2021-05-05",
          })
        );
      })
    );
    renderQuote();

    expect(await screen.findByText("Theodore Isaac Rubin")).toBeInTheDocument();
    screen.debug();

    server.use(
      rest.get("https://api.quotable.io/random", (_req, res, ctx) => {
        return res(
          ctx.json({
            _id: "zbvj3SIQud",
            tags: ["inspirational"],
            content:
              "I think people who are creative are the luckiest people on earth. I know that there are no shortcuts, but you must keep your faith in something Greater than you and keep doing what you love. Do what you love, and you will find the way to get it out to the world.",
            author: "Judy Collins",
            authorSlug: "judy-collins",
            length: 262,
            dateAdded: "2021-05-05",
            dateModified: "2021-06-17",
          })
        );
      })
    );

    await waitFor(
      () => {
        screen.debug();
        expect(screen.getByText("Judy Collins")).toBeInTheDocument();
      },
      { timeout: TIMEOUT }
    );
  },
  TIMEOUT
);
