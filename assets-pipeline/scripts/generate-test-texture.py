import os
from PIL import Image, ImageDraw

def generate_uv_test_grid():
    width, height = 2048, 2048
    img = Image.new('RGB', (width, height), color='#1E293B')
    draw = ImageDraw.Draw(img)

    grid_size = 128
    cols = width // grid_size
    rows = height // grid_size

    # Draw checkerboard pattern
    for r in range(rows):
        for c in range(cols):
            x1 = c * grid_size
            y1 = r * grid_size
            x2 = x1 + grid_size
            y2 = y1 + grid_size

            fill_color = '#0F172A' if (r + c) % 2 == 0 else '#334155'
            draw.rectangle([x1, y1, x2, y2], fill=fill_color, outline='#475569')

            # Draw coordinate text
            text = f"{chr(65 + r % 26)}{c+1}"
            draw.text((x1 + 10, y1 + 10), text, fill='#F59E0B')

    # Draw center axis crosshair
    draw.line([(width//2, 0), (width//2, height)], fill='#E11D48', width=4)
    draw.line([(0, height//2), (width, height//2)], fill='#0284C7', width=4)

    # Save texture
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../textures'))
    os.makedirs(output_dir, exist_ok=True)
    file_path = os.path.join(output_dir, 'uv-test-grid.png')
    img.save(file_path, 'PNG')
    print(f"Success: UV Test Grid texture saved at {file_path}")

if __name__ == '__main__':
    generate_uv_test_grid()
