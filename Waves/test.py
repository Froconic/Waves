import os

images = "img/"
counter = 0

for image in os.listdir(images):
  with open(os.path.join(images,image)) as f:
      counter+=1
      print(f"File detected: {image}")
    # display(counter)
print(f"Images: {counter}")