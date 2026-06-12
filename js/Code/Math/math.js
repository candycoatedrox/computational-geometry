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

const Funct = {
  factorial(n) {
    let nums = Utils.stdRange1(n);
    let f = 1;
    for (let i = 0; i < nums.length; i++) {
      f *= nums[i];
    }
    return f;
  }
};

const Combinations = {
  nChoose2(n) {
    return (n*(n-1))/2;
  },

  allIndexPairs(n) {
    if (n < 2) return [];

    let c = [];
    for (let i = 0; i < n-1; i++) {
        for (let j = i+1; j < n; j++) {
            c.push([i,j]);
        }
    }
    return c;
  },

  nChooseR(n, r) {
    // use simpler formulas if applicable
    if (n < r || r < 1) return 0;
    else if (r === 1) return n;
    else if (r === 2) return this.nChoose2(n);
    else if (n === r) return 1;

    return Funct.factorial(n) / (Funct.factorial(r) * Funct.factorial(n - r));
  },

  allIndexCombinationsOfR(n, r) {
    // use simpler formulas if applicable
    if (n < r || r < 1) return [];
    else if (r === 1) return Utils.stdRange(n).map(i => [i]);
    else if (r === 2) return this.allIndexPairs(n);
    else if (n === r) return [Utils.stdRange(n)];

    let combinations = [];
    for (let i = 0; i < n-(r-1); i++) {
      let c = this.allIndexCombinationsOfR(n-i-1, r-1).map(a => a.map(b => b+i+1));
      for (let j = 0; j < c.length; j++) {
        c[j].splice(0, 0, i);
      }
      combinations.push(...c);
    }

    return combinations;
  },

  // all combinations of rMin-rMax (inclusive) indices
  allIndexCombinations(n, rMin, rMax = n) {
    // clamp rMin and rMax to range 1-n
    rMin = Utils.clamp(rMin,1,n);
    rMax = Utils.clamp(rMax,1,n);

    let combinations = [];
    for (let r = rMin; r <= rMax; r++) {
      combinations = combinations.concat(this.allIndexCombinationsOfR(n,r));
    }
    return combinations;
  }
};

