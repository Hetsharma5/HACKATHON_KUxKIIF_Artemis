const ASPECT_RATIO = 1.6;

function getPseudoDimensions(usableArea) {
  const width = Math.sqrt(usableArea * ASPECT_RATIO);
  const height = usableArea / width;

  return { width, height };
}

export function getRowCount(usableArea, rowSpacingM, orientation) {
  if (!usableArea || !rowSpacingM) {
    return 0;
  }

  const { width, height } = getPseudoDimensions(usableArea);
  const horizontalRows = Math.max(1, Math.floor(height / rowSpacingM));
  const verticalRows = Math.max(1, Math.floor(width / rowSpacingM));

  if (orientation === "horizontal") {
    return { rowCount: horizontalRows, orientation: "horizontal" };
  }

  if (orientation === "vertical") {
    return { rowCount: verticalRows, orientation: "vertical" };
  }

  if (verticalRows > horizontalRows) {
    return { rowCount: verticalRows, orientation: "vertical" };
  }

  return { rowCount: horizontalRows, orientation: "horizontal" };
}

export function createPreviewLines(rowCount, orientation) {
  const maxLines = Math.min(24, rowCount);
  const lines = [];

  for (let index = 0; index < maxLines; index += 1) {
    const position = ((index + 1) / (maxLines + 1)) * 100;
    lines.push({
      id: `${orientation}-${index}`,
      orientation,
      positionPercent: position,
    });
  }

  return lines;
}
