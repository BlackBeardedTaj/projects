package entities;

import math.Vector3f;

public class Light {
	
	private Vector3f pos;
	private Vector3f color;
	private Vector3f attenuation = new Vector3f(1,0,0);
	
	public Light(Vector3f pos, Vector3f color) {
		super();
		this.pos = pos;
		this.color = color;
	}
	
	public Light(Vector3f pos, Vector3f color, Vector3f attenuation) {
		super();
		this.pos = pos;
		this.color = color;
		this.attenuation = attenuation;
	}

	
	public Vector3f getAttenuation() {
		return attenuation;
	}

	public Vector3f getPos() {
		return pos;
	}

	public void setPos(Vector3f pos) {
		this.pos = pos;
	}

	public Vector3f getColor() {
		return color;
	}

	public void setColor(Vector3f color) {
		this.color = color;
	}

	
	
	
	
}
