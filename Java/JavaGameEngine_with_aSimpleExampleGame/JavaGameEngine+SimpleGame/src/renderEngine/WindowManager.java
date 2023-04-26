package renderEngine;

import static org.lwjgl.glfw.GLFW.*;

import static org.lwjgl.opengl.GL11.*;
import static org.lwjgl.system.MemoryUtil.NULL;

import org.lwjgl.glfw.GLFWVidMode;
import org.lwjgl.opengl.GL;
import constantValues.Constants;
import entities.Light;
import math.Vector3f;

@SuppressWarnings("unused")
public class WindowManager {
	private static int display_width = Constants.DISPLAY_WIDTH;
	private static int display_height = Constants.DISPLAY_HEIGHT;
	private long window;
	public int frames;
	public static long time;
	
	private long lastFrameTime;
	private long lostTime = System.nanoTime();
	private long currTime = lostTime;
	private long timer = System.currentTimeMillis();
	private static float delta = 0.0f;
	private int fps = 0;
	private int ups = 0;

	public WindowManager(String title) {
		this.window = createWindow(title);
	}
	
	public long getWindowID() {
		return window;
	}
	
	public boolean shouldClose() {
		if (!glfwWindowShouldClose(window))
			return false;
		return true;
	}
	
	public void hide() {
		glfwHideWindow(window);
	}
	
	public void show() {
		glfwShowWindow(window);
	}
	
	public void cleanUp() {
		glfwHideWindow(window);
		glfwDestroyWindow(window);
	}
	public void update() {
    	glfwSwapBuffers(window);
    	updateTimer();
	}
    	
	private long createWindow(String title) {
		glfwInit();
		
		glfwDefaultWindowHints();
		glfwWindowHint(GLFW_SAMPLES, GL_DONT_CARE);
		glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
		glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 2);
		glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
		glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
		glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
		glfwWindowHint(GLFW_VISIBLE, GL_TRUE);
		glfwWindowHint(GLFW_DECORATED, GL_TRUE);
		glfwWindowHint(GLFW_FOCUSED, GL_TRUE);
		
		long windowID = glfwCreateWindow(display_width, display_height, title, NULL, NULL);
		
		GLFWVidMode vidmode = glfwGetVideoMode(glfwGetPrimaryMonitor());
		int x = (vidmode.width() - display_width) / 2;
		int y = (vidmode.height() - display_height) / 2;
		glfwSetWindowPos(windowID, x, y);		
		
		glfwMakeContextCurrent(windowID);
		glfwSwapInterval(1);
		GL.createCapabilities();
		
		return windowID;
	}
	
	public void setTitle(String title) {
		glfwSetWindowTitle(window, title);
	}
	
	public static float getDelta() {
    	return delta;
    }
	
	private void updateTimer() {    	
		currTime = System.nanoTime();
		delta += (currTime - lostTime) / Constants.NS;
		lostTime = currTime;	
		while (delta >= 1.0) {
			glfwPollEvents();
			ups++;
			delta--;
		}
		fps++;		
		if (System.currentTimeMillis() > timer + 1000) {
			setTitle("ups: " + ups + ", fps: " + fps);
			ups = 0;
			fps = 0;
			timer += 1000;
		}		
	}

	public static int getDisplay_width() {
		return display_width;
	}

	public static int getDisplay_height() {
		return display_height;
	}
}
