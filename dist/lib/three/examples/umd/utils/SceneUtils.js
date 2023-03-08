(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SceneUtils = {}, global.three));
})(this, (function (exports, three) { 'use strict';

	/**
	 * @param {BufferAttribute}
	 * @return {BufferAttribute}
	 */
	function deepCloneAttribute( attribute ) {

		if ( attribute.isInstancedInterleavedBufferAttribute || attribute.isInterleavedBufferAttribute ) {

			return deinterleaveAttribute( attribute );

		}

		if ( attribute.isInstancedBufferAttribute ) {

			return new three.InstancedBufferAttribute().copy( attribute );

		}

		return new three.BufferAttribute().copy( attribute );

	}

	// returns a new, non-interleaved version of the provided attribute
	function deinterleaveAttribute( attribute ) {

		const cons = attribute.data.array.constructor;
		const count = attribute.count;
		const itemSize = attribute.itemSize;
		const normalized = attribute.normalized;

		const array = new cons( count * itemSize );
		let newAttribute;
		if ( attribute.isInstancedInterleavedBufferAttribute ) {

			newAttribute = new three.InstancedBufferAttribute( array, itemSize, normalized, attribute.meshPerAttribute );

		} else {

			newAttribute = new three.BufferAttribute( array, itemSize, normalized );

		}

		for ( let i = 0; i < count; i ++ ) {

			newAttribute.setX( i, attribute.getX( i ) );

			if ( itemSize >= 2 ) {

				newAttribute.setY( i, attribute.getY( i ) );

			}

			if ( itemSize >= 3 ) {

				newAttribute.setZ( i, attribute.getZ( i ) );

			}

			if ( itemSize >= 4 ) {

				newAttribute.setW( i, attribute.getW( i ) );

			}

		}

		return newAttribute;

	}

	function mergeGroups( geometry ) {

		if ( geometry.groups.length === 0 ) {

			console.warn( 'THREE.BufferGeometryUtils.mergeGroups(): No groups are defined. Nothing to merge.' );
			return geometry;

		}

		let groups = geometry.groups;

		// sort groups by material index

		groups = groups.sort( ( a, b ) => {

			if ( a.materialIndex !== b.materialIndex ) return a.materialIndex - b.materialIndex;

			return a.start - b.start;

		} );

		// create index for non-indexed geometries

		if ( geometry.getIndex() === null ) {

			const positionAttribute = geometry.getAttribute( 'position' );
			const indices = [];

			for ( let i = 0; i < positionAttribute.count; i += 3 ) {

				indices.push( i, i + 1, i + 2 );

			}

			geometry.setIndex( indices );

		}

		// sort index

		const index = geometry.getIndex();

		const newIndices = [];

		for ( let i = 0; i < groups.length; i ++ ) {

			const group = groups[ i ];

			const groupStart = group.start;
			const groupLength = groupStart + group.count;

			for ( let j = groupStart; j < groupLength; j ++ ) {

				newIndices.push( index.getX( j ) );

			}

		}

		geometry.dispose(); // Required to force buffer recreation
		geometry.setIndex( newIndices );

		// update groups indices

		let start = 0;

		for ( let i = 0; i < groups.length; i ++ ) {

			const group = groups[ i ];

			group.start = start;
			start += group.count;

		}

		// merge groups

		let currentGroup = groups[ 0 ];

		geometry.groups = [ currentGroup ];

		for ( let i = 1; i < groups.length; i ++ ) {

			const group = groups[ i ];

			if ( currentGroup.materialIndex === group.materialIndex ) {

				currentGroup.count += group.count;

			} else {

				currentGroup = group;
				geometry.groups.push( currentGroup );

			}

		}

		return geometry;

	}

	const _color = /*@__PURE__*/new three.Color();
	const _matrix = /*@__PURE__*/new three.Matrix4();

	function createMeshesFromInstancedMesh( instancedMesh ) {

		const group = new three.Group();

		const count = instancedMesh.count;
		const geometry = instancedMesh.geometry;
		const material = instancedMesh.material;

		for ( let i = 0; i < count; i ++ ) {

			const mesh = new three.Mesh( geometry, material );

			instancedMesh.getMatrixAt( i, mesh.matrix );
			mesh.matrix.decompose( mesh.position, mesh.quaternion, mesh.scale );

			group.add( mesh );

		}

		group.copy( instancedMesh );
		group.updateMatrixWorld(); // ensure correct world matrices of meshes

		return group;

	}

	function createMeshesFromMultiMaterialMesh( mesh ) {

		if ( Array.isArray( mesh.material ) === false ) {

			console.warn( 'THREE.SceneUtils.createMeshesFromMultiMaterialMesh(): The given mesh has no multiple materials.' );
			return mesh;

		}

		const object = new three.Group();
		object.copy( mesh );

		// merge groups (which automatically sorts them)

		const geometry = mergeGroups( mesh.geometry );

		const index = geometry.index;
		const groups = geometry.groups;
		const attributeNames = Object.keys( geometry.attributes );

		// create a mesh for each group by extracting the buffer data into a new geometry

		for ( let i = 0; i < groups.length; i ++ ) {

			const group = groups[ i ];

			const start = group.start;
			const end = start + group.count;

			const newGeometry = new three.BufferGeometry();
			const newMaterial = mesh.material[ group.materialIndex ];

			// process all buffer attributes

			for ( let j = 0; j < attributeNames.length; j ++ ) {

				const name = attributeNames[ j ];
				const attribute = geometry.attributes[ name ];
				const itemSize = attribute.itemSize;

				const newLength = group.count * itemSize;
				const type = attribute.array.constructor;

				const newArray = new type( newLength );
				const newAttribute = new three.BufferAttribute( newArray, itemSize );

				for ( let k = start, n = 0; k < end; k ++, n ++ ) {

					const ind = index.getX( k );

					if ( itemSize >= 1 ) newAttribute.setX( n, attribute.getX( ind ) );
					if ( itemSize >= 2 ) newAttribute.setY( n, attribute.getY( ind ) );
					if ( itemSize >= 3 ) newAttribute.setZ( n, attribute.getZ( ind ) );
					if ( itemSize >= 4 ) newAttribute.setW( n, attribute.getW( ind ) );

				}


				newGeometry.setAttribute( name, newAttribute );

			}

			const newMesh = new three.Mesh( newGeometry, newMaterial );
			object.add( newMesh );

		}

		return object;

	}

	function createMultiMaterialObject( geometry, materials ) {

		const group = new three.Group();

		for ( let i = 0, l = materials.length; i < l; i ++ ) {

			group.add( new three.Mesh( geometry, materials[ i ] ) );

		}

		return group;

	}

	function reduceVertices( object, func, initialValue ) {

		let value = initialValue;
		const vertex = new three.Vector3();

		object.updateWorldMatrix( true, true );

		object.traverseVisible( ( child ) => {

			const { geometry } = child;

			if ( geometry !== undefined ) {

				const { position } = geometry.attributes;

				if ( position !== undefined ) {

					for ( let i = 0, l = position.count; i < l; i ++ ) {

						if ( child.isMesh ) {

							child.getVertexPosition( i, vertex );

						} else {

							vertex.fromBufferAttribute( position, i );

						}

						if ( ! child.isSkinnedMesh ) {

							vertex.applyMatrix4( child.matrixWorld );

						}

						value = func( value, vertex );

					}

				}

			}

		} );

		return value;

	}

	/**
	 * @param {InstancedMesh}
	 * @param {function(int, int):int}
	 */
	function sortInstancedMesh( mesh, compareFn ) {

		// store copy of instanced attributes for lookups

		const instanceMatrixRef = deepCloneAttribute( mesh.instanceMatrix );
		const instanceColorRef = mesh.instanceColor ? deepCloneAttribute( mesh.instanceColor ) : null;

		const attributeRefs = new Map();

		for ( const name in mesh.geometry.attributes ) {

			const attribute = mesh.geometry.attributes[ name ];

			if ( attribute.isInstancedBufferAttribute ) {

				attributeRefs.set( attribute, deepCloneAttribute( attribute ) );

			}

		}


		// compute sort order

		const tokens = [];

		for ( let i = 0; i < mesh.count; i ++ ) tokens.push( i );

		tokens.sort( compareFn );


		// apply sort order

		for ( let i = 0; i < tokens.length; i ++ ) {

			const refIndex = tokens[ i ];

			_matrix.fromArray( instanceMatrixRef.array, refIndex * mesh.instanceMatrix.itemSize );
			_matrix.toArray( mesh.instanceMatrix.array, i * mesh.instanceMatrix.itemSize );

			if ( mesh.instanceColor ) {

				_color.fromArray( instanceColorRef.array, refIndex * mesh.instanceColor.itemSize );
				_color.toArray( mesh.instanceColor.array, i * mesh.instanceColor.itemSize );

			}

			for ( const name in mesh.geometry.attributes ) {

				const attribute = mesh.geometry.attributes[ name ];

				if ( attribute.isInstancedBufferAttribute ) {

					const attributeRef = attributeRefs.get( attribute );

					attribute.setX( i, attributeRef.getX( refIndex ) );
					if ( attribute.itemSize > 1 ) attribute.setY( i, attributeRef.getY( refIndex ) );
					if ( attribute.itemSize > 2 ) attribute.setZ( i, attributeRef.getZ( refIndex ) );
					if ( attribute.itemSize > 3 ) attribute.setW( i, attributeRef.getW( refIndex ) );

				}

			}

		}

	}

	exports.createMeshesFromInstancedMesh = createMeshesFromInstancedMesh;
	exports.createMeshesFromMultiMaterialMesh = createMeshesFromMultiMaterialMesh;
	exports.createMultiMaterialObject = createMultiMaterialObject;
	exports.reduceVertices = reduceVertices;
	exports.sortInstancedMesh = sortInstancedMesh;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
