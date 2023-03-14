import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  Fragment,
} from "react";
import { getData } from "../Data";
import Cell from "./Cell";
import "../styles.css";

const Board = () => {
  const [cells, setCells] = useState();
  const wonRef = useRef(false);

  const fetchData = useCallback(async () => {
    const response = await getData();
    wonRef.current = false;
    setCells(response);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const checkRowsColumnsWon = (type, number, state) => {
    let wonRowsColumns = false;
    let rowCount = 0;

    switch (type) {
      case "row":
        wonRowsColumns = cells.reduce((isWon, f) => {
          rowCount =
            f.row === number && f.state === state ? rowCount + 1 : rowCount;
          return (isWon = isWon || rowCount === 3);
        }, false);
        break;
      case "column":
        wonRowsColumns = cells.reduce((isWon, f) => {
          rowCount =
            f.column === number && f.state === state ? rowCount + 1 : rowCount;
          return (isWon = isWon || rowCount === 3);
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
          return (isWon = isWon || rowCount === 3);
        }, false);
        if (!wonRowsColumns) {
          wonRowsColumns = cells.reduce((isWon, f) => {
            rowCount =
              (f.row === 3 && f.column === 3 && f.state === state) ||
              (f.row === 2 && f.column === 2 && f.state === state) ||
              (f.row === 3 && f.column === 1 && f.state === state)
                ? rowCount + 1
                : rowCount;
            return (isWon = isWon || rowCount === 3);
          }, false);
        }
        break;
      default:
        wonRowsColumns = false;
        break;
    }
    return wonRowsColumns;
  };

  const clearBoard = () => {
    wonRef.current = false;
    fetchData();
  };

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

  const writeCellRow = (row) => {
    const rowsFiltered = cells.filter((f) => f.row === row);
    const rowData = rowsFiltered.map((item) => (
      <Cell
        cellData={item}
        key={item.row + "_" + item.column}
        updateCell={updateCell}
      />
    ));

    return rowData;
  };

  return (
    <Fragment>
      <h1 className="header"> Board </h1>
      <h2 className="won"> {wonRef.current === true && "YOU WON!!"} </h2>
      {cells && (
        <Fragment>
          <div className="board" data-testid="game-board">
            <div className="cellRow">{writeCellRow(1)}</div>
            <div className="cellRow">{writeCellRow(2)}</div>
            <div className="cellRow">{writeCellRow(3)}</div>
          </div>
          <div>
            <button data_testid="clear-button" onClick={() => clearBoard()}>
              Clear Board
            </button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Board;
