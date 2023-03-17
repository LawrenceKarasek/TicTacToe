import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Board from "./Board";

describe("Board is rendered correctly", () => {
  it("renders the Board and displays correct number of cells", async () => {
    render(<Board />);
    const clearButton = await screen.findByText("Clear Board");
    expect(clearButton).toBeDefined();
    const cells = await screen.findAllByRole("cell");
    expect(cells).toHaveLength(9);
  });
});

describe("selecting 3 X's or O's in a row results in winning", () => {
  let cellList = null;
  let cellButton = null;
  let clearButton = null;

  it("3 X's in a row result in winning", async () => {
    render(<Board />);

    await waitFor(async () => {
      cellList = await screen.findAllByRole("cell");
      cellButton = cellList[0];
    });

    fireEvent.click(cellButton);

    await waitFor(async () => {
      const updatedFirstButton = await screen.findByText("X");
      expect(updatedFirstButton).not.toBeNull();
    });

    cellButton = cellList[1];
    fireEvent.click(cellButton);

    await waitFor(async () => {
      const updatedButtons = await screen.findAllByText("X");
      expect(updatedButtons).toHaveLength(2);
    });

    cellButton = cellList[2];
    fireEvent.click(cellButton);

    await waitFor(async () => {
      const updatedButtons = await screen.findAllByText("X");
      expect(updatedButtons).toHaveLength(3);
    });

    await waitFor(async () => {
      const wonButton = await screen.findByText("YOU WON!!");
      expect(wonButton).toBeDefined();
    });

    await waitFor(async () => {
      clearButton = await screen.findByText("Clear Board");
    });

    fireEvent.click(clearButton);

    await waitFor(async () => {
      cellList = await screen.findAllByRole("cell");
      cellButton = cellList[0];
      expect(cellButton).toHaveValue("");
    });
  });
});
