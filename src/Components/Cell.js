import React from 'react';
import PropTypes from 'prop-types';
import '../styles.css';

const Cell = ({ cellData, updateCell }) => {
  return (
    <button className='cell' onClick={() => updateCell(cellData)}>
      <span className='cellText'>{cellData.state}</span>
    </button>
  );
};

Cell.propTypes = {
    cellData: PropTypes.object,
    updateCell: PropTypes.func,
  };

export default Cell;
