package shaders;

import java.util.List;

import entities.Camera;
import entities.Light;
import math.MathUtils;
import math.Matrix4f;
import math.Vector3f;
import math.Vector4f;

public class TerrainShader extends GenericShader {

	private static final int MAX_LIGHTS = 4;
	
	private static final String VERTEX_FILE = "src/shaders/terrainVertexShader.txt";
	private static final String FRAGMENT_FILE = "src/shaders/terrainFragmentShader.txt";
	
	private int location_transformationMatrix;
	private int location_projectionMatrix;
	private int location_viewMatrix;
	private int location_lightPos[];
	private int location_lightColor[];
	private int location_attenuation[];
	private int location_shineDamper;
	private int location_reflectivity;
	private int location_skyColor;
	private int location_backgroundTexture;
	private int location_rTexture;
	private int location_gTexture;
	private int location_bTexture;
	private int location_blendMap;
	private int location_density;
	private int location_gradient;
	private int location_plane;

	public TerrainShader() {
		super(VERTEX_FILE, FRAGMENT_FILE);
	}
	
	@Override
	protected void bindAttributes() {
		super.bindAttribute(0, "pos");
		super.bindAttribute(1, "textureCoords");
		super.bindAttribute(2, "normals");
	}

	@Override
	protected void getAllUniformLocations() {
		location_transformationMatrix = super.getUniformLocation("transformationMatrix");
		location_projectionMatrix = super.getUniformLocation("projectionMatrix");
		location_viewMatrix = super.getUniformLocation("viewMatrix");
		location_shineDamper = super.getUniformLocation("shineDamper");
		location_reflectivity = super.getUniformLocation("reflectivity");
		location_skyColor = super.getUniformLocation("skyColor");
		location_backgroundTexture = super.getUniformLocation("backgroundTexture");
		location_rTexture = super.getUniformLocation("rTexture");
		location_gTexture = super.getUniformLocation("gTexture");
		location_bTexture = super.getUniformLocation("bTexture");
		location_blendMap = super.getUniformLocation("blendMap");
		location_density = super.getUniformLocation("density");
		location_gradient = super.getUniformLocation("gradient");
		location_plane = super.getUniformLocation("plane");
		
		location_lightPos = new int[MAX_LIGHTS];
		location_lightColor = new int[MAX_LIGHTS];
		location_attenuation = new int[MAX_LIGHTS];
		for(int i=0;i<MAX_LIGHTS;i++) {
			location_lightPos[i] = super.getUniformLocation("lightPos[" + i + "]");
			location_lightColor[i] = super.getUniformLocation("lightColor[" + i + "]");
			location_attenuation[i] = super.getUniformLocation("attenuation[" + i + "]");
		}
	}
	
	public void loadClipPlane(Vector4f plane) {
		super.loadVector(location_plane, plane);
	}
	
	public void loadTextures() {
		super.loadInt(location_backgroundTexture, 0);
		super.loadInt(location_rTexture, 1);
		super.loadInt(location_gTexture, 2);
		super.loadInt(location_bTexture, 3);
		super.loadInt(location_blendMap, 4);
	}
	
	public void loadFog(float density, float gradient) {
		super.loadFloat(location_density, density);
		super.loadFloat(location_gradient, gradient);
	}
	
	public void loadSkyColor(float r, float g, float b) {
		super.loadVector(location_skyColor, new Vector3f(r, g, b));
	}
	
	public void loadSpecular(float shineDamper, float reflectivity) {
		super.loadFloat(location_shineDamper, shineDamper);
		super.loadFloat(location_reflectivity, reflectivity);
	}
	
	public void loadLights(List<Light> lights) {
		for(int i=0;i<MAX_LIGHTS;i++) {
			if(i<lights.size()) {
				super.loadVector(location_lightPos[i], lights.get(i).getPos());
				super.loadVector(location_lightColor[i], lights.get(i).getColor());
				super.loadVector(location_attenuation[i], lights.get(i).getAttenuation());
			} else {
				super.loadVector(location_lightPos[i], new Vector3f(0, 0, 0));
				super.loadVector(location_lightColor[i], new Vector3f(0, 0, 0));
				super.loadVector(location_attenuation[i], new Vector3f(1, 0, 0));
			}
		}
	}

	public void loadTransformationMatrix(Matrix4f mat) {
		super.loadMatrix(location_transformationMatrix, mat);
	}
	
	public void loadProjectionMatrix(Matrix4f mat) {
		super.loadMatrix(location_projectionMatrix, mat);
	}
	
	public void loadViewMatrix(Camera camera) {
		Matrix4f mat = MathUtils.createViewMatrix(camera);
		super.loadMatrix(location_viewMatrix, mat);
	}
	
}
