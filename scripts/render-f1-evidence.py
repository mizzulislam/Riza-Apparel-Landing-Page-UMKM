import os
import math
import struct
import json
from PIL import Image, ImageDraw

"""
GATE F1 Inspection Renderer for vneck-setin.glb
Renders neutral inspection images from 8 angles:
0, 45, 90, 135, 180, 225, 270, 315 degrees
Saves to docs/evidence/f1-000.png ... f1-315.png
"""

def parse_glb(glb_path):
    with open(glb_path, 'rb') as f:
        data = f.read()

    magic, version, length = struct.unpack('<4sII', data[:12])
    if magic != b'glTF':
        raise ValueError("Not a GLB file")

    json_len, json_type = struct.unpack('<I4s', data[12:20])
    json_str = data[20:20+json_len].decode('utf-8')
    gltf = json.loads(json_str)

    bin_hdr_offset = 20 + json_len
    bin_len, bin_type = struct.unpack('<I4s', data[bin_hdr_offset:bin_hdr_offset+8])
    bin_data = data[bin_hdr_offset+8:bin_hdr_offset+8+bin_len]

    # Extract positions, normals, materials, and indices for all primitives
    primitives_data = []

    mat_colors = [
        (225, 29, 72),   # body_front: Red Crimson
        (30, 144, 255),  # body_back: Dodger Blue
        (46, 204, 113),  # sleeve_left: Emerald Green
        (155, 89, 182),  # sleeve_right: Amethyst Purple
        (245, 158, 11),  # collar: Amber Gold
    ]

    for mesh in gltf.get('meshes', []):
        for prim_idx, prim in enumerate(mesh.get('primitives', [])):
            mat_id = prim.get('material', prim_idx % len(mat_colors))
            pos_acc_idx = prim['attributes']['POSITION']
            pos_acc = gltf['accessors'][pos_acc_idx]
            pos_bv = gltf['bufferViews'][pos_acc['bufferView']]
            
            p_offset = pos_bv.get('byteOffset', 0)
            p_count = pos_acc['count']

            verts = []
            for i in range(p_count):
                idx = p_offset + i * 12
                x, y, z = struct.unpack('<fff', bin_data[idx:idx+12])
                verts.append((x, y, z))

            idx_acc_idx = prim['indices']
            idx_acc = gltf['accessors'][idx_acc_idx]
            idx_bv = gltf['bufferViews'][idx_acc['bufferView']]
            
            i_offset = idx_bv.get('byteOffset', 0)
            i_count = idx_acc['count']

            indices = []
            for i in range(i_count):
                idx = i_offset + i * 2
                val = struct.unpack('<H', bin_data[idx:idx+2])[0]
                indices.append(val)

            base_color = mat_colors[mat_id % len(mat_colors)]

            for i in range(0, len(indices), 3):
                v0 = verts[indices[i]]
                v1 = verts[indices[i+1]]
                v2 = verts[indices[i+2]]
                primitives_data.append((v0, v1, v2, base_color))

    return primitives_data, len(primitives_data)

def render_angle(triangles_data, total_tris, angle_deg, output_path):
    w, h = 600, 600
    img = Image.new('RGB', (w, h), color='#0F172A')
    draw = ImageDraw.Draw(img)

    rad = math.radians(angle_deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)

    # Directional light coming from front-top-right
    lx, ly, lz = 0.5, 0.8, 1.0
    l_len = math.sqrt(lx*lx + ly*ly + lz*lz)
    lx, ly, lz = lx/l_len, ly/l_len, lz/l_len

    transformed_tris = []
    for v0, v1, v2, base_color in triangles_data:
        # Y is Vertical, X is Horizontal, Z is Depth
        # Rotate around Y axis
        t0 = (v0[0]*cos_a + v0[2]*sin_a, v0[1], -v0[0]*sin_a + v0[2]*cos_a)
        t1 = (v1[0]*cos_a + v1[2]*sin_a, v1[1], -v1[0]*sin_a + v1[2]*cos_a)
        t2 = (v2[0]*cos_a + v2[2]*sin_a, v2[1], -v2[0]*sin_a + v2[2]*cos_a)

        # Compute face normal
        ax, ay, az = t1[0]-t0[0], t1[1]-t0[1], t1[2]-t0[2]
        bx, by, bz = t2[0]-t0[0], t2[1]-t0[1], t2[2]-t0[2]
        nx = ay*bz - az*by
        ny = az*bx - ax*bz
        nz = ax*by - ay*bx
        n_len = math.sqrt(nx*nx + ny*ny + nz*nz)
        if n_len > 0:
            nx, ny, nz = nx/n_len, ny/n_len, nz/n_len
        else:
            nx, ny, nz = 0, 0, 1

        # Diffuse lighting calculation
        dot = max(0.20, nx*lx + ny*ly + nz*lz)

        # Average Z for painter's algorithm sorting (back to front)
        avg_z = (t0[2] + t1[2] + t2[2]) / 3.0
        transformed_tris.append((avg_z, t0, t1, t2, dot, nz, base_color))

    # Sort back to front
    transformed_tris.sort(key=lambda item: item[0])

    scale = 220
    cx, cy = w / 2, h / 2

    for avg_z, t0, t1, t2, dot, nz, base_color in transformed_tris:
        # Shading with panel material base color
        r_c = int(base_color[0] * dot)
        g_c = int(base_color[1] * dot)
        b_c = int(base_color[2] * dot)
        color = (r_c, g_c, b_c)

        p0 = (cx + t0[0] * scale, cy - t0[1] * scale)
        p1 = (cx + t1[0] * scale, cy - t1[1] * scale)
        p2 = (cx + t2[0] * scale, cy - t2[1] * scale)

        draw.polygon([p0, p1, p2], fill=color, outline='#1E293B')

    # Draw Metadata Overlay Header
    draw.text((20, 20), f"GATE F1 INSPECTION RENDER - ANGLE {angle_deg}°", fill='#F59E0B')
    draw.text((20, 42), f"Model: vneck-setin.glb | Triangles: {total_tris} | 5 Material Slots", fill='#94A3B8')

    # Legend
    legend = [("Front", "#E11D48"), ("Back", "#1E90FF"), ("Left Slv", "#2ECC71"), ("Right Slv", "#9B59B6"), ("Collar", "#F59E0B")]
    x_leg = 20
    for label, col in legend:
        draw.rectangle([x_leg, 565, x_leg+14, 579], fill=col)
        draw.text((x_leg+18, 565), label, fill='#E2E8F0')
        x_leg += 100

    img.save(output_path, 'PNG')
    print(f"Saved GATE F1 inspection render: {output_path}")

def main():
    evidence_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../docs/evidence'))
    os.makedirs(evidence_dir, exist_ok=True)

    glb_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/models/vneck-setin.glb'))
    triangles_data, total_tris = parse_glb(glb_path)

    angles = [0, 45, 90, 135, 180, 225, 270, 315]
    for angle in angles:
        out_name = f"f1-{angle:03d}.png"
        out_path = os.path.join(evidence_dir, out_name)
        render_angle(triangles_data, total_tris, angle, out_path)

if __name__ == '__main__':
    main()
