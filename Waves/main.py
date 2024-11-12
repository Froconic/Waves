import os, random
# from pyscript import document

images = []
path = "/home/rivre/Code/Generative/Waves/Waves/img/"
counter = 0

for img in os.listdir(path):
  images.append(img)

print(images)
totalCount = len(images)
print(f"Total images: {totalCount}")

choice = random.randint(0,totalCount)-1

image = images[choice]
print(f"Image chosen: {image}")

# display = document.querySelector('#image1')
# inputText = image
# display.value = inputText

# print(display)
