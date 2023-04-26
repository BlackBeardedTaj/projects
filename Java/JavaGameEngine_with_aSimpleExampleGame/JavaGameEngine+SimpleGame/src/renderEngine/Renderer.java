package renderEngine;

import static org.lwjgl.opengl.GL11.*;

//import org.lwjgl.opengl.GL;
import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL20;
import org.lwjgl.opengl.GL30;

//import constantValues.Constants;
import model.RawModel;

public class Renderer {

	public void prepare() {
		glEnable(GL_DEPTH_TEST);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
		GL11.glClearColor(1, 0, 0, 1);	
	}
	
	public void render(RawModel model) {
		GL30.glBindVertexArray(model.getVaoID());
		GL20.glEnableVertexAttribArray(0);
		GL11.glDrawArrays(GL11.GL_TRIANGLES, 0, model.getVertexCount());
		GL20.glDisableVertexAttribArray(0);
		GL30.glBindVertexArray(0);
	}
	
}
