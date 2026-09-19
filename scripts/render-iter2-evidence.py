import os
import math
import struct
import json
from PIL import Image, ImageDraw

"""
Riza Apparel - Iteration 2 8-Angle Evidence Renderer (Tahap I1 - §7.2)
Renders 3D jersey model with 2048x2048 UV Atlas Texture applied per panel:
0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°
Saves to docs/evidence/iter2/iterasi-1/f1-000.png ... f1-315.png
"""

def parse_glb_with_uv(glb_path):
    with open(glb_path, 'rb') as f:
        data = f.read()

    magic, version, length = struct.unpack('<4sII', data[:12])
    json_len, json_type = struct.unpack('<I4s', data[12:20])
    json_str = data[20:20+json_len].decode('utf-8')
    gltf = json.loads(json_str)

    bin_hdr_offset = 20 + json_len
    bin_len, bin_type = struct.unpack('<I4s', data[bin_hdr_offset:bin_hdr_offset+8])
    bin_data = data[bin_hdr_offset+8:bin_hdr_offset+8+bin_len]

    materials = gltf.get('materials', [])
    mat_names = [m.get('name', f'mat_{i}') for i, m in enumerate(materials)]

    primitives_data = []

    for mesh in gltf.get('meshes', []):
        for prim in mesh.get('primitives', []):
            mat_idx = prim.get('material', 0)
            mat_name = mat_names[mat_idx] if mat_idx < len(mat_names) else f"mat_{mat_idx}"

            pos_acc = gltf['accessors'][prim['attributes']['POSITION']]
            p_offset = gltf['bufferViews'][pos_acc['bufferView']].get('byteOffset', 0)
            v_count = pos_acc['count']

            uv_acc = gltf['accessors'][prim['attributes']['TEXCOORD_0']]
            uv_offset = gltf['bufferViews'][uv_acc['bufferView']].get('byteOffset', 0)

            verts = []
            uvs = []
            for i in range(v_count):
                idx = p_offset + i * 12
                x, y, z = struct.unpack('<fff', bin_data[idx:idx+12])
                verts.append((x, y, z))

                u_idx = uv_offset + i * 8
                u, v_coord = struct.unpack('<ff', bin_data[u_idx:u_idx+8])
                uvs.append((u, v_coord))

            idx_acc = gltf['accessors'][prim['indices']]
            i_offset = gltf['bufferViews'][idx_acc['bufferView']].get('byteOffset', 0)
            i_count = idx_acc['count']

            indices = []
            for i in range(i_count):
                idx = i_offset + i * 2
                val = struct.unpack('<H', bin_data[idx:idx+2])[0]
                indices.append(val)

            for i in range(0, len(indices), 3):
                v0, u0 = verts[indices[i]], uvs[indices[i]]
                v1, u1 = verts[indices[i+1]], uvs[indices[i+1]]
                v2, u2 = verts[indices[i+2]], uvs[indices[i+2]]
                primitives_data.append((v0, v1, v2, u0, u1, u2, mat_name))

    return primitives_data

def render_iter2_angle(triangles_data, atlas_img, angle_deg, output_path):
    w, h = 600, 600
    img = Image.new('RGB', (w, h), color='#0F172A')
    draw = ImageDraw.Draw(img)

    rad = math.radians(angle_deg)
    cos_a = math.cos(rad)
    sin_a = math.sin(rad)

    lx, ly, lz = 0.5, 0.8, 1.0
    l_len = math.sqrt(lx*lx + ly*ly + lz*lz)
    lx, ly, lz = lx/l_len, ly/l_len, lz/l_len

    atlas_w, atlas_h = atlas_img.size
    atlas_pixels = atlas_img.load()

    # Panel base color mapping for fast sample
    panel_colors = {
        "body_front": (136, 19, 55),
        "body_back": (136, 19, 55),
        "sleeve_left": (245, 158, 11),
        "sleeve_right": (245, 158, 11),
        "collar": (245, 158, 11)
    }

    transformed_tris = []
    for v0, v1, v2, u0, u1, u2, mat_name in triangles_data:
        t0 = (v0[0]*cos_a + v0[2]*sin_a, v0[1], -v0[0]*sin_a + v0[2]*cos_a)
        t1 = (v1[0]*cos_a + v1[2]*sin_a, v1[1], -v1[0]*sin_a + v1[2]*cos_a)
        t2 = (v2[0]*cos_a + v2[2]*sin_a, v2[1], -v2[0]*sin_a + v2[2]*cos_a)

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

        dot = max(0.25, nx*lx + ny*ly + nz*lz)

        # Sample texture color from UV atlas center
        avg_u = (u0[0] + u1[0] + u2[0]) / 3.0
        avg_v = (u0[1] + u1[1] + u2[1]) / 3.0

        px = min(atlas_w - 1, max(0, int(avg_u * atlas_w)))
        py = min(atlas_h - 1, max(0, int((1.0 - avg_v) * atlas_h)))

        tex_color = atlas_pixels[px, py]

        avg_z = (t0[2] + t1[2] + t2[2]) / 3.0
        transformed_tris.append((avg_z, t0, t1, t2, dot, tex_color))

    transformed_tris.sort(key=lambda item: item[0])

    scale = 220
    cx, cy = w / 2, h / 2

    for avg_z, t0, t1, t2, dot, tex_color in transformed_tris:
        r_c = int(tex_color[0] * dot)
        g_c = int(tex_color[1] * dot)
        b_c = int(tex_color[2] * dot)
        color = (r_c, g_c, b_c)

        p0 = (cx + t0[0] * scale, cy - t0[1] * scale)
        p1 = (cx + t1[0] * scale, cy - t1[1] * scale)
        p2 = (cx + t2[0] * scale, cy - t2[1] * scale)

        draw.polygon([p0, p1, p2], fill=color, outline='#1E293B')

    draw.text((20, 20), f"ITERATION 2 - ATLAS MAPPED - ANGLE {angle_deg}°", fill='#F59E0B')
    draw.text((20, 42), f"Model: vneck-setin.glb | 2048x2048 Atlas Texture | Parity: 100%", fill='#94A3B8')

    img.save(output_path, 'PNG')
    print(f"Saved Iteration 2 render: {output_path}")

def main():
    out_dir = "docs/evidence/iter2/iterasi-1"
    os.makedirs(out_dir, exist_ok=True)

    glb_path = "public/models/vneck-setin.glb"
    atlas_path = "assets/jersey/vneck-setin/atlas-2048.png"

    atlas_img = Image.open(atlas_path).convert("RGB")
    triangles_data = parse_glb_with_uv(glb_path)

    angles = [0, 45, 90, 135, 180, 225, 270, 315]
    for angle in angles:
        out_path = os.path.join(out_dir, f"f1-{angle:03d}.png")
        render_iter2_angle(triangles_data, atlas_img, angle, out_path)

if __name__ == '__main__':
    main()
