import React, { useEffect } from "react";
import { Group } from "@vx/group";
import NodeGroup from "react-move/NodeGroup";

import Node from "./Node";
import { findCollapsedParent, getTopLeft } from "../utils";

function Nodes({
  nodes,
  layout,
  orientation,
  onNodeClick,
  showInitialTooltip,
}) {
  return (
    <NodeGroup
      data={nodes}
      keyAccessor={(d) => d.data.name}
      start={(node) => {
        const parentTopLeft = getTopLeft(
          node.parent || { x: 0, y: 0 },
          layout,
          orientation
        );
        return {
          top: parentTopLeft.top,
          left: parentTopLeft.left,
          opacity: 0,
        };
      }}
      enter={(node) => {
        const topLeft = getTopLeft(node, layout, orientation);
        return {
          top: [topLeft.top],
          left: [topLeft.left],
          opacity: [1],
        };
      }}
      update={(node) => {
        const topLeft = getTopLeft(node, layout, orientation);
        return {
          top: [topLeft.top],
          left: [topLeft.left],
          opacity: [1],
        };
      }}
      leave={(node) => {
        const collapsedParent = findCollapsedParent(node.parent);
        const collapsedParentPrevPos = {
          x: collapsedParent.data.x0,
          y: collapsedParent.data.y0,
        };
        const topLeft = getTopLeft(collapsedParentPrevPos, layout, orientation);

        return {
          top: [topLeft.top],
          left: [topLeft.left],
          opacity: [0],
        };
      }}
    >
      {(nodes) => {
        return (
          <Group className="relative">
            {nodes.map(({ key, data, state }) => {
              return (
                <Group
                  top={state.top}
                  left={state.left}
                  key={key}
                  opacity={state.opacity}
                >
                  <Node
                    node={data}
                    layout={layout}
                    orientation={orientation}
                    onClick={() => onNodeClick(data)}
                    key={key}
                    showInitialTooltip={showInitialTooltip}
                  />
                </Group>
              );
            })}
          </Group>
        );
      }}
    </NodeGroup>
  );
}

export default Nodes;
