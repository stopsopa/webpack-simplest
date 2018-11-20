
import './test.css'

import React from 'react';

import { render } from 'react-dom';

const c = {
    one: 'two',
    test : 'eight'
};

const k = {
    ...c,
    three: 'four'
}

const Root = () => (
    <div>React works...</div>
);

render(<Root />, document.getElementById('app'));



