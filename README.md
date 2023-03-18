# Overview

In this Tic Tac Toe app, I demonstrate the use of javascript ES6 functions in a UI app inlcuding reducer, filter, map, splice and findIndex. This also includes unit testing with multiple user interactions

# Project setup

The project is bootstrapped with Create React App and also includes eslint and prettier to improve clean code.

# Project structure

Data.js:  provides aysnchronous access to json data for the board

Components:
Board and Cell components.

# Running the project

`
npm install npm start
`
Also, to check for any coding issues and correct formatting:

`
npm run eslint 
npm run format
`

# Board.js

## Loading Data

Data is loaded asynchronously using a Promise. The useEffect hook includes fetchData in its dependency array and calls the fetchData method on initial loading. To prevent unneccessary reloads, fetchData is contained in a useCallback. This ensures the fetchData function is memoized (cached). Otherwise, each time useEffect is called, a new version of the function would be created and useEffect would call fetchData again.

`

const [cells, setCells] = useState();
const fetchData = useCallback(async () => {
getData()
.then(result => setCells(result))
.catch(err => console.error(err));
}, []);

useEffect(() => {
fetchData();
}, [fetchData]);

`

The fetchData methods calls the getData function in Data.js asynchronously. Since Promises are being used with "thenable", it allows the results to be assigned to the state in setVideos.

## Data.js

The getData method in Data.js uses a Promise to asynchronously load json data using 'resolve'. If an error occurs, the Promise returns 'reject' with the error message. 

`

const getData = () => {
return new Promise((resolve, reject) => {
try{
if (data) {
resolve(data);
} else {
reject('No data is available.');
}
}
catch(e){
reject('An error occurred fetching data:' + e);
};
});
};

`
## Rendering

After the cell data is loaded into state, cells are written one row at a time. The WriteCellRow method filters the cells for each row then returns an array of cells:

`

  const writeCellRow = (row) => {
    return cells
      .filter((f) => f.row === row)
      .map((item) => (
        <Cell
          cellData={item}
          key={item.row + "_" + item.column}
          updateCell={updateCell}
        />
      ));
  };
  
`

  The UI includes a wonRef which uses the useRef webHook to maintain the status of the board between state re-renders. This was used because if this is maintained in state along with the cell state, the behavior in re-rendering the board is unpredictable. 

`

  return (
    <Fragment>
      <h1 className="header"> 'Board' </h1>
      <h2 className="won"> {wonRef.current === true && "YOU WON!!"} </h2>
      {cells && (
        <Fragment>
          <div className="board">
            <div className="cellRow">{writeCellRow(1)}</div>
            <div className="cellRow">{writeCellRow(2)}</div>
            <div className="cellRow">{writeCellRow(3)}</div>
          </div>
          <div>
            <button onClick={() => clearBoard()}>
              Clear Board
            </button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

`

## Cell.js

Each cell receives its State from the Board with a callback for updating the state.

`

const Cell = ({ cellData, updateCell }) => {
  return (
    <button className="cell" role="cell" onClick={() => updateCell(cellData)}>
      <span className="cellText">{cellData.state}</span>
    </button>
  );
};

Cell.propTypes = {
  cellData: PropTypes.object,
  updateCell: PropTypes.func,
};

`

## Updating the Cells

Cells in the Board are updated from "X" to "O" then back to null as follows. Note it is necessary to copy the initial array of cells before the state is updated using setCells to create a new reference in memory. The single cell is updated by using the array findIndex and then splice methods.

`

  const updateCell = (cell) => {
    let updatedState = "";
    switch (cell.state) {
      case "X":
        updatedState = "O";
        break;
      case "O":
        updatedState = null;
        break;
      default:
        updatedState = "X";
        break;
    }
    cell.state = updatedState;

    let cellFilteredIndex = cells.findIndex(
      (c) => c.row === cell.row && c.column === cell.column
    );

    let cellsCopy = [...cells];
    cellsCopy.splice(cellFilteredIndex, 1, cell);
    setCells(cellsCopy);
    checkScore();
  };

`

## Checking the Score

In order to check the score, each row and column plus the tewo diagonals must be checkd for both "X" and "O". This is done sequentiually using the checkRowsColumnsWon function, which takes the type of check ("row", "column" or "diagonal") and the row or coilumn number, if applicable.

`

  const checkScore = () => {
    let isWin = false;

    for (let x = 1; x <= 3; x++) {
      isWin = checkRowsColumnsWon("row", x, "X");
      if (isWin) {
        break;
      }
      isWin = checkRowsColumnsWon("row", x, "O");
      if (isWin) {
        break;
      }
      isWin = checkRowsColumnsWon("column", x, "X");
      if (isWin) {
        break;
      }
      isWin = checkRowsColumnsWon("column", x, "O");
      if (isWin) {
        break;
      }
    }
    if (!isWin) {
      isWin = checkRowsColumnsWon("diagonal", null, "X");
      if (!isWin) {
        isWin = checkRowsColumnsWon("diagonal", null, "O");
      }
    }
    if (isWin) {
      wonRef.current = true;
    }
  };

`

The checkRowsColumnsWon function uses the reduce function to return a boolean for each type of check. For eeach item in the array, reduce updates the accummulator parameter, in this case, "isWon". If the row or column number and state match, the rowCount is incremented, and isWon is set to true when the rowCount = 3.


`

  const checkRowsColumnsWon = (type, number, state) => {
    let wonRowsColumns = false;
    let rowCount = 0;

    switch (type) {
      case "row":
        wonRowsColumns = cells.reduce((isWon, f) => {
          rowCount =
            f.row === number && f.state === state ? rowCount + 1 : rowCount;
          return (isWon || rowCount === 3);
        }, false);
        break;
      case "column":
        wonRowsColumns = cells.reduce((isWon, f) => {
          rowCount =
            f.column === number && f.state === state ? rowCount + 1 : rowCount;
          return (isWon || rowCount === 3);
        }, false);
        break;
      case "diagonal":
        wonRowsColumns = cells.reduce((isWon, f) => {
          rowCount =
            (f.row === 1 && f.column === 1 && f.state === state) ||
            (f.row === 2 && f.column === 2 && f.state === state) ||
            (f.row === 3 && f.column === 3 && f.state === state)
              ? rowCount + 1
              : rowCount;
          return (isWon || rowCount === 3);
        }, false);
        if (!wonRowsColumns) {
          wonRowsColumns = cells.reduce((isWon, f) => {
            rowCount =
              (f.row === 3 && f.column === 3 && f.state === state) ||
              (f.row === 2 && f.column === 2 && f.state === state) ||
              (f.row === 3 && f.column === 1 && f.state === state)
                ? rowCount + 1
                : rowCount;
            return (isWon || rowCount === 3);
          }, false);
        }
        break;
      default:
        wonRowsColumns = false;
        break;
    }
    return wonRowsColumns;
  };

`

# Unit tests

The Board and Cell components are unit tested to verify they are properly loaded and the updating and scoring functionality is working correctly. The actual user interactions are checked using the React testing library and the .

# Board.test.js

`

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

`

## Cell.test.js

The cell is mocked to verify it is rendering correctly and the updateCell function is called. Mockingthe data for a component is less realistic then actual user interaction but necessary in many cases since a component depends on live data. 

`
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

`

# Conclusion

I hope this is helpful for those learning how to use javascript ES6 array functions such as reduce and filter effectively in front end code. I welcome your feedback to improve this article, All the Best!
