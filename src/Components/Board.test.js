import { render, screen, waitFor, fireEvent} from "@testing-library/react";
import Board from "./Board";

/* function setup() {
  render(<Board />);
}
 */

describe("Board is rendered correctly", () => {
  it("renders the Board", async () => {
    render(<Board />);
    await waitFor(() => {
        expect(screen.getByText("Clear Board")).toBeDefined();
    });
  });

    it("Board displays correct number of cells", async () => {
    render(<Board />);
    await waitFor(() => {
        const cells = screen.getAllByRole("cell");
        expect(cells).toHaveLength(9);
    });
  });  
});
 
 describe("cell click events work correctly", () => { 
  it("Clicking button changes values to X then O then null", async () => {
    render(<Board />);

    let cellList = null;
    let cellButton = null;

    await waitFor( async () => {
        cellList = screen.getAllByRole('cell');        
        cellButton = cellList[0];
        fireEvent.click(cellButton);
        const updatedXButton = await screen.findByText('X');
        expect(updatedXButton).not.toBeNull;
    });
    await waitFor( async () => {
      fireEvent.click(cellButton);
      const updatedOButton = await screen.findByText('O');
      expect(updatedOButton).not.toBeNull;
    });

  });
}); 


 describe("selecting 3 X's or O's in a row results in winning", () => { 
  it("3 X's in a row result in winning", async () => {
    render(<Board />);

    let cellList = null;
    let cellButton = null;
    await waitFor(async () => {
      cellList = screen.getAllByRole('cell');
      cellButton = cellList[0];
      fireEvent.click(cellButton);

      const updatedFirstButton = await screen.findByText('X');
      expect(updatedFirstButton).not.toBeNull;      
    });

    await waitFor(async () => {
      cellButton = cellList[1];
      fireEvent.click(cellButton);
      const updatedButtons = await screen.findAllByText('X');
      expect(updatedButtons).toHaveLength(2);
    })
    
    await waitFor(async () => {
      cellButton = cellList[2];
      fireEvent.click(cellButton);
      const updatedButtons = await screen.findAllByText('X');
      expect(updatedButtons).toHaveLength(3); 
    })

    await waitFor(async () => {
      expect(screen.getByText("YOU WON!!")).toBeDefined();
    }) 


  });
});  
 