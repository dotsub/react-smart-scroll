import {act} from 'react-dom/test-utils';
import {JSDOM} from 'jsdom';
import {mount} from 'enzyme';
import PropTypes from 'prop-types';
import React from 'react';
import ReactSmartScroll from './index';

new JSDOM(
    '<!doctype html><html lang="en"><body><div id="root"/></body></html>'
);

const simulateEnoughSpaceForCues = actualNode =>
    act(() => {
        // Simulate enough space in viewport
        // @ts-ignore
        actualNode
            .find('.sbte-smart-scroll')
            .at(1)
            .getDOMNode().getBoundingClientRect = jest.fn(() => ({
            bottom: 500,
            height: 500,
            left: 0,
            right: 500,
            top: 0,
            width: 500,
        }));
        window.dispatchEvent(new Event('resize')); // trigger smart scroll space re-calculation
    });

const TestRow = props => (
    <div ref={props.rowRef} onClick={() => props.onClick(props.rowIndex)}>
        <div>{JSON.stringify(props.data)}</div>
        <div>{props.rowIndex}</div>
        <div>{JSON.stringify(props.rowProps)}</div>
    </div>
);

TestRow.propTypes = {
    data: PropTypes.object,
    onClick: PropTypes.func,
    rowIndex: PropTypes.number,
    rowProps: PropTypes.object,
    rowRef: PropTypes.object,
};

describe('ReactSmartScroll', () => {
    it('does not scroll to top when startAt is changed', () => {
        // GIVEN
        const expectedNode = mount(
            <div className="sbte-smart-scroll" style={{overflow: 'auto'}}>
                <div style={{paddingBottom: '0px', paddingTop: '200px'}}>
                    <div>
                        <div>{'{"name":"row5"}'}</div>
                        <div>4</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row6"}'}</div>
                        <div>5</div>
                        <div>null</div>
                    </div>
                </div>
            </div>
        );
        const actualNode = mount(
            <ReactSmartScroll
                className="sbte-smart-scroll"
                data={[
                    {name: 'row1'},
                    {name: 'row2'},
                    {name: 'row3'},
                    {name: 'row4'},
                    {name: 'row5'},
                    {name: 'row6'},
                ]}
                onClick={() => {}}
                row={TestRow}
                rowHeight={50}
                rowProps={null}
                startAt={0}
            />
        );
        simulateEnoughSpaceForCues(actualNode);

        // WHEN
        actualNode.setProps({startAt: 4});

        // THEN
        expect(actualNode.html()).toEqual(expectedNode.html());
    });
});
