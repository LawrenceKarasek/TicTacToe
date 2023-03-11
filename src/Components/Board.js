import React, { useEffect, useState, useCallback, useRef,Fragment } from 'react';
import { getData } from '../Data';
import Cell from './Cell';
import '../styles.css';

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
      isWin = checkRowsColumnsWon('row', x, 'X');
      if (isWin) {
        break;
      }
      isWin = checkRowsColumnsWon('row', x, 'O');
      if (isWin) {
        break;
      }
      isWin = checkRowsColumnsWon('column', x, 'X');
      if (isWin) {
        break;
      }
      isWin = checkRowsColumnsWon('column', x, 'O');
      if (isWin) {
        break;
      }
    }
    if (!isWin) {
      isWin = checkRowsColumnsWon('diagonal', null, 'X');
      if (!isWin) {
        isWin = checkRowsColumnsWon('diagonal', null, 'O');
      }
    }
    if (isWin) {
        wonRef.current = true;
    }
  };

  const checkRowsColumnsWon = (type, number, state) => {
    let wonRowsColumns;
    console.log('checkRowsColumnsWon type ' + type);

    if (type === 'row') {
      wonRowsColumns = cells.filter((f) => f.row === number && f.state === state);
    } else if (type === 'column') {
      wonRowsColumns = cells.filter((f) => f.column === number && f.state === state);
    } else if (type === 'diagonal') {
      console.log('diagonal before ' + JSON.stringify(wonRowsColumns));
      wonRowsColumns = cells.filter(
        (f) =>
          (f.row === 1 && f.column === 1 && f.state === state) ||
          (f.row === 2 && f.column === 2 && f.state === state) ||
          (f.row === 3 && f.column === 3 && f.state === state)
      );

      console.log('diagonal after ' + JSON.stringify(wonRowsColumns));

      if (wonRowsColumns < 3) {
        cells.filter(
          (f) =>
            (f.row === 3 && f.column === 3 && f.state === state) ||
            (f.row === 2 && f.column === 2 && f.state === state) ||
            (f.row === 3 && f.column === 1 && f.state === state)
        );
      }
    } else {
      return false;
    }

    if (wonRowsColumns.length === 3) {
      return true;
    } else {
      return false;
    }
  };
  
  const clearBoard= () => {
    wonRef.current = false;
    fetchData();
  };

  const updateCell = (cell) => {

    let updatedState = '';
    switch (cell.state) {
      case 'X':
        updatedState = 'O';
        break;
      case 'O':
        updatedState = null;
        break;
      default:
        updatedState = 'X';
        break;
    }
    cell.state = updatedState;

    let cellFilteredIndex = cells.findIndex((c) => c.row === cell.row && c.column === cell.column);

    //console.log('cellsbeforeUpdated: ' + JSON.stringify(cells));

    let cellsCopy = [...cells];

    cellsCopy.splice(cellFilteredIndex, 1, cell);

    //console.log('cellsUpdated: ' + JSON.stringify(cellsCopy));

    setCells(cellsCopy);

    checkScore();
  };

  const writeCellRow = (row) => {
    const rowsFiltered = cells.filter((f) => f.row === row);
    const rowData = rowsFiltered.map((item) => (
      <Cell cellData={item} key={item.row + '_' + item.column} updateCell={updateCell} />
    ));

    return rowData;
  };

  return (
    <Fragment>
      <h1 className='header'> Board </h1> 
      <h2 className='won'> {wonRef.current === true && ('YOU WON!!')} </h2> 
      {cells && (
        <Fragment>
          <div className='board'>
            <div className='cellRow'>{writeCellRow(1)}</div>
            <div className='cellRow'>{writeCellRow(2)}</div>
            <div className='cellRow'>{writeCellRow(3)}</div>
          </div>
          <div><button onClick={() => clearBoard()}>Clear Board</button></div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Board;
