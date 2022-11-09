import React from 'react';
import { Zoom } from '@vx/zoom';

import {
    dataset3WithLineage,
    dataset4WithLineage,
    dataset5WithLineage,
    dataset6WithLineage,
    dataSetArr,
} from '../../../Mocks';
import { Direction, FetchedEntities } from '../types';
import constructTree from '../utils/constructTree';
import LineageTree from '../LineageTree';
import extendAsyncEntities from '../utils/extendAsyncEntities';
import TestPageContainer, { getTestEntityRegistry } from '../../../utils/test-utils/TestPageContainer';
import { EntityType } from '../../../types.generated';

const margin = { top: 10, left: 280, right: 280, bottom: 10 };
const [windowWidth, windowHeight] = [1000, 500];

const height = windowHeight - 125;
const width = windowWidth;
const yMax = height - margin.top - margin.bottom;
const initialTransform = {
    scaleX: 2 / 3,
    scaleY: 2 / 3,
    translateX: width / 2,
    translateY: 0,
    skewX: 0,
    skewY: 0,
};

const testEntityRegistry = getTestEntityRegistry();

export default () => {
    const fetchedEntities = [
        { entity: dataset4WithLineage, direction: Direction.Upstream, fullyFetched: true },
        { entity: dataset5WithLineage, direction: Direction.Upstream, fullyFetched: true },
        { entity: dataset6WithLineage, direction: Direction.Upstream, fullyFetched: true },
        // { entity: dataset6WithLineage, direction: Direction.Upstream, fullyFetched: true },
        ...dataSetArr.map((v) => {
            return {
                entity: v,
                direction: Direction.Upstream,
                fullyFetched: true,
            };
        }),
    ];

    const mockFetchedEntities = fetchedEntities.reduce(
        (acc, entry) =>
            extendAsyncEntities(
                {},
                acc,
                testEntityRegistry,
                { entity: entry.entity as any, type: EntityType.Dataset },
                entry.fullyFetched,
            ),
        {} as FetchedEntities,
    );

    console.log({
        fetchedEntities,
        mockFetchedEntities,
    });

    const downstreamData = constructTree(
        { entity: dataset3WithLineage, type: EntityType.Dataset },
        mockFetchedEntities,
        Direction.Downstream,
        testEntityRegistry,
    );
    const upstreamData = constructTree(
        { entity: dataset3WithLineage, type: EntityType.Dataset },
        mockFetchedEntities,
        Direction.Upstream,
        testEntityRegistry,
    );

    console.log({
        downstreamData,
        upstreamData,
    });

    const ret = (
        <TestPageContainer>
            <Zoom
                width={width}
                height={height}
                scaleXMin={1 / 8}
                scaleXMax={2}
                scaleYMin={1 / 8}
                scaleYMax={2}
                transformMatrix={initialTransform}
            >
                {(zoom) => (
                    <svg width={1800} height={500} style={{ paddingLeft: 100 }}>
                        <defs>
                            <marker
                                id="triangle-downstream"
                                viewBox="0 0 10 10"
                                refX="10"
                                refY="5"
                                markerUnits="strokeWidth"
                                markerWidth="10"
                                markerHeight="10"
                                orient="auto"
                            >
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#BFBFBF" />
                            </marker>
                            <marker
                                id="triangle-upstream"
                                viewBox="0 0 10 10"
                                refX="0"
                                refY="5"
                                markerUnits="strokeWidth"
                                markerWidth="10"
                                markerHeight="10"
                                orient="auto"
                            >
                                <path d="M 0 5 L 10 10 L 10 0 L 0 5 z" fill="#BFBFBF" />
                            </marker>
                            <marker
                                id="triangle-downstream-highlighted"
                                viewBox="0 0 10 10"
                                refX="10"
                                refY="5"
                                markerUnits="strokeWidth"
                                markerWidth="10"
                                markerHeight="10"
                                orient="auto"
                            >
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#1890FF" />
                            </marker>
                            <marker
                                id="triangle-upstream-highlighted"
                                viewBox="0 0 10 10"
                                refX="0"
                                refY="5"
                                markerUnits="strokeWidth"
                                markerWidth="10"
                                markerHeight="10"
                                orient="auto"
                            >
                                <path d="M 0 5 L 10 10 L 10 0 L 0 5 z" fill="#1890FF" />
                            </marker>
                            <linearGradient id="gradient-Downstream" x1="1" x2="0" y1="0" y2="0">
                                <stop offset="0%" stopColor="#1890FF" />
                                <stop offset="100%" stopColor="#1890FF" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="gradient-Upstream" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0%" stopColor="#1890FF" />
                                <stop offset="100%" stopColor="#1890FF" stopOpacity="0" />
                            </linearGradient>
                            <filter id="shadow1">
                                <feDropShadow
                                    dx="0"
                                    dy="0"
                                    stdDeviation="4"
                                    floodColor="rgba(72, 106, 108, 0.15)"
                                    floodOpacity="1"
                                />
                            </filter>
                            <filter id="shadow1-selected">
                                <feDropShadow
                                    dx="0"
                                    dy="0"
                                    stdDeviation="6"
                                    floodColor="rgba(24, 144, 255, .15)"
                                    floodOpacity="1"
                                />
                            </filter>
                        </defs>
                        <rect width={width} height={height} fill="#fafafa" />
                        <LineageTree
                            upstreamData={upstreamData}
                            downstreamData={downstreamData}
                            zoom={zoom}
                            onEntityClick={() => 1}
                            onLineageExpand={() => null}
                            canvasHeight={yMax}
                            margin={margin}
                            direction={Direction.Upstream}
                            setIsDraggingNode={() => null}
                            draggedNodes={{}}
                            setDraggedNodes={() => null}
                            onEntityCenter={() => null}
                            setHoveredEntity={() => null}
                            fetchedEntities={mockFetchedEntities}
                        />
                    </svg>
                )}
            </Zoom>
        </TestPageContainer>
    );

    return ret;
};
