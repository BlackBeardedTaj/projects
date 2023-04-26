package math;

import constantValues.Constants;
import entities.Camera;

public class MathUtils {
	
//	
//	Paularaker
//	3 years ago
//	If anyone is still getting a stretched image when they render,  
//	take your game's pixel ratio (in my case 16:9 or 1920x1080) and divide the two numbers (1.777777777777778). 
//	Go to the Maths class and find  Matrix4f.scale(new Vector3f(scale.x.....  divide the scale.x value by the quotient. 
//	Not perfect but as good as it'll get with this rendering system.

	
	public static Matrix4f createTransformationMatrix(Vector2f translation, Vector2f scale) {
		Matrix4f matrix = new Matrix4f();
		matrix.setIdentity();
		Matrix4f.translate(translation, matrix, matrix);
		Matrix4f.scale(new Vector3f(scale.x, scale.y, 1f), matrix, matrix);
		return matrix;
	}
	
	public static float barryCentric(Vector3f p1, Vector3f p2, Vector3f p3, Vector2f pos) {
		float det = (p2.z - p3.z) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.z - p3.z);
		float l1 = ((p2.z - p3.z) * (pos.x - p3.x) + (p3.x - p2.x) * (pos.y - p3.z)) / det;
		float l2 = ((p3.z - p1.z) * (pos.x - p3.x) + (p1.x - p3.x) * (pos.y - p3.z)) / det;
		float l3 = 1.0f - l1 - l2;
		return l1 * p1.y + l2 * p2.y + l3 * p3.y;
	}
	
	public static Matrix4f createTransformationMatrix(Vector3f translation, float rx, float ry, float rz, float scale) {
		Matrix4f transformationMatrix = new Matrix4f();
		transformationMatrix.setIdentity();
		transformationMatrix = transformationMatrix.multiply(Matrix4f.translate(translation.x, translation.y, translation.z));
		transformationMatrix = transformationMatrix.multiply(Matrix4f.rotate(rx, 1, 0, 0));
		transformationMatrix = transformationMatrix.multiply(Matrix4f.rotate(ry, 0, 1, 0));
		transformationMatrix = transformationMatrix.multiply(Matrix4f.rotate(rz, 0, 0, 1));
		transformationMatrix = transformationMatrix.multiply(Matrix4f.scale(scale, scale, scale));
		return transformationMatrix;
	}
	
	public static Matrix4f createProjectionMatrix(float FOV, float NEAR_PLANE, float FAR_PLANE) {
		Matrix4f projectionMatrix = new Matrix4f();
		float aspectRatio = (float) Constants.DISPLAY_WIDTH / (float) Constants.DISPLAY_HEIGHT;
		float y_scale = (float) ((1f / Math.tan(Math.toRadians(FOV/2f))) * aspectRatio);
		float x_scale = y_scale / aspectRatio;
		float frustum_length = FAR_PLANE - NEAR_PLANE;
		projectionMatrix = new Matrix4f();
		projectionMatrix.m00 = x_scale;
		projectionMatrix.m11 = y_scale;
		projectionMatrix.m22 = -((FAR_PLANE + NEAR_PLANE) / frustum_length);
		projectionMatrix.m23 = -1;
		projectionMatrix.m32 = -((2 * NEAR_PLANE * FAR_PLANE) / frustum_length);
		projectionMatrix.m33 = 0;
		return projectionMatrix;
	}
	
	public static Matrix4f createViewMatrix(Camera camera) {
		Matrix4f viewMatrix = new Matrix4f();
		viewMatrix.setIdentity();
		viewMatrix = viewMatrix.multiply(Matrix4f.rotate(camera.getPitch(), 1, 0, 0));
		viewMatrix = viewMatrix.multiply(Matrix4f.rotate(camera.getYaw(), 0, 1, 0));
		Vector3f cameraPos = camera.getPosition();
		Vector3f negativeCameraPos = new Vector3f(-cameraPos.x, -cameraPos.y, -cameraPos.z);
		viewMatrix  = viewMatrix.multiply(Matrix4f.translate(negativeCameraPos.x, negativeCameraPos.y, negativeCameraPos.z));
		return viewMatrix;
	}
	
	public static Matrix4f createViewMatrixNoTranslation(Camera camera) {
		Matrix4f viewMatrix = new Matrix4f();
		viewMatrix.setIdentity();
		viewMatrix = viewMatrix.multiply(Matrix4f.rotate(camera.getPitch(), 1, 0, 0));
		viewMatrix = viewMatrix.multiply(Matrix4f.rotate(camera.getYaw(), 0, 1, 0));
//		Vector3f cameraPos = camera.getPosition();
//		Vector3f negativeCameraPos = new Vector3f(-cameraPos.x, -cameraPos.y, -cameraPos.z);
//		viewMatrix  = viewMatrix.multiply(Matrix4f.translate(negativeCameraPos.x, negativeCameraPos.y, negativeCameraPos.z));
		return viewMatrix;
	}
	
}
