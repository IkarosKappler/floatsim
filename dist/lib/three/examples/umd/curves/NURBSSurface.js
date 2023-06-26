(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.NURBSSurface = {}, global.three));
})(this, (function (exports, three) { 'use strict';

	/**
	 * NURBS utils
	 *
	 * See NURBSCurve and NURBSSurface.
	 **/


	/**************************************************************
	 *	NURBS Utils
	 **************************************************************/

	/*
	Finds knot vector span.

	p : degree
	u : parametric value
	U : knot vector

	returns the span
	*/
	function findSpan( p, u, U ) {

		const n = U.length - p - 1;

		if ( u >= U[ n ] ) {

			return n - 1;

		}

		if ( u <= U[ p ] ) {

			return p;

		}

		let low = p;
		let high = n;
		let mid = Math.floor( ( low + high ) / 2 );

		while ( u < U[ mid ] || u >= U[ mid + 1 ] ) {

			if ( u < U[ mid ] ) {

				high = mid;

			} else {

				low = mid;

			}

			mid = Math.floor( ( low + high ) / 2 );

		}

		return mid;

	}


	/*
	Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2

	span : span in which u lies
	u    : parametric point
	p    : degree
	U    : knot vector

	returns array[p+1] with basis functions values.
	*/
	function calcBasisFunctions( span, u, p, U ) {

		const N = [];
		const left = [];
		const right = [];
		N[ 0 ] = 1.0;

		for ( let j = 1; j <= p; ++ j ) {

			left[ j ] = u - U[ span + 1 - j ];
			right[ j ] = U[ span + j ] - u;

			let saved = 0.0;

			for ( let r = 0; r < j; ++ r ) {

				const rv = right[ r + 1 ];
				const lv = left[ j - r ];
				const temp = N[ r ] / ( rv + lv );
				N[ r ] = saved + rv * temp;
				saved = lv * temp;

			}

			N[ j ] = saved;

		}

		return N;

	}


	/*
	Calculate rational B-Spline surface point. See The NURBS Book, page 134, algorithm A4.3.

	p1, p2 : degrees of B-Spline surface
	U1, U2 : knot vectors
	P      : control points (x, y, z, w)
	u, v   : parametric values

	returns point for given (u, v)
	*/
	function calcSurfacePoint( p, q, U, V, P, u, v, target ) {

		const uspan = findSpan( p, u, U );
		const vspan = findSpan( q, v, V );
		const Nu = calcBasisFunctions( uspan, u, p, U );
		const Nv = calcBasisFunctions( vspan, v, q, V );
		const temp = [];

		for ( let l = 0; l <= q; ++ l ) {

			temp[ l ] = new three.Vector4( 0, 0, 0, 0 );
			for ( let k = 0; k <= p; ++ k ) {

				const point = P[ uspan - p + k ][ vspan - q + l ].clone();
				const w = point.w;
				point.x *= w;
				point.y *= w;
				point.z *= w;
				temp[ l ].add( point.multiplyScalar( Nu[ k ] ) );

			}

		}

		const Sw = new three.Vector4( 0, 0, 0, 0 );
		for ( let l = 0; l <= q; ++ l ) {

			Sw.add( temp[ l ].multiplyScalar( Nv[ l ] ) );

		}

		Sw.divideScalar( Sw.w );
		target.set( Sw.x, Sw.y, Sw.z );

	}

	/**
	 * NURBS surface object
	 *
	 * Implementation is based on (x, y [, z=0 [, w=1]]) control points with w=weight.
	 **/

	class NURBSSurface {

		constructor( degree1, degree2, knots1, knots2 /* arrays of reals */, controlPoints /* array^2 of Vector(2|3|4) */ ) {

			this.degree1 = degree1;
			this.degree2 = degree2;
			this.knots1 = knots1;
			this.knots2 = knots2;
			this.controlPoints = [];

			const len1 = knots1.length - degree1 - 1;
			const len2 = knots2.length - degree2 - 1;

			// ensure Vector4 for control points
			for ( let i = 0; i < len1; ++ i ) {

				this.controlPoints[ i ] = [];

				for ( let j = 0; j < len2; ++ j ) {

					const point = controlPoints[ i ][ j ];
					this.controlPoints[ i ][ j ] = new three.Vector4( point.x, point.y, point.z, point.w );

				}

			}

		}

		getPoint( t1, t2, target ) {

			const u = this.knots1[ 0 ] + t1 * ( this.knots1[ this.knots1.length - 1 ] - this.knots1[ 0 ] ); // linear mapping t1->u
			const v = this.knots2[ 0 ] + t2 * ( this.knots2[ this.knots2.length - 1 ] - this.knots2[ 0 ] ); // linear mapping t2->u

			calcSurfacePoint( this.degree1, this.degree2, this.knots1, this.knots2, this.controlPoints, u, v, target );

		}

	}

	exports.NURBSSurface = NURBSSurface;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
