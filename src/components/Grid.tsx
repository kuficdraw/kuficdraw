import { useEffect } from "react";
import "paper";
import { tool, project, Path } from "paper/dist/paper-core";
function GridElement() {
  useEffect(
    () => {
      tool.fixedDistance = 20;

      var layer = project.activeLayer;
      function onMouseMove(event: any) {
        // The radius of the circle is the distance we moved
        // divided by 2:
        var radius = event.delta.length / 2;

        // Create a circle shaped path at the point in the middle between
        // the current position of the mouse and the last position of
        // the mouse:
        var path = new Path.Circle({
          center: event.middlePoint,
          radius: radius,
        });

        // The hue is defined by the amount of times the onMouseMove
        // event has been fired, multiplied by 10:
        // path.fillColor = {
        //   hue: event.count * 3,
        //   saturation: 1,
        //   brightness: 1,
        // };

        // If we created at least 8 paths, remove the first
        // path in the layer.
        if (layer.children.length > 8) layer.firstChild.remove();
        return false; // Prevent touch scrolling
      }
    },
    // array of variables that can trigger an update if they change. Pass an
    // an empty array if you just want to run it once after component mounted.
    []
  );

  return <></>;
}

export default GridElement;
