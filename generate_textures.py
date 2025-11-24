from PIL import Image

def create_placeholder(filename, size, color):
    img = Image.new('RGB', size, color)
    img.save(f"public/{filename}")
    print(f"Created {filename}")

# Dimensions based on 100px per unit
# Floor: 12x12 -> 1200x1200
create_placeholder('floor.jpg', (1200, 1200), (139, 69, 19)) # Brown

# North Wall: 12x8 -> 1200x800
create_placeholder('wall_north.jpg', (1200, 800), (200, 200, 200)) # Light Gray

# West Wall: 12x8 -> 1200x800 (Rotated visually, but texture is rectangular)
create_placeholder('wall_west.jpg', (1200, 800), (180, 180, 180)) # Slightly Darker Gray
