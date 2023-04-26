package engineTester;

import java.util.ArrayList;
import java.util.List;

import java.util.Random;

import org.lwjgl.opengl.GL11;
import org.lwjgl.opengl.GL30;

import constantValues.Constants;
import entities.*;
import guis.GuiRenderer;
import guis.GuiTexture;
import math.Vector2f;
import math.Vector3f;
import math.Vector4f;
import terrains.Terrain;
import texture.*;
import utilities.MousePicker;
import water.WaterFrameBuffers;
import water.WaterRenderer;
import water.WaterShader;
import water.WaterTile;
import model.*;
import renderEngine.*;


public class MainGameLoop{
			
		@SuppressWarnings("unused")
		public static void main(String[] args) {		
			
			WindowManager window = new WindowManager("Project");
			Loader loader = new Loader();
			MasterRenderer renderer = new MasterRenderer(loader);
			GuiRenderer guiRenderer = new GuiRenderer(loader);
			
			Light light;
			light = new Light(new Vector3f(Constants.LIGHT_X, Constants.LIGHT_Y, Constants.LIGHT_Z), new Vector3f(1, 1, 1));


			List<Light> lights = new ArrayList<Light>();
			lights.add(light);
			lights.add(new Light(new Vector3f(185,10,-293), new Vector3f(2,0,0), new Vector3f(1, 0.01f, 0.002f)));
			lights.add(new Light(new Vector3f(370,17,-300), new Vector3f(0,2,2), new Vector3f(1, 0.01f, 0.002f)));
			lights.add(new Light(new Vector3f(293,7,-305), new Vector3f(2,2,0), new Vector3f(1, 0.01f, 0.002f)));			
			
			List<Terrain> terrains = new ArrayList<Terrain>();
			TerrainTexture backgroundTexture = new TerrainTexture(loader.loadTexture("grassy"));
			TerrainTexture rTexture = new TerrainTexture(loader.loadTexture("dirt"));
			TerrainTexture gTexture = new TerrainTexture(loader.loadTexture("grassFlowers"));
			TerrainTexture bTexture = new TerrainTexture(loader.loadTexture("path"));
			TerrainTexturePack texturePack = new TerrainTexturePack(backgroundTexture, rTexture, gTexture, bTexture);
			TerrainTexture blendMap = new TerrainTexture(loader.loadTexture("blendmap"));	
			Terrain terrain = new Terrain(0,-1, loader, texturePack, blendMap, "heightmap");
			terrains.add(terrain);
			
			WaterFrameBuffers fbos = new WaterFrameBuffers();	
			WaterShader waterShader = new WaterShader();
			WaterRenderer waterRenderer = new WaterRenderer(loader, waterShader, renderer.getProjectionMatrix(), fbos);
			List<WaterTile> waters = new ArrayList<WaterTile>();
			WaterTile water = new WaterTile(160, -160, -5);
			WaterTile water2 = new WaterTile(160, -320, -5);
			WaterTile water3 = new WaterTile(160, -480, -5);
			WaterTile water4 = new WaterTile(320, -160, -5);
			WaterTile water5 = new WaterTile(320, -320, -5);
			WaterTile water6 = new WaterTile(320, -480, -5);
			WaterTile water7 = new WaterTile(480, -160, -5);
			WaterTile water8 = new WaterTile(480, -320, -5);
			WaterTile water9 = new WaterTile(480, -480, -5);

			waters.add(water);
			waters.add(water2);
			waters.add(water3);
			waters.add(water4);
			waters.add(water5);
			waters.add(water6);
			waters.add(water7);
			waters.add(water8);
			waters.add(water9);
			

//			MODELS
//			Lamps
			RawModel lampRaw = OBJLoader.loadObjModel("lamp", loader);
			ModelTexture lampTexture = new ModelTexture(loader.loadTexture("lamp"));
			lampTexture.setShineDamper(20);
			lampTexture.setReflectivity(0);
			TexturedModel lampModel = new TexturedModel(lampRaw, lampTexture);
			List<Entity> lamps = new ArrayList<Entity>();
			Random randomL = new Random();
			for(int i=0;i<20;i++){
				float x = randomL.nextFloat() * 800 - 400;
				float z = randomL.nextFloat() * -600;
				float y = terrain.getHeightOfTerrain(x, z);
				lamps.add(new Entity(lampModel, new Vector3f(x,y,z),0,randomL.nextFloat()*360,0,0.9f));
			}
			
//			Trees
			RawModel treeRaw = OBJLoader.loadObjModel("lowPolyTree", loader);
			ModelTexture treeTexture = new ModelTexture(loader.loadTexture("lowPolyTree"));
			treeTexture.setShineDamper(20);
			treeTexture.setReflectivity(0);
			TexturedModel treeModel = new TexturedModel(treeRaw, treeTexture);
			
			List<Entity> entities = new ArrayList<Entity>();
			Random randomT = new Random();
			for(int i=0;i<100;i++){
				float x = randomT.nextFloat() * 800 - 100;
				float z = randomT.nextFloat() * -480;
				float y = terrain.getHeightOfTerrain(x, z);
				entities.add(new Entity(treeModel, new Vector3f(x,y,z),0,randomT.nextFloat()*360,0,0.9f));
			}
			
//			Grass
			RawModel grassRaw = OBJLoader.loadObjModel("grassModel", loader);
			ModelTexture grassTexture = new ModelTexture(loader.loadTexture("grassTexture"));
			grassTexture.setShineDamper(20);
			grassTexture.setReflectivity(0);
			TexturedModel grassModel = new TexturedModel(grassRaw, grassTexture);
			grassModel.getTexture().setHasTransparency(true); // to make the object viewable from all sides
			grassModel.getTexture().setUseFakeLighting(true);
			Random randomG = new Random();
			for(int i=0;i<500;i++){
				float x = randomG.nextFloat() * 800 - 400;
				float z = randomG.nextFloat() * -600;
				float y = terrain.getHeightOfTerrain(x, z);
				entities.add(new Entity(grassModel, new Vector3f(x,y,z),0,randomG.nextFloat()*360,0,0.9f));
			}
			
//			Fern
			RawModel fernRaw = OBJLoader.loadObjModel("fern", loader);
			ModelTexture fernTextureAtlas = new ModelTexture(loader.loadTexture("fern"));
			fernTextureAtlas.setNumberOfRows(2);			
			fernTextureAtlas.setShineDamper(50);
			fernTextureAtlas.setReflectivity(0);
			TexturedModel fernModel = new TexturedModel(fernRaw, fernTextureAtlas);
			fernModel.getTexture().setHasTransparency(true);
			Random randomF = new Random();
			for(int i=0;i<500;i++){
				if(i%20==0) {
					float x = randomF.nextFloat() * 800 - 400;
					float z = randomF.nextFloat() * -600;
					float y = terrain.getHeightOfTerrain(x, z);					
					entities.add(new Entity(fernModel, randomF.nextInt(4), new Vector3f(x,y,z),0,randomF.nextFloat()*360,0,0.9f));
				}
			}
			
//			flower
			RawModel flowerRaw = OBJLoader.loadObjModel("flower", loader);
			ModelTexture flowerTexture = new ModelTexture(loader.loadTexture("flower"));	
			flowerTexture.setShineDamper(20);
			flowerTexture.setReflectivity(1);
			TexturedModel flowerModel = new TexturedModel(flowerRaw, flowerTexture);
			flowerModel.getTexture().setHasTransparency(true);	
			List<Entity> flower = new ArrayList<Entity>();
			Random randomFlower = new Random();
			for(int i=0;i<50;i++){
				flower.add(new Entity(flowerModel, new Vector3f(randomFlower.nextFloat()*800 - 400,0,randomFlower.nextFloat() * -600),0,0,0,3));
			}

//			Temporary Player Model (Placeholder)
			Player player = new Player(window, fernModel, new Vector3f(100,0, -50), 0, 0, 0, 1);
			List<Player> enemies = new ArrayList<Player>();
			enemies.add(player);
			Random randomE = new Random();
			for(int i=0;i<20;i++){
				float x = randomE.nextFloat() * 800 - 400;
				float z = randomE.nextFloat() * -600;
				float y = terrain.getHeightOfTerrain(x, z);
				entities.add(new Player(window, lampModel, new Vector3f(x,y,z),0,randomE.nextFloat()*360,0,0.9f));
			}
			
//			GUI
			List<GuiTexture> guis = new ArrayList<GuiTexture>();
			GuiTexture gui = new GuiTexture(loader.loadTexture("ÖM_JavaGame_Logo"), new Vector2f(0.5f, 0.5f), new Vector2f(0.25f, 0.25f));
			guis.add(gui);
					
//			Main Game Loop
			int gridX = (int) (player.getPosition().x / constantValues.Constants.TERRAIN_SIZE + 1);
			int gridZ = (int) (player.getPosition().z / constantValues.Constants.TERRAIN_SIZE + 1);
			
			Camera camera = new Camera(window.getWindowID(), player);			
			MousePicker picker = new MousePicker(camera, renderer.getProjectionMatrix(), terrain);
			
			while(!window.shouldClose()) {				
				player.move(terrain);				
				camera.move();
				
				GL11.glEnable(GL30.GL_CLIP_DISTANCE0);
				
//				Reflection
				fbos.bindReflectionFrameBuffer();
				float distance = 2* (camera.getPosition().y - water.getHeight());
				camera.getPosition().y -= distance;
				camera.invertPitch();
				renderer.renderScene(entities, terrains, lights, camera, new Vector4f(0, 1, 0, -water.getHeight()));
				for(Player enemy:enemies) {
					renderer.processEntity(enemy);
				}
				camera.getPosition().y += distance;
				camera.invertPitch();

//				Refraction
				fbos.bindRefractionFrameBuffer();
				renderer.renderScene(entities, terrains, lights, camera, new Vector4f(0, -1, 0, water.getHeight()));
				for(Player enemy:enemies) {
					renderer.processEntity(enemy);
				}
				
				GL11.glDisable(GL30.GL_CLIP_DISTANCE0);
				fbos.unbindCurrentFrameBuffer();
					
				renderer.renderScene(entities, terrains, lights, camera, new Vector4f(0, -1, 0, 15));
				waterRenderer.render(waters, camera);
				
/*GUI*/ 		guiRenderer.render(guis);
/*rendering
 *can be
 *disabled*/	
				
				window.update();		
			}
			fbos.cleanUp();
			waterShader.cleanUp();
			guiRenderer.cleanUp();
			window.cleanUp();
			renderer.cleanUp();
			loader.cleanUp();		
		}		
}