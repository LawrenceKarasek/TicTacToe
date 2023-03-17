export const getData = () => {
  return new Promise((resolve, reject) => {
    try {
      if (data) {
        resolve(data);
      } else {
        reject("No data is available.");
      }
    } catch (e) {
      reject("An error occurred fetching data:" + e);
    }
  });
};

const data = [
  {
    row: 1,
    column: 1,
    state: null,
  },
  {
    row: 1,
    column: 2,
    state: null,
  },
  {
    row: 1,
    column: 3,
    state: null,
  },
  {
    row: 2,
    column: 1,
    state: null,
  },
  {
    row: 2,
    column: 2,
    state: null,
  },
  {
    row: 2,
    column: 3,
    state: null,
  },
  {
    row: 3,
    column: 1,
    state: null,
  },
  {
    row: 3,
    column: 2,
    state: null,
  },
  {
    row: 3,
    column: 3,
    state: null,
  },
];
