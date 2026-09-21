import os
from PIL import Image, ImageDraw, ImageFont

def generate_uv_grid():
    size = 2048
    cells = 16
    cell_size = size // cells
    
    img = Image.new('RGB', (size, size), color='white')
    draw = ImageDraw.Draw(img)
    
    # Try to load a font, fallback to default
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
        
    cols = "ABCDEFGHIJKLMNOP"
    rows = [str(i) for i in range(1, 17)]
    
    colors = [
        (255, 200, 200), (200, 255, 200), (200, 200, 255), (255, 255, 200),
        (255, 200, 255), (200, 255, 255), (240, 240, 240), (200, 200, 200)
    ]
    
    for y in range(cells):
        for x in range(cells):
            px = x * cell_size
            py = y * cell_size
            
            # Checkerboard + color tint based on quadrant
            c_idx = (x % 4) + ((y % 4) * 2) % len(colors)
            bg = colors[(x + y) % len(colors)]
            draw.rectangle([px, py, px + cell_size, py + cell_size], fill=bg)
            
            # Outline
            draw.rectangle([px, py, px + cell_size, py + cell_size], outline='black', width=2)
            
            # Label
            label = f"{cols[x]}{rows[y]}"
            # draw center text
            # quick approximation for center since default font doesn't have getbbox always
            draw.text((px + cell_size//2 - 20, py + cell_size//2 - 10), label, fill='black', font=font)
            
            # Sub-grid lines (quarters)
            draw.line([px + cell_size//2, py, px + cell_size//2, py + cell_size], fill='rgba(0,0,0,50)', width=1)
            draw.line([px, py + cell_size//2, px + cell_size, py + cell_size//2], fill='rgba(0,0,0,50)', width=1)
            
    out_path = os.path.join(os.path.dirname(__file__), '../public/uv-grid.png')
    img.save(out_path)
    print(f"UV Grid saved to {out_path}")

if __name__ == '__main__':
    generate_uv_grid()
