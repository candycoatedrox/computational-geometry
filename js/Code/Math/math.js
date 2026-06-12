'use strict';

// ============================================================================
// VECTOR MATH
// ============================================================================
const Vec = {
  sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
  add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
  mul: (a, t) => ({ x: a.x * t, y: a.y * t }),
  dot: (a, b) => a.x * b.x + a.y * b.y,
  cross: (a, b) => a.x * b.y - a.y * b.x,
  norm: (a) => Math.hypot(a.x, a.y),
  unit: (a) => {
    const n = Vec.norm(a);
    return (n < 1e-12) ? { x: 0, y: 0 } : { x: a.x / n, y: a.y / n };
  },
  rotate: (v, ang) => {
    const c = Math.cos(ang), s = Math.sin(ang);
    return { x: c * v.x - s * v.y, y: s * v.x + c * v.y };
  }
};

