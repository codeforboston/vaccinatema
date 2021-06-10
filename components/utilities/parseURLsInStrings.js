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

/**
 * Given a string that contains URLs, returns an array that turns the URLs into hyperlinks
 * so when you use the output of this function in a React layout, the URLs will be clickable
 * 
 * Based on example code/regex from https://www.npmjs.com/package/react-process-string
 * 
 * @return array
 */
const parseURLsInStrings = text => {
    let config = [{
        regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.)/gim,
        fn: firstParser
    }, {
        regex: /(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.)/gim,
        fn: secondParser
    }];
    return processString(config)(text);
};

export default parseURLsInStrings;
