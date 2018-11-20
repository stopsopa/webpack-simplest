
// import _ from 'lodash';

function component() {
    let element = document.createElement('div');

    const test = element.innerText;

    // Lodash, currently included via a script, is required for this line to work
    // element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

document.body.appendChild(component());
document.body.appendChild(component());