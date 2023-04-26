import open3d as o3d
import numpy as np
import matplotlib.pyplot as plt
import os
import sys
import cv2

# Visualisation monkey patch and help to load geometries
sys.path.append('Opem3D-master/examples/python/')
import open3d_tutorial as o3dtut
# Change to TRUE to interact with the visualization
o3dtut.interactive = not "CI" in os.environ

# Loading in color and depth image to create the point cloud
# print("Read Redwood dataset")
color_raw = o3d.io.read_image("./MonocularCameraDepthAndColorImage/C_D_Images/colorImg.jpg")
depth_raw = o3d.io.read_image("./MonocularCameraDepthAndColorImage/C_D_Images/depthImg.png")
rgbd_image = o3d.geometry.RGBDImage.create_from_color_and_depth(color_raw, depth_raw)
print(rgbd_image)

# Plot the images
plt.subplot(1, 2, 1)
plt.title('Grayscale image')
plt.imshow(rgbd_image.color)
plt.subplot(1, 2, 2)
plt.title('Depth image')
plt.imshow(rgbd_image.depth)
plt.show()

# Camera intrinsic parameters from Camera Calibration
cv_file = cv2.FileStorage()
cv_file.open('C:/Users/Kompjuter/Documents/Lab/Workspace_Visual_Studio_Code/Python Projects/Photogrammetry/Python_From_Office/cameraIntrinsics.xml', cv2.FileStorage_READ)

camera_intrinsic = cv_file.getNode('intrinsic').mat()
print(camera_intrinsic)

# Set the intrinsic camera parameters
camera_intrinsic = o3d.camera.PinholeCameraIntrinsic(width=1800, height=1012, fx=camera_intrinsic[0][0],fy=camera_intrinsic[1][1], cx=camera_intrinsic[0][2], cy=camera_intrinsic[1][2])
print(camera_intrinsic.intrinsic_matrix)

# Create the point cloud from images and camera intrinsic parameters
pcd = o3d.geometry.PointCloud.create_from_rgbd_image(rgbd_image, camera_intrinsic)

# Flip the output or it will be upside down
pcd.transform([[1,0,0,0], [0,-1,0,0], [0,0,-1,0], [0,0,0,1]])
o3d.visualization.draw_geometries([pcd], zoom=0.5)



