import numpy as np 
import cv2
import time
from matplotlib import pyplot as plt

# Downsampling image n number (reducing_factor) of times
def downsample_image(image, reducing_factor):
    for i in range(0, reducing_factor):
        # See if image color or gray
        if len(image.shape) > 2:
            row,col = image.shape[:2]
        else:
            row ,col = image.shape

        image = cv2.pyrDown(image, dstsize= (col//2, row//2))
    return image

path_model = "models/"

# Read Network
model_name = "model-f6b98070.onnx"; # MiDaS v.2.1 Large

# Load the DNN model
model = cv2.dnn.readNet(path_model + model_name)

if (model.empty()):
    print("Could not load the neural network, check the path!")

img = cv2.imread('./object1.jpg', 0)

# Take image from Webcam
# capture = cv2.VideoCapture(0)

# Read in the image
# success, img = imgFromHDD.read()

# # Start time, needed to calculate FPS
# start = time.time()



cv2.imshow('image', img)
cv2.waitKey(0)

img = downsample_image(img, 1)

cv2.imshow('image', img)
cv2.waitKey(0)

img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

imgHeight, imgWidth, channels = img.shape

# create Blob from input image
# MiDaS v2.1 Large ( Scale : 1/255, Size : 384 x 384, Mean Substraction : (123.675, 116.28, 103.53), Channels Order : RGB )
blob = cv2.dnn.blobFromImage(img, 1/255., (384,384), (123.675, 116.28, 103.53), True, False)

# MiDaS v2.1 Small ( Scale : 1/255, Size : 256 x 256, Mean Substraction : (123.675, 116.28, 103.53), Channels Order : RGB ) 
# It works faster
# blob = cv2.dnn.blobFromImage(img, 1/255., (256,256), (123.675, 116.28, 103.53), True, False)

# Set input to the model
model.setInput(blob)

# Make forward pass in model (forward pass through a neural network)
output = model.forward()

# This is our depth map
output = output[0,:,:]
# We have to resize our depth map to the size of our image
output = cv2.resize(output, (imgWidth, imgHeight))

# Normalize the output (dtype=cv2.CV_32F => we need that type to make 3D object in the next step)
output = cv2.normalize(output, None, 0, 255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC1)

output_opencv = cv2.normalize(output, None, 0, 1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32FC1)

cv2.imwrite('C:/Users/Kompjuter/Documents/Lab/Workspace_Visual_Studio_Code/Python Projects/Photogrammetry/Python_From_Office/MonocularCameraDepthAndColorImage/C_D_Images/colorImg.jpg', img)
cv2.imwrite('C:/Users/Kompjuter/Documents/Lab/Workspace_Visual_Studio_Code/Python Projects/Photogrammetry/Python_From_Office/MonocularCameraDepthAndColorImage/C_D_Images/depthImg.png', output)

plt.imshow(output, 'gray')
plt.show()