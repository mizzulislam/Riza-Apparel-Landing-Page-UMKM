import os
import json
import math
from PIL import Image, ImageDraw, ImageFont

"""
Riza Apparel 2D UV Atlas Renderer (Tahap I1 - B-03)
Generates 2048x2048 sRGB UV Atlas Texture from DesignState with 16px edge dilation/padding per panel.

Panels mapped:
- body_front:  UV [0.02, 0.02, 0.48, 0.65] (Pixel: 41, 41, 942, 1290)
- body_back:   UV [0.52, 0.02, 0.98, 0.65] (Pixel: 1065, 41, 942, 1290)
- sleeve_left: UV [0.02, 0.68, 0.45, 0.88] (Pixel: 41, 1392, 881, 410)
- sleeve_right:UV [0.55, 0.68, 0.98, 0.88] (Pixel: 1126, 1392, 881, 410)
- collar:      UV [0.02, 0.90, 0.98, 0.98] (Pixel: 41, 1843, 1966, 164)
"""

def hex_to_rgb(hex_str, default=(255, 255, 255)):
    if not hex_str:
        return default
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 6:
        return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
    return default

def render_atlas(design_state=None, resolution=2048, output_path="assets/jersey/vneck-setin/atlas-2048.png"):
    if design_state is None:
        design_state = {
            "baseColor": "#881337",       # Crimson Maroon
            "secondaryColor": "#f59e0b",  # Amber Orange
            "accentColor": "#ffffff",     # White
            "motifTemplate": "tenun-ende",
            "playerName": "RIZA SPORT",
            "playerNumber": "10",
            "sponsorText": "RIZA SPORT"
        }

    c_base = hex_to_rgb(design_state.get("baseColor", "#881337"))
    c_sec = hex_to_rgb(design_state.get("secondaryColor", "#f59e0b"))
    c_acc = hex_to_rgb(design_state.get("accentColor", "#ffffff"))

    # Create 2048x2048 image initialized to neutral background color
    img = Image.new("RGB", (resolution, resolution), color=c_base)
    draw = ImageDraw.Draw(img)

    # 1. BODY FRONT (41, 41, 942, 1290) + 16px Dilation Bleed
    fx, fy, fw, fh = 41, 41, 942, 1290
    bleed = 16
    draw.rectangle([fx - bleed, fy - bleed, fx + fw + bleed, fy + fh + bleed], fill=c_base)

    # Tenun Ikat Ende (Zawo) Diamond Motif overlay on Body Front
    motif_color = (min(255, c_sec[0]+30), min(255, c_sec[1]+30), min(255, c_sec[2]+30))
    grid_size = 120
    for my in range(fy + 200, fy + fh - 200, grid_size):
        for mx in range(fx + 100, fx + fw - 100, grid_size):
            cx, cy = mx + grid_size // 2, my + grid_size // 2
            points = [(cx, cy - 40), (cx + 40, cy), (cx, cy + 40), (cx - 40, cy)]
            draw.polygon(points, fill=motif_color, outline=c_acc)
            # Inner diamond
            inner_pts = [(cx, cy - 20), (cx + 20, cy), (cx, cy + 20), (cx - 20, cy)]
            draw.polygon(inner_pts, fill=c_base)

    # Text RIZA SPORT on Front Chest
    p_name = design_state.get("playerName", "RIZA SPORT")
    p_num = design_state.get("playerNumber", "10")

    # Front Name & Number
    draw.text((fx + fw//2 - 120, fy + 380), p_name, fill=c_acc, font_size=48)
    draw.text((fx + fw//2 - 60, fy + 460), p_num, fill=c_sec, font_size=96)
    draw.text((fx + fw//2 - 100, fy + 800), design_state.get("sponsorText", "RIZA SPORT"), fill=c_acc, font_size=36)

    # 2. BODY BACK (1065, 41, 942, 1290) + 16px Dilation Bleed
    bx, by, bw, bh = 1065, 41, 942, 1290
    draw.rectangle([bx - bleed, by - bleed, bx + bw + bleed, by + bh + bleed], fill=c_base)

    # Back Motif Overlay
    for my in range(by + 200, by + bh - 200, grid_size):
        for mx in range(bx + 100, bx + bw - 100, grid_size):
            cx, cy = mx + grid_size // 2, my + grid_size // 2
            points = [(cx, cy - 40), (cx + 40, cy), (cx, cy + 40), (cx - 40, cy)]
            draw.polygon(points, fill=motif_color, outline=c_acc)

    # Back Name & Large Number
    draw.text((bx + bw//2 - 140, by + 280), p_name, fill=c_acc, font_size=56)
    draw.text((bx + bw//2 - 100, by + 420), p_num, fill=c_acc, font_size=160)

    # 3. SLEEVE LEFT (41, 1392, 881, 410) + 16px Dilation Bleed
    lx, ly, lw, lh = 41, 1392, 881, 410
    draw.rectangle([lx - bleed, ly - bleed, lx + lw + bleed, ly + lh + bleed], fill=c_sec)
    # Sleeve cuff accent band
    draw.rectangle([lx, ly + lh - 50, lx + lw, ly + lh], fill=c_acc)
    draw.text((lx + lw//2 - 80, ly + 140), "RIZA APPAREL", fill=c_base, font_size=28)

    # 4. SLEEVE RIGHT (1126, 1392, 881, 410) + 16px Dilation Bleed
    rx, ry, rw, rh = 1126, 1392, 881, 410
    draw.rectangle([rx - bleed, ry - bleed, rx + rw + bleed, ry + rh + bleed], fill=c_sec)
    draw.rectangle([rx, ry + rh - 50, rx + rw, ry + rh], fill=c_acc)
    draw.text((rx + rw//2 - 80, ry + 140), "RIZA APPAREL", fill=c_base, font_size=28)

    # 5. COLLAR RIB (41, 1843, 1966, 164) + 16px Dilation Bleed
    cx, cy, cw, ch = 41, 1843, 1966, 164
    draw.rectangle([cx - bleed, cy - bleed, cx + cw + bleed, cy + ch + bleed], fill=c_sec)
    # Rib stripes (white & dark accents)
    draw.rectangle([cx, cy + ch//3, cx + cw, cy + ch//3 + 20], fill=c_acc)
    draw.rectangle([cx, cy + 2*ch//3, cx + cw, cy + 2*ch//3 + 12], fill=c_base)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Success: Generated 2048x2048 sRGB UV Atlas at {output_path}")
    return output_path

if __name__ == '__main__':
    render_atlas()
