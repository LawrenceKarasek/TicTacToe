import { render, screen, waitFor} from "@testing-library/react";
import Board from "./Board";

function setup() {
  render(<Board />);
}

describe("Board is rendered correctly", () => {
  it("renders the Board", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getByText("Clear Board")).toBeDefined();
    });
  });

  it("Board displays correct number of cells", async () => {
    setup();
    await waitFor(() => {
      const cells = document.querySelectorAll("#cell-id");
      expect(cells).toHaveLength(9);
    });
  });
});
