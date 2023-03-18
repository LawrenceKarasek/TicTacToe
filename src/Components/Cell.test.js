import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cell from "./Cell";

const cellData = {
  row: 1,
  column: 1,
  state: "X",
};

describe("Cell is rendered correctly", () => {
  const updateCell = jest.fn();
  let cellButton = null;

  it("renders the Cell correctly", async () => {
    render(
      <Cell
        cellData={cellData}
        key={cellData.row + "_" + cellData.column}
        updateCell={updateCell}
      />
    );

    await waitFor(async () => {
      cellButton = await screen.findByText("X");
      expect(cellButton).toBeDefined();
    });
  });

  it("clicking Cell calls update ", async () => {
    let cellButton = null;
    render(
      <Cell
        cellData={cellData}
        key={cellData.row + "_" + cellData.column}
        updateCell={updateCell}
      />
    );

    await waitFor(async () => {
      cellButton = await screen.findByText("X");
      expect(cellButton).not.toBeNull();
    });

    fireEvent.click(cellButton);

    await waitFor(async () => {
      expect(updateCell).toHaveBeenCalledTimes(1);
    });
  });
});
