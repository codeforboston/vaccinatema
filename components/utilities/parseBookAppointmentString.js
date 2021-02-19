import processString from 'react-process-string';

const parseBookAppointmentString = text => {
    let config = [{
        regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
        fn: (key, result) => <span key={key}>
                                 <a target="_blank" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>{result[2]}.{result[3]}{result[4]}</a>{result[5]}
                             </span>
    }, {
        regex: /(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
        fn: (key, result) => <span key={key}>
                                 <a target="_blank" href={`http://${result[1]}.${result[2]}${result[3]}`}>{result[1]}.{result[2]}{result[3]}</a>{result[4]}
                             </span>
    }];
    return processString(config)(text);
}

export default parseBookAppointmentString