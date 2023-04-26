package renderEngine;

import java.util.List;
import java.util.Map;

import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL13;
import org.lwjgl.opengl.GL20;
import org.lwjgl.opengl.GL30;

//import constantValues.Constants;
import entities.*;
import math.*;
import model.*;
import shaders.StaticShader;
import texture.ModelTexture;

public class EntityRenderer {
	
	private StaticShader shader;
	
	public EntityRenderer(StaticShader shader, Matrix4f projectionMatrix) {
		this.shader = shader;
		shader.start();
		shader.loadProjectionMatrix(projectionMatrix);
		shader.stop();
	}
	
	public void renderEntities(Map<TexturedModel, List<Entity>> entities) {
		for(TexturedModel model : entities.keySet()) {
			prepareTexturedModel(model);
			List<Entity> batch = entities.get(model);
			for (Entity entity : batch) {
				prepareInstance(entity);
				GL11.glDrawElements(GL11.GL_TRIANGLES, model.getModel().getVertexCount(), GL11.GL_UNSIGNED_INT, 0);
			}
			unbindTexturedModel();
		}		
	}
	
	private void prepareTexturedModel(TexturedModel model) {
		RawModel rm = model.getModel();
		GL30.glBindVertexArray(rm.getVaoID());
		GL20.glEnableVertexAttribArray(0);
		GL20.glEnableVertexAttribArray(1);
		GL20.glEnableVertexAttribArray(2);
		ModelTexture texture = model.getTexture();
		shader.loadNumberOfRows(texture.getNumberOfRows());
		if (model.getTexture().isHasTransparency())
			MasterRenderer.disableCulling();
		shader.loadSpecular(model.getTexture().getShineDamper(), model.getTexture().getReflectivity());
		shader.loadFakeLightingVariable(model.getTexture().isUseFakeLighting());
		GL13.glActiveTexture(GL13.GL_TEXTURE0);
		GL11.glBindTexture(GL11.GL_TEXTURE_2D, model.getTexture().getID());
	}
	
	private void unbindTexturedModel() {
		MasterRenderer.enableCulling();
		GL20.glDisableVertexAttribArray(0);
		GL20.glDisableVertexAttribArray(1);
		GL20.glDisableVertexAttribArray(2);
		GL30.glBindVertexArray(0);
		
	}
	
	private void prepareInstance(Entity entity) {
		shader.loadTransformationMatrix(MathUtils.createTransformationMatrix(entity.getPosition(), 
				entity.getRx(), entity.getRy(), entity.getRz(), entity.getScale()));
		shader.loadOffset(entity.getTextureXOffset(), entity.getTextureYOffset());
		
	}
}
