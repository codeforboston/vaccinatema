import React from 'react';
import processString from 'react-process-string';

const firstParser = (key, result) => (
  <span key={key}>
    <a target="_blank" rel="noreferrer" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>{result[2]}.{result[3]}{result[4]}</a>{result[5]}
  </span>
);

const secondParser = (key, result) => (
  <span key={key}>
    <a target="_blank" rel="noreferrer" href={`http://${result[1]}.${result[2]}${result[3]}`}>{result[1]}.{result[2]}{result[3]}</a>{result[4]}
  </span>
);

const parseBookAppointmentString = text => {
  let config = [{
    regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.)/gim,
    fn: firstParser
  }, {
    regex: /(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.)/gim,
    fn: secondParser
  }];
  return processString(config)(text);
};

export default parseBookAppointmentString;