package terrains;


import java.io.File;
import java.io.IOException;

import constantValues.Constants;
import math.Vector3f;
import model.RawModel;
import renderEngine.Loader;
import texture.*;
import org.lwjgl.BufferUtils;
import org.newdawn.slick.Color;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

import math.MathUtils;
import math.Vector2f;


@SuppressWarnings("unused")
public class Terrain {

	private float x;
	private float z;
	private RawModel model;
	private TerrainTexturePack texturePack;
	private TerrainTexture blendMap;
	private static final float MAX_HEIGHT = 40;
	private static final float MIN_HEIGHT = -40;
	private static final float MAX_PIXEL_COLOR = 256 * 256 * 256;
	
	private float[][] heights;
	
	public Terrain(int gridX, int gridZ, Loader loader, TerrainTexturePack texturePack, TerrainTexture blendMap, String heightMap) {
		this.texturePack = texturePack;
		this.blendMap = blendMap;
		this.x = gridX * Constants.TERRAIN_SIZE;
		this.z = gridZ * Constants.TERRAIN_SIZE;
		model = generateTerrain(loader, heightMap);
	}
	
	public float getX() {
		return x;
	}
	
	public float getZ() {
		return z;
	}
	
	public RawModel getModel() {
		return model;
	}
	
	public TerrainTexturePack getTexturePack() {
		return texturePack;
	}

	public TerrainTexture getBlendMap() {
		return blendMap;
	}

	public float getHeightOfTerrain(float worldX, float worldZ) {
		float terrainX = worldX - this.x;
		float terrainZ = worldZ - this.z;
		float gridSquareSize = constantValues.Constants.TERRAIN_SIZE / ((float)heights.length);
		int gridX = (int) Math.floor(terrainX / gridSquareSize);
		int gridZ = (int) Math.floor(terrainZ / gridSquareSize);
		if(gridX >= heights.length - 1 || gridZ >= heights.length -1 || gridX < 0 || gridZ < 0) {
			return 0;
		}
		float xCoord = (terrainX % gridSquareSize)/gridSquareSize;
		float zCoord = (terrainZ % gridSquareSize)/gridSquareSize;
		float answer;
		if(xCoord <= (1-zCoord)) {
			answer = MathUtils.barryCentric(new Vector3f(0, heights[gridX][gridZ], 0), new Vector3f(1,
							heights[gridX + 1][gridZ], 0), new Vector3f(0,
							heights[gridX][gridZ + 1], 1), new Vector2f(xCoord, zCoord));
		} else {
			answer = MathUtils.barryCentric(new Vector3f(1, heights[gridX + 1][gridZ], 0), new Vector3f(1,
							heights[gridX + 1][gridZ + 1], 1), new Vector3f(0,
							heights[gridX][gridZ + 1], 1), new Vector2f(xCoord, zCoord));
		}
		
		return answer;
	}
	
	private RawModel generateTerrain(Loader loader, String heightMap){
		HeightsGenerator generator = new HeightsGenerator();
		BufferedImage image = null;
		
		try {
			image = ImageIO.read(new File("res/" + heightMap + ".png"));
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		int VERTEX_COUNT = 128;
		heights = new float[Constants.TERRAIN_VERTEX_COUNT][Constants.TERRAIN_VERTEX_COUNT];
		int count = Constants.TERRAIN_VERTEX_COUNT * Constants.TERRAIN_VERTEX_COUNT;
		float[] vertices = new float[count * 3];
		float[] normals = new float[count * 3];
		float[] textureCoords = new float[count*2];
		int[] indices = new int[6*(Constants.TERRAIN_VERTEX_COUNT-1)*(Constants.TERRAIN_VERTEX_COUNT-1)];
		int vertexPointer = 0;
		for(int i=0;i<Constants.TERRAIN_VERTEX_COUNT;i++){
			for(int j=0;j<Constants.TERRAIN_VERTEX_COUNT;j++){
				vertices[vertexPointer*3] = (float)j/((float)Constants.TERRAIN_VERTEX_COUNT - 1) * Constants.TERRAIN_SIZE;
				float height = getHeight(j,i,generator);
				heights[j][i] = height;
				vertices[vertexPointer*3+1] = height;
				vertices[vertexPointer*3+2] = (float)i/((float)Constants.TERRAIN_VERTEX_COUNT - 1) * Constants.TERRAIN_SIZE;
				Vector3f normal = calculateNormal(j, i, generator);
				
				normals[vertexPointer*3] = normal.x;
				normals[vertexPointer*3+1] = normal.y;
				normals[vertexPointer*3+2] = normal.z;
				
				textureCoords[vertexPointer*2] = (float)j/((float)Constants.TERRAIN_VERTEX_COUNT - 1);
				textureCoords[vertexPointer*2+1] = (float)i/((float)Constants.TERRAIN_VERTEX_COUNT - 1);
				vertexPointer++;
			}
		}
		int pointer = 0;
		for(int gz=0;gz<Constants.TERRAIN_VERTEX_COUNT-1;gz++){
			for(int gx=0;gx<Constants.TERRAIN_VERTEX_COUNT-1;gx++){
				int topLeft = (gz*Constants.TERRAIN_VERTEX_COUNT)+gx;
				int topRight = topLeft + 1;
				int bottomLeft = ((gz+1)*Constants.TERRAIN_VERTEX_COUNT)+gx;
				int bottomRight = bottomLeft + 1;
				indices[pointer++] = topLeft;
				indices[pointer++] = bottomLeft;
				indices[pointer++] = topRight;
				indices[pointer++] = topRight;
				indices[pointer++] = bottomLeft;
				indices[pointer++] = bottomRight;
			}
		}
		return loader.loadToVAO(vertices, textureCoords, normals, indices);
	}
	
	private Vector3f calculateNormal(int x, int z, HeightsGenerator generator) {
		float heightL = getHeight(x-1, z, generator);
		float heightR = getHeight(x+1, z, generator);
		float heightD = getHeight(x, z-1, generator);
		float heightU = getHeight(x, z+1, generator);
		Vector3f normal = new Vector3f(heightL-heightR, 2f, heightD - heightU);
		normal.normalize();
		return normal;
	}
	
	private float getHeight(int x, int z, HeightsGenerator generator) {
		return generator.generateHeight(x, z);
	}	
}
