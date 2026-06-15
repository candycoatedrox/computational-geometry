function getClosest(points, x, y, thresh = 10) {
  let minDist = Infinity, idx = -1;
  for (let i = 0; i < points.length; i++) {
    const [px, py] = points[i];
    const d = Math.hypot(px - x, py - y);
    if (d < minDist && d < thresh) {
      minDist = d;
      idx = i;
    }
  }
  return idx;
}