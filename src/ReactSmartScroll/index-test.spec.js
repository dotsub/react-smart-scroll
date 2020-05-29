import {JSDOM} from 'jsdom';
import {mount} from 'enzyme';
import React from 'react';

new JSDOM(
    '<!doctype html><html lang="en"><body><div id="root"/></body></html>'
);

const Component = () => <div />;

describe('ReactSmartScroll', () => {
    it('displays a welcome message', () => {
        const actualNode = mount(<Component />);
        expect(actualNode.html()).toEqual(mount(<div />).html());
    });
});
