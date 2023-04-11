export declare const noise: {
    seed: (seed: number) => void;
    simplex2: (xin: number, yin: number) => number;
    simplex3: (xin: number, yin: number, zin: number) => number;
    perlin2: (x_init: number, y_init: number) => number;
    perlin3: (x_init: number, y_init: number, z_init: number) => number;
};
