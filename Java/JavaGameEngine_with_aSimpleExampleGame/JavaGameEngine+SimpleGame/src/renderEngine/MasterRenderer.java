package renderEngine;

import static org.lwjgl.opengl.GL11.*;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.lwjgl.opengl.GL11;

import constantValues.Constants;
import entities.*;
import math.*;
import math.MathUtils;
import model.TexturedModel;
import shaders.*;
import skybox.SkyboxRenderer;
import terrains.Terrain;

@SuppressWarnings("unused")
public class MasterRenderer {
	private StaticShader shader = new StaticShader();
	private TerrainShader terrainShader = new TerrainShader();
	private EntityRenderer renderer;
	private TerrainRenderer terrainRenderer;
	
	private Map<TexturedModel, List<Entity>> entities = new HashMap<TexturedModel, List<Entity>>();
	private List<Terrain> terrains = new ArrayList<Terrain>();
	
	private SkyboxRenderer skyboxRenderer;
	
	private Matrix4f projectionMatrix;
	private Vector3f skyColor = new Vector3f(Constants.BG_RED, Constants.BG_GREEN, Constants.BG_BLUE);
	
	public MasterRenderer(Loader loader) {
		enableCulling();
		projectionMatrix = MathUtils.createProjectionMatrix(Constants.FOV, Constants.NEAR_PLANE, Constants.FAR_PLANE);
		renderer = new EntityRenderer(shader, projectionMatrix);
		terrainRenderer = new TerrainRenderer(terrainShader, projectionMatrix);
		skyboxRenderer = new SkyboxRenderer(loader, projectionMatrix);
	}
	
	public static void enableCulling() {
		GL11.glEnable(GL11.GL_CULL_FACE); 
		GL11.glCullFace(GL11.GL_BACK);
	}
	
	public static void disableCulling() {
		GL11.glDisable(GL11.GL_CULL_FACE); 
		GL11.glCullFace(GL11.GL_BACK);
	}
	
	public void renderScene(List<Entity> entities, List<Terrain> terrains, List<Light> lights, Camera camera, Vector4f clipPlane) {
		for (Terrain terrain : terrains) {
			processTerrain(terrain);
		}
		for (Entity entity : entities) {
			processEntity(entity);
		}
		render(lights, camera, clipPlane);
	}
	
	public void render(List<Light> lights, Camera camera, Vector4f clipPlane) {
		prepare();
		shader.start();
		shader.loadClipPlane(clipPlane);
		shader.loadLights(lights);
		shader.loadViewMatrix(camera);
		shader.loadFog(Constants.FOG_DENSITY, Constants.FOG_GRADIENT);
		shader.loadSkyColor(Constants.BG_RED, Constants.BG_GREEN, Constants.BG_BLUE);
		renderer.renderEntities(entities);
		shader.stop();
		
		terrainShader.start();
		terrainShader.loadClipPlane(clipPlane);
		terrainShader.loadLights(lights);
		terrainShader.loadViewMatrix(camera);
		terrainShader.loadFog(Constants.FOG_DENSITY, Constants.FOG_GRADIENT);
		terrainShader.loadSkyColor(Constants.BG_RED, Constants.BG_GREEN, Constants.BG_BLUE);
		terrainRenderer.render(terrains);
		terrainShader.stop();
		
		skyboxRenderer.render(camera, Constants.BG_RED, Constants.BG_GREEN, Constants.BG_BLUE );
		
		terrains.clear();
		entities.clear();
	}
	
	public void processTerrain(Terrain terrain) {
		terrains.add(terrain);
	}
	
	public void processEntity(Entity entity) {
		TexturedModel tm = entity.getTm();
		List<Entity> batch = entities.get(tm);
		if (batch != null) {
			batch.add(entity);
		} else {
			List<Entity> newBatch = new ArrayList<Entity>();
			newBatch.add(entity);
			entities.put(tm, newBatch);
		}
	}
	
	public void cleanUp() {
		shader.cleanUp();
		terrainShader.cleanUp();
	}
	
	/**
	 * Prepare the FrameBuffer
	 * Clears the FrameBuffer to a color
	 */
	public void prepare() {
		glEnable(GL_DEPTH_TEST);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
		glClearColor(Constants.BG_RED, Constants.BG_GREEN, Constants.BG_BLUE, Constants.BG_ALPHA);							//Clear the color buffers to a certain set color: 0.3f, 0.95f, 0.8f, 1.0
	}
	
	private void createProjectionMatrix() {
		float aspectRatio = (float) Constants.DISPLAY_WIDTH / (float) Constants.DISPLAY_HEIGHT;
		float y_scale = (float) ((1f / Math.tan(Math.toRadians(Constants.FOV / 2f))) * aspectRatio);
		float x_scale = y_scale / aspectRatio;
		float frustum_length = Constants.FAR_PLANE - Constants.NEAR_PLANE;

		projectionMatrix = new Matrix4f();
		projectionMatrix.m00 = x_scale;
		projectionMatrix.m11 = y_scale;
		projectionMatrix.m22 = -((Constants.FAR_PLANE + Constants.NEAR_PLANE) / frustum_length);
		projectionMatrix.m23 = -1;
		projectionMatrix.m32 = -((2 * Constants.NEAR_PLANE * Constants.FAR_PLANE) / frustum_length);
		projectionMatrix.m33 = 0;
	}
	
	public Matrix4f getProjectionMatrix() {
		return this.projectionMatrix;
	}
}
