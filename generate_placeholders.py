from PIL import Image

def create_placeholder(filename, color):
    img = Image.new('RGBA', (64, 64), color)
    img.save(f"public/{filename}")
    print(f"Created {filename}")

create_placeholder('bird.png', (255, 255, 0, 255))      # Yellow
create_placeholder('plant.png', (0, 255, 0, 255))       # Green
create_placeholder('bookshelf.png', (139, 69, 19, 255)) # Brown
