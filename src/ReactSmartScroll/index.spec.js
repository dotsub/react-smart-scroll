import {mount} from 'enzyme';
import {JSDOM} from 'jsdom';
import PropTypes from 'prop-types';
import React from 'react';
import {act} from 'react-dom/test-utils';
import ReactSmartScroll, {ReactSmartScrollNotMemoized} from './index';

new JSDOM(
    '<!doctype html><html lang="en"><body><div id="root"/></body></html>'
);

const simulateEnoughSpaceForCues = (actualNode, viewPortSize = 100) =>
    act(() => {
        // Simulate enough space in viewport
        // @ts-ignore
        actualNode
            .find('.sbte-smart-scroll')
            .at(1)
            .getDOMNode().getBoundingClientRect = jest.fn(() => ({
            bottom: viewPortSize,
            height: viewPortSize,
            left: 0,
            right: viewPortSize,
            top: 0,
            width: viewPortSize,
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

    it('does not configure default value for startAt property', () => {
        // WHEN
        const actualNode = mount(
            <ReactSmartScrollNotMemoized
                className="sbte-smart-scroll"
                data={[{name: 'row1'}, {name: 'row2'}]}
                onClick={() => {}}
                row={TestRow}
                rowHeight={50}
                rowProps={null}
            />
        );
        actualNode.setProps({});

        // THEN
        expect(actualNode.props().startAt).not.toEqual(0);
    });

    it('does not scroll when startAt is undefined', done => {
        // GIVEN
        const expectedNode = mount(
            <div className="sbte-smart-scroll" style={{overflow: 'auto'}}>
                <div style={{paddingBottom: '0px', paddingTop: '400px'}}>
                    <div>
                        <div>{'{"name":"row9"}'}</div>
                        <div>8</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row10"}'}</div>
                        <div>9</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row11"}'}</div>
                        <div>10</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row12"}'}</div>
                        <div>11</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row13"}'}</div>
                        <div>12</div>
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
                    {name: 'row7'},
                    {name: 'row8'},
                    {name: 'row9'},
                    {name: 'row10'},
                    {name: 'row11'},
                    {name: 'row12'},
                    {name: 'row13'},
                ]}
                onClick={() => {}}
                row={TestRow}
                rowHeight={50}
                rowProps={null}
                startAt={8}
            />
        );
        simulateEnoughSpaceForCues(actualNode);

        // WHEN
        actualNode.setProps({startAt: undefined});

        setTimeout(() => {
            // THEN
            expect(actualNode.html()).toEqual(expectedNode.html());
            done();
        }, 10);
    });

    it('scrolls when startAt is changed to value above view port', done => {
        // GIVEN
        const expectedNode = mount(
            <div className="sbte-smart-scroll" style={{overflow: 'auto'}}>
                <div style={{paddingBottom: '367px', paddingTop: '50px'}}>
                    <div>
                        <div>{'{"name":"row2"}'}</div>
                        <div>1</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row3"}'}</div>
                        <div>2</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row4"}'}</div>
                        <div>3</div>
                        <div>null</div>
                    </div>
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
                    <div>
                        <div>{'{"name":"row7"}'}</div>
                        <div>6</div>
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
                    {name: 'row7'},
                    {name: 'row8'},
                    {name: 'row9'},
                    {name: 'row10'},
                    {name: 'row11'},
                    {name: 'row12'},
                    {name: 'row13'},
                ]}
                onClick={() => {}}
                row={TestRow}
                rowHeight={50}
                rowProps={null}
                startAt={4}
            />
        );
        simulateEnoughSpaceForCues(actualNode);

        // WHEN
        actualNode.setProps({startAt: 1});

        setTimeout(() => {
            // THEN
            expect(actualNode.html()).toEqual(expectedNode.html());
            done();
        }, 10);
    });

    it('scrolls when startAt changed to value below view port', done => {
        // GIVEN
        const expectedNode = mount(
            <div className="sbte-smart-scroll" style={{overflow: 'auto'}}>
                <div style={{paddingBottom: '0px', paddingTop: '400px'}}>
                    <div>
                        <div>{'{"name":"row9"}'}</div>
                        <div>8</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row10"}'}</div>
                        <div>9</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row11"}'}</div>
                        <div>10</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row12"}'}</div>
                        <div>11</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row13"}'}</div>
                        <div>12</div>
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
                    {name: 'row7'},
                    {name: 'row8'},
                    {name: 'row9'},
                    {name: 'row10'},
                    {name: 'row11'},
                    {name: 'row12'},
                    {name: 'row13'},
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
        actualNode.setProps({startAt: 8});

        setTimeout(() => {
            // THEN
            expect(actualNode.html()).toEqual(expectedNode.html());
            done();
        }, 10);
    });

    it('does not scroll when startAt is changed to value in view port', done => {
        // GIVEN
        const expectedNode = mount(
            <div className="sbte-smart-scroll" style={{overflow: 'auto'}}>
                <div style={{paddingBottom: '167px', paddingTop: '150px'}}>
                    <div>
                        <div>{'{"name":"row4"}'}</div>
                        <div>3</div>
                        <div>null</div>
                    </div>
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
                    <div>
                        <div>{'{"name":"row7"}'}</div>
                        <div>6</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row8"}'}</div>
                        <div>7</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row9"}'}</div>
                        <div>8</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row10"}'}</div>
                        <div>9</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row11"}'}</div>
                        <div>10</div>
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
                    {name: 'row7'},
                    {name: 'row8'},
                    {name: 'row9'},
                    {name: 'row10'},
                    {name: 'row11'},
                    {name: 'row12'},
                    {name: 'row13'},
                ]}
                onClick={() => {}}
                row={TestRow}
                rowHeight={50}
                rowProps={null}
                startAt={3}
            />
        );
        simulateEnoughSpaceForCues(actualNode, 200);
        actualNode.getDOMNode().dispatchEvent(new Event('scroll'));

        // WHEN
        actualNode.setProps({startAt: 5});

        setTimeout(() => {
            // THEN
            expect(actualNode.html()).toEqual(expectedNode.html());
            done();
        }, 10);
    });

    it('use smaller view port for scrolling when we are at the top of data array', done => {
        // GIVEN
        const expectedNode = mount(
            <div className="sbte-smart-scroll" style={{overflow: 'auto'}}>
                <div style={{paddingBottom: '317px', paddingTop: '0px'}}>
                    <div>
                        <div>{'{"name":"row1"}'}</div>
                        <div>0</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row2"}'}</div>
                        <div>1</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row3"}'}</div>
                        <div>2</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row4"}'}</div>
                        <div>3</div>
                        <div>null</div>
                    </div>
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
                    <div>
                        <div>{'{"name":"row7"}'}</div>
                        <div>6</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row8"}'}</div>
                        <div>7</div>
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
                    {name: 'row7'},
                    {name: 'row8'},
                    {name: 'row9'},
                    {name: 'row10'},
                    {name: 'row11'},
                    {name: 'row12'},
                    {name: 'row13'},
                ]}
                onClick={() => {}}
                row={TestRow}
                rowHeight={50}
                rowProps={null}
                startAt={1}
            />
        );
        simulateEnoughSpaceForCues(actualNode, 200);

        // WHEN
        actualNode.setProps({startAt: 2});

        setTimeout(() => {
            // THEN
            expect(actualNode.html()).toEqual(expectedNode.html());
            done();
        }, 10);
    });

    it('does not scroll when startAt is changed from first element to second and is in viewport', done => {
        // GIVEN
        const expectedNode = mount(
            <div className="sbte-smart-scroll" style={{overflow: 'auto'}}>
                <div style={{paddingBottom: '317px', paddingTop: '0px'}}>
                    <div>
                        <div>{'{"name":"row1"}'}</div>
                        <div>0</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row2"}'}</div>
                        <div>1</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row3"}'}</div>
                        <div>2</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row4"}'}</div>
                        <div>3</div>
                        <div>null</div>
                    </div>
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
                    <div>
                        <div>{'{"name":"row7"}'}</div>
                        <div>6</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row8"}'}</div>
                        <div>7</div>
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
                    {name: 'row7'},
                    {name: 'row8'},
                    {name: 'row9'},
                    {name: 'row10'},
                    {name: 'row11'},
                    {name: 'row12'},
                    {name: 'row13'},
                ]}
                onClick={() => {}}
                row={TestRow}
                rowHeight={50}
                rowProps={null}
                startAt={0}
            />
        );
        simulateEnoughSpaceForCues(actualNode, 200);

        // WHEN
        actualNode.setProps({startAt: 1});

        setTimeout(() => {
            // THEN
            expect(actualNode.html()).toEqual(expectedNode.html());
            done();
        }, 10);
    });

    it('does scroll when startAt is changed from second element to first and is not in viewport', done => {
        // GIVEN
        const expectedNode = mount(
            <div className="sbte-smart-scroll" style={{overflow: 'auto'}}>
                <div style={{paddingBottom: '317px', paddingTop: '0px'}}>
                    <div>
                        <div>{'{"name":"row1"}'}</div>
                        <div>0</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row2"}'}</div>
                        <div>1</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row3"}'}</div>
                        <div>2</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row4"}'}</div>
                        <div>3</div>
                        <div>null</div>
                    </div>
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
                    <div>
                        <div>{'{"name":"row7"}'}</div>
                        <div>6</div>
                        <div>null</div>
                    </div>
                    <div>
                        <div>{'{"name":"row8"}'}</div>
                        <div>7</div>
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
                    {name: 'row7'},
                    {name: 'row8'},
                    {name: 'row9'},
                    {name: 'row10'},
                    {name: 'row11'},
                    {name: 'row12'},
                    {name: 'row13'},
                ]}
                onClick={() => {}}
                row={TestRow}
                rowHeight={50}
                rowProps={null}
                startAt={10}
            />
        );
        simulateEnoughSpaceForCues(actualNode, 200);
        actualNode.setProps({startAt: 1});

        // WHEN
        actualNode.setProps({startAt: 0});

        setTimeout(() => {
            // THEN
            expect(actualNode.html()).toEqual(expectedNode.html());
            done();
        }, 10);
    });
});
