import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useState } from "react";
import { PixiController } from "./2d/PixiController";
import { EventEmitter } from "./lib/eventEmitter";
import { data } from "./2d/data";

const emitter: EventEmitter<any> = new EventEmitter();

export const App = () => {
  const [value, setValue] = useState("withoutCulling");
  const [menuEnabled, setMenuEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
  };

  const handleLoad = () => {
    setMenuEnabled(false);
    setLoading(true);
    const controller = new PixiController(
      "aws",
      data,
      emitter,
      document.getElementById("graph") as HTMLCanvasElement,
      value,
      () => setLoading(false)
    );

    controller.prepare().then(() => controller.render());
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Stack p={3} sx={{ height: "120px" }} direction="column">
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">
            Configuration
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <Tooltip title="We don't apply any culling strategy">
              <FormControlLabel
                value="withoutCulling"
                control={<Radio />}
                label="Without culling"
                disabled={!menuEnabled}
              />
            </Tooltip>
            <Tooltip title="We cull all the time, that means we hide items that are outside of the bounds of the canvas and also we hide items that are smaller than X pixels">
              <FormControlLabel
                value="cullingAlways"
                control={<Radio />}
                label="Culling always"
                disabled={!menuEnabled}
              />
            </Tooltip>
            <Tooltip title="Same strategy as 'Culling always' but we only cull when the user start to drag or to zoom in/out. After the user finishes the action, we show everything">
              <FormControlLabel
                value="cullingDragAndZoom"
                control={<Radio />}
                label="Culling on drop and zoom"
                disabled={!menuEnabled}
              />
            </Tooltip>
          </RadioGroup>
        </FormControl>
        <Box>
          <Button
            onClick={handleLoad}
            disabled={!menuEnabled || loading}
            variant="contained"
          >
            {loading ? "Loading" : "Load"}
          </Button>
        </Box>
        {loading && (
          <Typography variant="subtitle1" gutterBottom>
            It could take some time to load the graph, please wait until you see
            the diagram.
          </Typography>
        )}
        {!menuEnabled && !loading && (
          <Typography variant="subtitle1" gutterBottom>
            If you want another configuration please reload the page
          </Typography>
        )}
      </Stack>
      <canvas id="graph" />
    </Box>
  );
};
