import React from "react";
import { Group } from "@vx/group";
import { Tree } from "@vx/hierarchy";
import { hierarchy } from "d3-hierarchy";
import { RectClipPath } from "@vx/clip-path";
import { Zoom } from "@vx/zoom";
import { ParentSize } from "@vx/responsive";
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ViewfinderCircleIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/react/16/solid";

import Container from "../Container";

import Link from "./Link";
import Nodes from "./NodesMove";
import { areNumberishEqual } from "../utils";

export default class AnimatedTree extends React.Component {
  state = {
    layout: "cartesian",
    orientation: "horizontal",
    linkType: "diagonal",
    stepPercent: 0.5,
    showMiniMap: true,
    showInitialTooltip: true,
    expandedNodeKeys: [],
  };

  render() {
    const {
      searchInput,
      data,
      margin = {
        top: 50,
        left: 0,
        right: 0,
        bottom: 50,
      },
    } = this.props;

    const layout = "cartesian";
    const orientation = "vertical";
    const linkType = "diagonal";
    const stepPercent = 0.5;

    let origin;
    let sizeWidth;
    let sizeHeight;

    const rootAnimated = hierarchy(data, (d) =>
      d.isExpanded ? d.children : null
    );
    const rootFixed = hierarchy(data, (d) => d.children);

    const loading = false;

    const isAnimated = false;

    return (
      <Container>
        <ParentSize>
          {({ width, height }) => {
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;
            origin = { x: margin.left, y: margin.right };

            if (orientation === "vertical") {
              sizeWidth = innerWidth;
              sizeHeight = innerHeight;
            } else {
              sizeWidth = innerHeight;
              sizeHeight = innerWidth;
            }

            const initialTransform = {
              scaleX: 0.5,
              scaleY: 0.5,
              translateX: 0,
              translateY: 0,
              skewX: 0,
              skewY: 0,
            };

            return (
              <div>
                <Zoom
                  width={width}
                  height={height}
                  scaleXMin={1 / 2}
                  scaleXMax={4}
                  scaleYMin={1 / 2}
                  scaleYMax={4}
                  transformMatrix={initialTransform}
                >
                  {(zoom) => (
                    <div className="tree-container">
                      <svg
                        width={width}
                        height={height}
                        style={{
                          cursor: zoom.isDragging ? "grabbing" : "grab",
                        }}
                        ref={zoom.containerRef}
                      >
                        <RectClipPath
                          id="zoom-clip"
                          width={width}
                          height={height}
                        />
                        <rect
                          width={width}
                          height={height}
                          rx={14}
                          fill="transparent"
                          onTouchStart={zoom.dragStart}
                          onTouchMove={zoom.dragMove}
                          onTouchEnd={zoom.dragEnd}
                          onMouseDown={zoom.dragStart}
                          onMouseMove={zoom.dragMove}
                          onMouseUp={zoom.dragEnd}
                          onMouseLeave={() => {
                            if (zoom.isDragging) zoom.dragEnd();
                          }}
                          onDoubleClick={(event) => {
                            const point = localPoint(event) || { x: 0, y: 0 };
                            zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                          }}
                        />
                        <Tree
                          top={margin.top}
                          left={margin.left}
                          root={isAnimated ? rootAnimated : rootFixed}
                          size={[sizeWidth * 2, sizeHeight * 2]}
                          separation={(a, b) => {
                            if (sizeWidth) {
                              return a.parent == b.parent ? 200 / sizeWidth : 1;
                            } else {
                              return 1;
                            }
                          }}
                        >
                          {(tree) => {
                            return (
                              <Group
                                top={origin.y}
                                left={origin.x}
                                transform={zoom.toString()}
                              >
                                <>
                                  {tree.links().map((link, i) => {
                                    let strokeValue = "#000";
                                    if (link.target.children) {
                                      strokeValue = "#0099FE";
                                    } else if (link.target.depth === 30) {
                                      let url = new URL(window.location);
                                      const val =
                                        url.searchParams.get("world-id");
                                      if (
                                        areNumberishEqual(
                                          val,
                                          link.target.data.name
                                        )
                                      ) {
                                        strokeValue = "#0099FE";
                                      }
                                    }

                                    return (
                                      <Link
                                        data={link}
                                        linkType={linkType}
                                        layout={layout}
                                        orientation={orientation}
                                        stepPercent={stepPercent}
                                        stroke={strokeValue}
                                        strokeWidth="3"
                                        fill="none"
                                        key={i}
                                      />
                                    );
                                  })}

                                  <Nodes
                                    showInitialTooltip={
                                      this.state.showInitialTooltip &&
                                      isAnimated
                                    }
                                    nodes={tree.descendants()}
                                    layout={layout}
                                    orientation={orientation}
                                    onNodeClick={(node) => {
                                      if (isAnimated) {
                                        if (!node.data.isExpanded) {
                                          node.data.x0 = node.x;
                                          node.data.y0 = node.y;
                                        }
                                        node.data.isExpanded =
                                          !node.data.isExpanded;

                                        this.setState({
                                          showInitialTooltip: false,
                                        });

                                        this.forceUpdate();
                                      }
                                    }}
                                  />
                                </>
                              </Group>
                            );
                          }}
                        </Tree>
                        {this.state.showMiniMap && (
                          <g
                            clipPath="url(#zoom-clip)"
                            transform={`
                    scale(0.2)
                    translate(${width * 5 - width - 60}, ${
                              height * 5 - height - 60
                            })
                  `}
                            className="pointer-events-none"
                          >
                            <rect
                              width={width}
                              height={height}
                              fill="rgb(209 213 219)"
                            />
                            <Tree
                              top={margin.top}
                              left={margin.left}
                              root={rootFixed}
                              size={[sizeWidth * 2, sizeHeight * 2]}
                              separation={(a, b) => {
                                if (sizeWidth) {
                                  return a.parent == b.parent
                                    ? 200 / sizeWidth
                                    : 1;
                                } else {
                                  return 1;
                                }
                              }}
                            >
                              {(tree) => (
                                <Group
                                  top={origin.y}
                                  left={origin.x}
                                  transform={zoom.toString()}
                                >
                                  {tree.links().map((link, i) => {
                                    let strokeValue = "#000";
                                    if (link.target.children) {
                                      strokeValue = "#0099FE";
                                    } else if (link.target.depth === 30) {
                                      let url = new URL(window.location);
                                      const val =
                                        url.searchParams.get("world-id");
                                      if (
                                        areNumberishEqual(
                                          val,
                                          link.target.data.name
                                        )
                                      ) {
                                        strokeValue = "#0099FE";
                                      }
                                    }

                                    return (
                                      <Link
                                        data={link}
                                        linkType={linkType}
                                        layout={layout}
                                        orientation={orientation}
                                        stepPercent={stepPercent}
                                        stroke={strokeValue}
                                        strokeWidth="3"
                                        fill="none"
                                        key={i}
                                      />
                                    );
                                  })}
                                  <Nodes
                                    nodes={tree.descendants()}
                                    layout={layout}
                                    orientation={orientation}
                                    onNodeClick={(node) => {
                                      if (!node.data.isExpanded) {
                                        node.data.x0 = node.x;
                                        node.data.y0 = node.y;
                                      }
                                      node.data.isExpanded =
                                        !node.data.isExpanded;
                                      this.forceUpdate();
                                    }}
                                  />
                                </Group>
                              )}
                            </Tree>
                            <rect
                              width={width}
                              height={height}
                              fill="white"
                              fillOpacity={0.2}
                              stroke="white"
                              strokeWidth={4}
                              transform={zoom.toStringInvert()}
                            />
                          </g>
                        )}
                      </svg>

                      <div className="absolute top-6 right-6 flex flex-col self-end gap-6 bg-gray-100 px-1 py-2 rounded-full">
                        <button
                          type="button"
                          className="hover:bg-gray-300 rounded-full p-1"
                          onClick={() =>
                            zoom.scale({ scaleX: 1.2, scaleY: 1.2 })
                          }
                        >
                          <MagnifyingGlassPlusIcon className="h-6 w-6" />
                        </button>
                        <button
                          type="button"
                          className="hover:bg-gray-300 rounded-full p-1"
                          onClick={() =>
                            zoom.scale({ scaleX: 0.8, scaleY: 0.8 })
                          }
                        >
                          <MagnifyingGlassMinusIcon className="h-6 w-6" />
                        </button>
                        <button
                          type="button"
                          className="hover:bg-gray-300 rounded-full p-1"
                          onClick={zoom.reset}
                        >
                          <ViewfinderCircleIcon className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="absolute bottom-5 right-4 flex flex-col self-end">
                        <button
                          type="button"
                          className=""
                          onClick={() =>
                            this.setState({
                              showMiniMap: !this.state.showMiniMap,
                            })
                          }
                        >
                          {this.state.showMiniMap ? (
                            <EyeSlashIcon className="h-6 w-6 text-white" />
                          ) : (
                            <EyeIcon className="h-6 w-6" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </Zoom>
              </div>
            );
          }}
        </ParentSize>
      </Container>
    );
  }
}
