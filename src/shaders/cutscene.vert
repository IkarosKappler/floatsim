varying vec2 vUv;
varying vec3 vposition;

void main() {
            // This is just the local position.
    vUv = uv; // position;
            // This is the global position in the world.
    vposition = (modelMatrix * vec4(position, 1.0)).xyz;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}