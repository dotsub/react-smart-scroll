import {calcEndIndex, calcStartIndex, sumRange} from './utils';
import React, {
    createRef,
    useEffect,
    useLayoutEffect,
    useReducer,
    useRef,
    useState,
} from 'react';
import PropTypes from 'prop-types';
import ReactSmartScrollRow from './ReactSmartScrollRow';
import useComponentRect from '../hooks/useComponentRect';
import useScroll from '../hooks/useScroll';

const isNotInViewPort = (startAt, startIndex, endIndex, startContingency) =>
    startAt < startIndex + startContingency || startAt > endIndex - 2;

// Trick with non-default export of non-memoized component is needed for default props testing:
// https://github.com/enzymejs/enzyme/issues/2115
export const ReactSmartScrollNotMemoized = props => {
    const {
        className,
        data,
        overflow,
        row,
        rowHeight,
        startAt,
        style,
        ...rowProps
    } = props;

    const [start, setStart] = useState(0);
    const [refs, setRefs] = useState([]);

    const [actualHeights, setActualHeights] = useReducer((state, action) => {
        if (!action.reset) {
            const next = [...state];
            next[action.rowIndex] = action.height;
            return next;
        }
        return Array(data.length).fill(rowHeight);
    }, []);

    useEffect(() => {
        setRefs(
            Array(data.length)
                .fill(undefined)
                .map(() => createRef())
        );
    }, [data.length]);

    useEffect(() => {
        setActualHeights({reset: true});
    }, [data.length, rowHeight]);

    const [measurements, setMeasurements] = useState({
        startIndex: 0,
        endIndex: 0,
        paddingBottom: 0,
        paddingTop: 0,
    });

    const scrollRef = useRef(undefined);
    const scroll = useScroll(scrollRef);
    const visible = useComponentRect(scrollRef);

    // useEffect with this has considerable redraw lag
    useLayoutEffect(() => {
        if (visible.height) {
            const startIndex = calcStartIndex(actualHeights, scroll.top);
            const endIndex = calcEndIndex(
                actualHeights,
                visible.height,
                startIndex
            );
            const startContingency =
                startAt && startAt < 2 && startAt < start ? startAt : 2;

            const scrollStartIndex =
                startAt !== undefined &&
                isNotInViewPort(startAt, startIndex, endIndex, startContingency)
                    ? startAt
                    : start;
            const scrollEndIndex = calcEndIndex(
                actualHeights,
                visible.height,
                scrollStartIndex
            );

            const last = actualHeights.length - 1;

            const paddingTop =
                scrollStartIndex > 0
                    ? sumRange(actualHeights, 0, scrollStartIndex - 1)
                    : 0;
            const paddingBottom =
                scrollEndIndex !== last
                    ? sumRange(actualHeights, scrollEndIndex + 1, last) + 17
                    : 0;

            const contentHeight = sumRange(
                actualHeights,
                0,
                actualHeights.length
            );

            const measurements = {
                startIndex: scrollStartIndex,
                endIndex: scrollEndIndex,
                paddingBottom,
                paddingTop,
                contentHeight,
            };
            setMeasurements(measurements);
            if (
                startAt !== undefined &&
                isNotInViewPort(startAt, startIndex, endIndex, startContingency)
            ) {
                scrollRef.current.scrollTop = paddingTop;
                setTimeout(() => {
                    setStart(startAt);
                    if (data[startAt] && refs[startAt]) {
                        const el = refs[startAt].current;
                        if (el) {
                            el.parentNode.scrollTop =
                                el.offsetTop - el.parentNode.offsetTop;
                        }
                    }
                }, 0);
            }
        }
    }, [actualHeights, data, refs, scroll.top, start, startAt, visible.height]);

    const {endIndex, paddingBottom, paddingTop, startIndex} = measurements;

    return (
        <div
            ref={scrollRef}
            className={className || ''}
            style={{overflow, ...style}}
        >
            <div style={{paddingBottom, paddingTop}}>
                {data.slice(startIndex, endIndex + 1).map((item, i) => (
                    <ReactSmartScrollRow
                        key={item.id || startIndex + i}
                        Component={row}
                        data={item}
                        onUpdate={setActualHeights}
                        rowHeight={actualHeights[startIndex + i]}
                        rowIndex={startIndex + i}
                        rowProps={rowProps}
                        rowRef={refs[startIndex + i]}
                    />
                ))}
            </div>
        </div>
    );
};

ReactSmartScrollNotMemoized.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array,
    overflow: PropTypes.string,
    row: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    rowHeight: PropTypes.number,
    startAt: PropTypes.number,
    style: PropTypes.object,
};

ReactSmartScrollNotMemoized.defaultProps = {
    className: '',
    data: [],
    overflow: 'auto',
    row: () => null,
    rowHeight: 100,
    style: {},
};

export default React.memo(ReactSmartScrollNotMemoized);
