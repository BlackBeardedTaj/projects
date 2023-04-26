package renderEngine;

import java.io.FileInputStream;
import java.nio.ByteBuffer;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;
import java.util.ArrayList;
import java.util.List;

import org.lwjgl.BufferUtils;
import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL13;
import org.lwjgl.opengl.GL14;
import org.lwjgl.opengl.GL15;
import org.lwjgl.opengl.GL20;
import org.lwjgl.opengl.GL30;

import de.matthiasmann.twl.utils.PNGDecoder;
import de.matthiasmann.twl.utils.PNGDecoder.Format;
import model.RawModel;
import texture.Texture;
import texture.TextureData;


public class Loader {
	
	private List<Integer> vaos = new ArrayList<Integer>();
	private List<Integer> vbos = new ArrayList<Integer>();
	private List<Integer> textures = new ArrayList<Integer>();
	public Loader() {
		
	}
	
	/**
	 * @author NL
	 * Takes in positions of a model and turns it into a raw model
	 * 1. Create a VAO
	 * 2. Store data in attribute lists
	 * 3. Unbind the VAO
	 * @param pos coordinates of the position
	 * @return RawModel
	 */
	public RawModel loadToVAO(float[] pos, float[] textureCoords, float[] normals, int[] indices) {
		int vaoID = createVAO();
		bindIndicesBuffer(indices);
		storeDataInVAO(0, 3, pos);
		storeDataInVAO(1, 2, textureCoords);
		storeDataInVAO(2, 3, normals);
		unbindVAO();
		return new RawModel(vaoID, indices.length);
	}
	
//	Method to load a GUI (texts)
	public RawModel loadToVAO(float[] positions, int dimensions) {
		int vaoID= createVAO();
		this.storeDataInVAO(0, dimensions, positions);
		unbindVAO();
		return new RawModel(vaoID, positions.length/dimensions);
	}
	
	
	public int loadTexture(String fileName) {
		Texture texture = new Texture("res/" + fileName + ".png");
		GL30.glGenerateMipmap(GL11.GL_TEXTURE_2D);
		GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, GL11.GL_LINEAR_MIPMAP_LINEAR);
		GL11.glTexParameterf(GL11.GL_TEXTURE_2D, GL14.GL_TEXTURE_LOD_BIAS, -0.2f);
		int textureID = texture.getID();
		textures.add(textureID);
		return textureID;
	}
	
	public void cleanUp() {
		for (Integer x : vaos)
			GL30.glDeleteVertexArrays(x);
		for (Integer x : vbos)
			GL15.glDeleteBuffers(x);
		for (Integer x : textures)
			GL11.glDeleteTextures(x);
	}
	
	public int loadCubeMap(String[] textureFiles) {
		int texID = GL11.glGenTextures();
		GL13.glActiveTexture(GL13.GL_TEXTURE0);
		GL11.glBindTexture(GL13.GL_TEXTURE_CUBE_MAP, texID);
		
		for(int i=0;i<textureFiles.length;i++) {
			TextureData data = decodeTextureFile("res/" + textureFiles[i] + ".png");
			GL11.glTexImage2D(GL13.GL_TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, GL11.GL_RGBA, data.getWidth(),
					data.getHeight(), 0, GL11.GL_RGBA, GL11.GL_UNSIGNED_BYTE, data.getBuffer());
			
		}
		GL11.glTexParameteri(GL13.GL_TEXTURE_CUBE_MAP, GL11.GL_TEXTURE_MAG_FILTER, GL11.GL_LINEAR);
		GL11.glTexParameteri(GL13.GL_TEXTURE_CUBE_MAP, GL11.GL_TEXTURE_MIN_FILTER, GL11.GL_LINEAR);
		textures.add(texID);
		return texID;

	}
	
	private TextureData decodeTextureFile(String fileName) {
		int width = 0;
		int height = 0;
		ByteBuffer buffer = null;
		try {
			FileInputStream in = new FileInputStream(fileName);
			PNGDecoder decoder = new PNGDecoder(in);
			width = decoder.getWidth();
			height = decoder.getHeight();
			buffer = ByteBuffer.allocateDirect(4 * width * height);
			decoder.decode(buffer, width * 4, Format.RGBA);
			buffer.flip();
			in.close();
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("Tried to load texture " + fileName + ", didn't work");
			System.exit(-1);
		}
		return new TextureData(buffer, width, height);
	}
	
	private int createVAO() {
		int vaoID = GL30.glGenVertexArrays();
		GL30.glBindVertexArray(vaoID);
		vaos.add(vaoID);
		return vaoID;
	}
	
	/**
	 * @author NL
	 * Takes in the data and assigns it to a VBO
	 * 1. Create a VBO
	 * 2. Bind the VBO
	 * 3. Store the data in a float buffer
	 * @param attribListNum
	 * @param data
	 */
	private void storeDataInVAO(int attribListNum, int coordSize, float[] data) {
		int vboID = GL15.glGenBuffers();					
		vbos.add(vboID);
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, vboID);					
		FloatBuffer dataFloatBuffer = storeDataAsFloatBuffer(data);
		GL15.glBufferData(GL15.GL_ARRAY_BUFFER, dataFloatBuffer, GL15.GL_STATIC_DRAW);	
		GL20.glVertexAttribPointer(attribListNum, coordSize, GL11.GL_FLOAT, false, 0, 0);		
		GL15.glBindBuffer(GL15.GL_ARRAY_BUFFER, 0);
	}
	
	private void unbindVAO() {
		GL30.glBindVertexArray(0); 							
	}
	
	private void bindIndicesBuffer(int[] indices) {
		int vboID = GL15.glGenBuffers();
		vbos.add(vboID);
		GL15.glBindBuffer(GL15.GL_ELEMENT_ARRAY_BUFFER, vboID);
		IntBuffer dataIntBuffer = storeDataAsIntBuffer(indices);
		GL15.glBufferData(GL15.GL_ELEMENT_ARRAY_BUFFER, dataIntBuffer, GL15.GL_STATIC_DRAW);
	}
	
	private IntBuffer storeDataAsIntBuffer(int[] data) {
		IntBuffer buffer = BufferUtils.createIntBuffer(data.length);
		buffer.put(data);
		buffer.flip();
		return buffer;
	}
	
	private FloatBuffer storeDataAsFloatBuffer(float[] data) {
		FloatBuffer buffer = BufferUtils.createFloatBuffer(data.length);
		buffer.put(data);
		buffer.flip();
		return buffer;
	}
	
}
