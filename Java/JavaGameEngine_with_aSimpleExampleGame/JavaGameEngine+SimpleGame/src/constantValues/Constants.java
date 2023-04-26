package constantValues;

public class Constants {

	//Display
	public static final int DISPLAY_WIDTH = /*1024;*/1920;
	public static final int DISPLAY_HEIGHT = /*720;*/1080;
	
	//Background Color
	public static final float BG_RED = 1f;
	public static final float BG_GREEN = 1f;
	public static final float BG_BLUE = 1f;
	public static final float BG_ALPHA = 1.0f;
	
	//Terrain
	public static final int TERRAIN_VERTEX_COUNT = 128;
	public static final float TERRAIN_SIZE = 640;
	
	//Projection Matrix
	public static final float FOV = 70;
	public static final float NEAR_PLANE = 0.5f;
	public static final float FAR_PLANE = 1000;
	
	//FPS/UPS
	public static final double NS = 1000000000/160.0;
	
	//Camera
	public static final float CAM_SPEED = 0.8f;
	public static final float CAM_X = 0;
	public static final float CAM_Y = 50;
	public static final float CAM_Z = 50;
	public static final float CAM_PITCH = 20;
	public static final float CAM_YAW = 10;
	public static final float CAM_ROLL = 0;
	
	//Light
	public static final float LIGHT_X = 0;
	public static final float LIGHT_Y = 1000;
	public static final float LIGHT_Z = 7000;
	
	//Fog
	public static final float FOG_DENSITY= 0.0015f;
	public static final float FOG_GRADIENT = 3.0f;
	
	//Player
	public static final float PLAYER_SPEED = 2;
	public static final float PLAYER_TURN = 5;
	public static final float PLAYER_JUMP = 3;
	
	//Environment
	public static final float ENVIRONMENT_GRAVITY = -0.2f;
//	public static final float ENVIRONMENT_HEIGHT = 0;
	
}
