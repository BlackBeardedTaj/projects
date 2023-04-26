package entities;

import org.lwjgl.glfw.GLFW;

import constantValues.Constants;
import math.Vector3f;
import model.TexturedModel;
import renderEngine.WindowManager;
import terrains.Terrain;

@SuppressWarnings("unused")
public class Player extends Entity{
	
	private float currentSpeed = 0;
	private float currentTurnSpeed = 1;
	private float currentJump = 0;
	private WindowManager window;
	private long windowID;
	
	private boolean isInAir = false;
	
	public Player(TexturedModel tm, Vector3f position, float rx, float ry, float rz, float scale) {
		super(tm, position, rx, ry, rz, scale);
	}
	
	public Player(WindowManager window, TexturedModel tm, Vector3f position, float rx, float ry, float rz, float scale) {
		super(tm, position, rx, ry, rz, scale);
		this.window = window;
		this.windowID = window.getWindowID();
	}
	
	public void move(Terrain terrain) {
		checkInputs();
		super.increaseRotation(0, currentTurnSpeed, 0);
		float distance = currentSpeed * WindowManager.getDelta();
		float dx = -(float)(distance * Math.sin(Math.toRadians(super.getRy())));
		float dz = -(float)(distance * Math.cos(Math.toRadians(super.getRy())));
		super.increasePosition(dx, 0, dz);
		currentJump += Constants.ENVIRONMENT_GRAVITY;
		super.increasePosition(0, currentJump, 0);
		float terrainHeight = terrain.getHeightOfTerrain(super.getPosition().x, super.getPosition().z);
		if(super.getPosition().y < terrainHeight) {
			currentJump = 0;
			isInAir = false;
			super.getPosition().y = terrainHeight;
		}
	}
	
	public Player moveEnemy(Terrain terrain) {
		while(true) {
			super.increaseRotation(0, currentTurnSpeed, 0);
			float distance = currentSpeed * WindowManager.getDelta();
			float dx = -(float)(distance * Math.sin(Math.toRadians(super.getRy())))* WindowManager.getDelta();
			float dz = -(float)(distance * Math.cos(Math.toRadians(super.getRy())))* WindowManager.getDelta();
			super.increasePosition(dx, 0, dz);
			currentJump += Constants.ENVIRONMENT_GRAVITY;
			super.increasePosition(0, currentJump, 0);
			float terrainHeight = terrain.getHeightOfTerrain(super.getPosition().x, super.getPosition().z);
			if(super.getPosition().y < terrainHeight) {
				currentJump = 0;
				isInAir = false;
				super.getPosition().y = terrainHeight;
			}	
		}
		
	}
	
	private void jump() {
		if(!isInAir) {
			this.currentJump = Constants.PLAYER_JUMP;
			isInAir = true;
		}
	}

	private void checkInputs() {
		
		if(GLFW.glfwGetKey(windowID, GLFW.GLFW_KEY_W) == 1 || GLFW.glfwGetKey(windowID, GLFW.GLFW_KEY_UP) == 1) {
			this.currentSpeed = Constants.PLAYER_SPEED;
		} else if(GLFW.glfwGetKey(windowID, GLFW.GLFW_KEY_S) == 1 || GLFW.glfwGetKey(windowID, GLFW.GLFW_KEY_DOWN) == 1) {
			this.currentSpeed = -Constants.PLAYER_SPEED;
		} else {
			this.currentSpeed = 0;
		}
		
		if(GLFW.glfwGetKey(windowID, GLFW.GLFW_KEY_D) == 1 || GLFW.glfwGetKey(windowID, GLFW.GLFW_KEY_RIGHT) == 1) {
			this.currentTurnSpeed = -Constants.PLAYER_TURN;
		} else if(GLFW.glfwGetKey(windowID, GLFW.GLFW_KEY_A) == 1 || GLFW.glfwGetKey(windowID, GLFW.GLFW_KEY_LEFT) == 1) {
			this.currentTurnSpeed = Constants.PLAYER_TURN;
		} else {
			this.currentTurnSpeed = 0;
		}
		
		if(GLFW.glfwGetKey(windowID, GLFW.GLFW_KEY_SPACE) == 1) {
			jump();
		} 
	}	
}
