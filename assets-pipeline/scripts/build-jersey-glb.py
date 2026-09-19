import os
import json
import struct
import math
import numpy as np

"""
3D Anatomical Ghost-Mannequin Jersey GLB Mesh Generator for Riza Apparel (T2 & T3)
Proportional Update (Matching Provisual / Yellow Images Soccer Jersey Reference):
- Athletic Unisex Ratio: Height 1.25, Chest Width 0.88 (Proportional aspect ratio)
- Sleeves: Hug downwards (~60° drop angle) hugging biceps realistically
- Shoulder Slope: Realistic 15° shoulder drop from neck point
- V-Neck & Crew-Neck: Crisp 3D Rib collar with inner back neck facing mesh
- 5 Material Slots: body_front, body_back, sleeve_left, sleeve_right, collar (doubleSided: true)
- 4 Manifold Boundary Loops: Neck, Hem, Left Cuff, Right Cuff
"""

def generate_jersey_geometry(model_type="vneck-setin", subdivisions=24):
    panels = {
        "body_front": [],
        "body_back": [],
        "sleeve_left": [],
        "sleeve_right": [],
        "collar": []
    }
    indices = {
        "body_front": [],
        "body_back": [],
        "sleeve_left": [],
        "sleeve_right": [],
        "collar": []
    }

    n_rows = subdivisions
    n_cols = subdivisions

    # ---------------------------------------------------------
    # 1. TORSO FRONT PANEL (body_front)
    # Height Y from -0.68 (hem) to +0.55 (shoulder top)
    # ---------------------------------------------------------
    front_verts = []
    front_grid = []

    for r in range(n_rows + 1):
        v = r / n_rows  # 0 at hem, 1 at shoulder
        y_base = -0.68 + v * 1.23

        # Athletic waist profiling: broad chest (rx=0.44), tapered waist (rx=0.40), hem flare (rx=0.43)
        waist_factor = 1.0 - 0.08 * math.sin(v * math.pi)
        rx = 0.44 * waist_factor
        rz = 0.21 * waist_factor

        row_indices = []
        for c in range(n_cols + 1):
            u = c / n_cols
            theta = -math.pi / 2.0 + u * math.pi  # -PI/2 to +PI/2

            x = rx * math.sin(theta)
            z = rz * math.cos(theta)
            y = y_base

            # Shoulder slope drop (slopes down 0.10 units toward shoulder outer point x=0.44)
            if v > 0.65:
                shoulder_drop = 0.10 * (abs(x) / 0.44)**1.5
                y -= shoulder_drop

            # Drop hem curve at bottom (front hem slightly higher than back hem)
            if v < 0.12:
                y += 0.02 * (1.0 - v / 0.12) * math.cos(theta)

            # Chest curvature (+Z puff for natural 3D volume)
            if 0.40 < v < 0.85 and abs(x) < 0.34:
                chest_puff = 0.045 * math.sin((v - 0.40) / 0.45 * math.pi) * math.cos(x / 0.34 * math.pi / 2.0)
                z += chest_puff

            if model_type == "vneck-setin":
                # V-Neck cutout (V peak at y = 0.24, x = 0.0)
                if v > 0.50:
                    v_depth = (v - 0.50) / 0.50
                    half_v_width = 0.20 * v_depth
                    if abs(x) < half_v_width:
                        target_y = 0.24 + (abs(x) / 0.20) * (0.54 - 0.24)
                        if y > target_y:
                            y = target_y
                            z = 0.17 * math.cos(theta) - 0.02 * v_depth

                # Set-in armhole cutout
                if v > 0.55 and abs(x) > 0.34:
                    arm_factor = (v - 0.55) / 0.45
                    x_sign = 1.0 if x > 0 else -1.0
                    x = x_sign * (0.34 + (1.0 - arm_factor) * 0.09)
            else:
                # Raglan Crew cutout
                if v > 0.50:
                    raglan_factor = (v - 0.50) / 0.50
                    max_x = 0.36 - raglan_factor * 0.18
                    if abs(x) > max_x:
                        x_sign = 1.0 if x > 0 else -1.0
                        x = x_sign * max_x
                if abs(x) < 0.18 and v > 0.82:
                    y -= 0.035 * (1.0 - (abs(x)/0.18)**2)

            # Procedural drape folds
            drape = 0.005 * math.sin(6.0 * y + 3.0 * theta) * math.cos(2.0 * y)
            x += drape * math.sin(theta)
            z += drape * math.cos(theta)

            nx = math.sin(theta)
            ny = 0.08 * math.cos(v * math.pi)
            nz = math.cos(theta)
            nl = math.sqrt(nx*nx + ny*ny + nz*nz)
            nx, ny, nz = nx/nl, ny/nl, nz/nl

            idx = len(front_verts)
            front_verts.append((x, y, z, nx, ny, nz, u, v))
            row_indices.append(idx)
        front_grid.append(row_indices)

    front_indices = []
    for r in range(n_rows):
        for c in range(n_cols):
            i0 = front_grid[r][c]
            i1 = front_grid[r][c + 1]
            i2 = front_grid[r + 1][c]
            i3 = front_grid[r + 1][c + 1]
            front_indices.extend([i0, i2, i1, i1, i2, i3])

    panels["body_front"] = front_verts
    indices["body_front"] = front_indices

    # ---------------------------------------------------------
    # 2. TORSO BACK PANEL (body_back)
    # ---------------------------------------------------------
    back_verts = []
    back_grid = []

    for r in range(n_rows + 1):
        v = r / n_rows
        y_base = -0.68 + v * 1.23

        waist_factor = 1.0 - 0.08 * math.sin(v * math.pi)
        rx = 0.44 * waist_factor
        rz = 0.21 * waist_factor

        row_indices = []
        for c in range(n_cols + 1):
            u = c / n_cols
            theta = math.pi / 2.0 + u * math.pi

            x = rx * math.sin(theta)
            z = rz * math.cos(theta)
            y = y_base

            # Shoulder drop
            if v > 0.65:
                shoulder_drop = 0.10 * (abs(x) / 0.44)**1.5
                y -= shoulder_drop

            # Drop hem curve (back extends ~0.035 lower)
            if v < 0.12:
                y -= 0.035 * (1.0 - v / 0.12) * math.cos(theta)

            if model_type == "vneck-setin":
                if v > 0.78 and abs(x) < 0.20:
                    scoop = 0.05 * (1.0 - abs(x) / 0.20)
                    y -= scoop
                if v > 0.55 and abs(x) > 0.34:
                    arm_factor = (v - 0.55) / 0.45
                    x_sign = 1.0 if x > 0 else -1.0
                    x = x_sign * (0.34 + (1.0 - arm_factor) * 0.09)
            else:
                if v > 0.50:
                    raglan_factor = (v - 0.50) / 0.50
                    max_x = 0.36 - raglan_factor * 0.18
                    if abs(x) > max_x:
                        x_sign = 1.0 if x > 0 else -1.0
                        x = x_sign * max_x
                if v > 0.82 and abs(x) < 0.18:
                    y -= 0.025 * (1.0 - (abs(x)/0.18)**2)

            drape = 0.005 * math.sin(5.0 * y + 3.0 * theta)
            x += drape * math.sin(theta)
            z += drape * math.cos(theta)

            nx = math.sin(theta)
            ny = 0.08 * math.cos(v * math.pi)
            nz = math.cos(theta)
            nl = math.sqrt(nx*nx + ny*ny + nz*nz)
            nx, ny, nz = nx/nl, ny/nl, nz/nl

            idx = len(back_verts)
            back_verts.append((x, y, z, nx, ny, nz, u, v))
            row_indices.append(idx)
        back_grid.append(row_indices)

    back_indices = []
    for r in range(n_rows):
        for c in range(n_cols):
            i0 = back_grid[r][c]
            i1 = back_grid[r][c + 1]
            i2 = back_grid[r + 1][c]
            i3 = back_grid[r + 1][c + 1]
            back_indices.extend([i0, i1, i2, i1, i3, i2])

    # Inner Back Neck Facing Mesh
    inner_neck_grid = []
    inner_rows = 4
    for r in range(inner_rows + 1):
        v_in = r / inner_rows
        y_in = 0.52 - v_in * 0.10
        row_indices = []
        for c in range(n_cols + 1):
            u = c / n_cols
            theta = math.pi * 0.65 + u * (math.pi * 0.70)
            rx_in = 0.20 - v_in * 0.02
            rz_in = -0.14 + v_in * 0.03
            x = rx_in * math.sin(theta)
            z = rz_in
            y = y_in

            nx, ny, nz = 0.0, 0.2, 0.98

            idx = len(back_verts)
            back_verts.append((x, y, z, nx, ny, nz, u, v_in))
            row_indices.append(idx)
        inner_neck_grid.append(row_indices)

    for r in range(inner_rows):
        for c in range(n_cols):
            i0 = inner_neck_grid[r][c]
            i1 = inner_neck_grid[r][c + 1]
            i2 = inner_neck_grid[r + 1][c]
            i3 = inner_neck_grid[r + 1][c + 1]
            back_indices.extend([i0, i2, i1, i1, i2, i3])

    panels["body_back"] = back_verts
    indices["body_back"] = back_indices

    # ---------------------------------------------------------
    # 3. LEFT SLEEVE (sleeve_left)
    # Hugs downward (~60° drop angle) hugging biceps like reference
    # ---------------------------------------------------------
    s_rows = 12
    s_cols = 16
    left_verts = []
    left_grid = []

    for r in range(s_rows + 1):
        v = r / s_rows  # 0 at shoulder seam, 1 at sleeve cuff
        # Extends outward -X by 0.18, downward -Y by 0.30 (Steep downward angle!)
        sx = -0.36 - v * 0.18
        sy = 0.42 - v * 0.30
        sz = 0.02 + v * 0.03
        s_rad = 0.15 - v * 0.025  # Sleeve tapering toward cuff

        if model_type == "raglan-crew" and v < 0.25:
            shoulder_ext = (0.25 - v) / 0.25
            sx += shoulder_ext * 0.14
            sy += shoulder_ext * 0.12

        row_indices = []
        for c in range(s_cols + 1):
            u = c / s_cols
            phi = u * 2.0 * math.pi

            off_y = s_rad * math.cos(phi)
            off_z = s_rad * math.sin(phi)

            x = sx
            y = sy + off_y
            z = sz + off_z

            if 0.3 < v < 0.7:
                x += 0.003 * math.sin(v * math.pi * 3.0)

            nx = -0.7
            ny = -0.5
            nz = math.sin(phi) * 0.5
            nl = math.sqrt(nx*nx + ny*ny + nz*nz)
            nx, ny, nz = nx/nl, ny/nl, nz/nl

            idx = len(left_verts)
            left_verts.append((x, y, z, nx, ny, nz, u, v))
            row_indices.append(idx)
        left_grid.append(row_indices)

    left_indices = []
    for r in range(s_rows):
        for c in range(s_cols):
            i0 = left_grid[r][c]
            i1 = left_grid[r][c + 1]
            i2 = left_grid[r + 1][c]
            i3 = left_grid[r + 1][c + 1]
            left_indices.extend([i0, i2, i1, i1, i2, i3])

    panels["sleeve_left"] = left_verts
    indices["sleeve_left"] = left_indices

    # ---------------------------------------------------------
    # 4. RIGHT SLEEVE (sleeve_right)
    # ---------------------------------------------------------
    right_verts = []
    right_grid = []

    for r in range(s_rows + 1):
        v = r / s_rows
        sx = 0.36 + v * 0.18
        sy = 0.42 - v * 0.30
        sz = 0.02 + v * 0.03
        s_rad = 0.15 - v * 0.025

        if model_type == "raglan-crew" and v < 0.25:
            shoulder_ext = (0.25 - v) / 0.25
            sx -= shoulder_ext * 0.14
            sy += shoulder_ext * 0.12

        row_indices = []
        for c in range(s_cols + 1):
            u = c / s_cols
            phi = u * 2.0 * math.pi

            off_y = s_rad * math.cos(phi)
            off_z = s_rad * math.sin(phi)

            x = sx
            y = sy + off_y
            z = sz + off_z

            if 0.3 < v < 0.7:
                x -= 0.003 * math.sin(v * math.pi * 3.0)

            nx = 0.7
            ny = -0.5
            nz = math.sin(phi) * 0.5
            nl = math.sqrt(nx*nx + ny*ny + nz*nz)
            nx, ny, nz = nx/nl, ny/nl, nz/nl

            idx = len(right_verts)
            right_verts.append((x, y, z, nx, ny, nz, u, v))
            row_indices.append(idx)
        right_grid.append(row_indices)

    right_indices = []
    for r in range(s_rows):
        for c in range(s_cols):
            i0 = right_grid[r][c]
            i1 = right_grid[r][c + 1]
            i2 = right_grid[r + 1][c]
            i3 = right_grid[r + 1][c + 1]
            right_indices.extend([i0, i1, i2, i1, i3, i2])

    panels["sleeve_right"] = right_verts
    indices["sleeve_right"] = right_indices

    # ---------------------------------------------------------
    # 5. COLLAR RIB (collar) - 3D Thick V-Neck / Crew-Neck Band
    # ---------------------------------------------------------
    collar_verts = []
    collar_indices = []

    c_steps = 32
    collar_points = []
    for i in range(c_steps + 1):
        t = i / c_steps
        angle = t * 2.0 * math.pi

        if model_type == "vneck-setin":
            if 0 <= t <= 0.5:
                v_param = abs(t - 0.25) / 0.25
                cx = (t - 0.25) * 0.76  # -0.19 to +0.19
                cy = 0.25 + v_param * (0.54 - 0.25)
                cz = 0.17 * (1.0 - v_param) + 0.02 * v_param
            else:
                b_param = (t - 0.5) / 0.5
                phi = b_param * math.pi
                cx = 0.19 * math.cos(phi)
                cy = 0.54 - 0.04 * math.sin(phi)
                cz = -0.14 * math.sin(phi)
        else:
            cx = 0.18 * math.sin(angle)
            cy = 0.53 + 0.02 * math.cos(angle)
            cz = 0.14 * math.cos(angle)

        collar_points.append((cx, cy, cz))

    rib_width = 0.032
    for i in range(c_steps + 1):
        cx, cy, cz = collar_points[i]
        u = i / c_steps

        nl = math.sqrt(cx*cx + cz*cz)
        nx = cx / nl if nl > 0 else 0
        nz = cz / nl if nl > 0 else 1
        ny = 0.2

        x_out = cx + nx * rib_width
        y_out = cy + ny * rib_width
        z_out = cz + nz * rib_width

        x_in = cx - nx * rib_width * 0.5
        y_in = cy - ny * rib_width * 0.5
        z_in = cz - nz * rib_width * 0.5

        idx_out = len(collar_verts)
        collar_verts.append((x_out, y_out, z_out, nx, ny, nz, u, 0.0))
        idx_in = len(collar_verts)
        collar_verts.append((x_in, y_in, z_in, -nx, -ny, -nz, u, 1.0))

    for i in range(c_steps):
        i0 = i * 2
        i1 = i0 + 1
        i2 = (i + 1) * 2
        i3 = i2 + 1
        collar_indices.extend([i0, i2, i1, i1, i2, i3])

    panels["collar"] = collar_verts
    indices["collar"] = collar_indices

    return panels, indices

def build_glb_binary(model_type="vneck-setin", is_mobile=False):
    subdivisions = 14 if is_mobile else 24
    panels, indices = generate_jersey_geometry(model_type, subdivisions)

    binary_data = bytearray()

    gltf = {
        "asset": {"version": "2.0", "generator": "Riza Apparel 3D Volumetric Jersey Engine v2.1"},
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0, "name": f"Jersey_{model_type}"}],
        "meshes": [{"name": f"Mesh_{model_type}", "primitives": []}],
        "materials": [
            {
                "name": "body_front",
                "pbrMetallicRoughness": {"baseColorFactor": [0.95, 0.95, 0.95, 1.0], "metallicFactor": 0.05, "roughnessFactor": 0.55},
                "doubleSided": True
            },
            {
                "name": "body_back",
                "pbrMetallicRoughness": {"baseColorFactor": [0.95, 0.95, 0.95, 1.0], "metallicFactor": 0.05, "roughnessFactor": 0.55},
                "doubleSided": True
            },
            {
                "name": "sleeve_left",
                "pbrMetallicRoughness": {"baseColorFactor": [0.92, 0.92, 0.92, 1.0], "metallicFactor": 0.05, "roughnessFactor": 0.55},
                "doubleSided": True
            },
            {
                "name": "sleeve_right",
                "pbrMetallicRoughness": {"baseColorFactor": [0.92, 0.92, 0.92, 1.0], "metallicFactor": 0.05, "roughnessFactor": 0.55},
                "doubleSided": True
            },
            {
                "name": "collar",
                "pbrMetallicRoughness": {"baseColorFactor": [0.96, 0.62, 0.04, 1.0], "metallicFactor": 0.10, "roughnessFactor": 0.50},
                "doubleSided": True
            },
        ],
        "accessors": [],
        "bufferViews": [],
        "buffers": [{"byteLength": 0}]
    }

    panel_keys = ["body_front", "body_back", "sleeve_left", "sleeve_right", "collar"]

    for mat_idx, p_key in enumerate(panel_keys):
        v_list = panels[p_key]
        idx_list = indices[p_key]

        if not v_list or not idx_list:
            continue

        pos_offset = len(binary_data)
        min_pos = [float('inf'), float('inf'), float('inf')]
        max_pos = [float('-inf'), float('-inf'), float('-inf')]

        for v in v_list:
            x, y, z = v[0], v[1], v[2]
            binary_data.extend(struct.pack('<fff', x, y, z))
            min_pos[0] = min(min_pos[0], x)
            min_pos[1] = min(min_pos[1], y)
            min_pos[2] = min(min_pos[2], z)
            max_pos[0] = max(max_pos[0], x)
            max_pos[1] = max(max_pos[1], y)
            max_pos[2] = max(max_pos[2], z)

        pos_length = len(binary_data) - pos_offset
        while len(binary_data) % 4 != 0:
            binary_data.append(0)

        norm_offset = len(binary_data)
        for v in v_list:
            binary_data.extend(struct.pack('<fff', v[3], v[4], v[5]))
        norm_length = len(binary_data) - norm_offset
        while len(binary_data) % 4 != 0:
            binary_data.append(0)

        uv_offset = len(binary_data)
        for v in v_list:
            binary_data.extend(struct.pack('<ff', v[6], v[7]))
        uv_length = len(binary_data) - uv_offset
        while len(binary_data) % 4 != 0:
            binary_data.append(0)

        elem_offset = len(binary_data)
        for idx in idx_list:
            binary_data.extend(struct.pack('<H', idx))
        elem_length = len(binary_data) - elem_offset
        while len(binary_data) % 4 != 0:
            binary_data.append(0)

        bv_pos = len(gltf["bufferViews"])
        gltf["bufferViews"].append({"buffer": 0, "byteOffset": pos_offset, "byteLength": pos_length, "target": 34962})

        bv_norm = len(gltf["bufferViews"])
        gltf["bufferViews"].append({"buffer": 0, "byteOffset": norm_offset, "byteLength": norm_length, "target": 34962})

        bv_uv = len(gltf["bufferViews"])
        gltf["bufferViews"].append({"buffer": 0, "byteOffset": uv_offset, "byteLength": uv_length, "target": 34962})

        bv_elem = len(gltf["bufferViews"])
        gltf["bufferViews"].append({"buffer": 0, "byteOffset": elem_offset, "byteLength": elem_length, "target": 34963})

        acc_pos = len(gltf["accessors"])
        gltf["accessors"].append({"bufferView": bv_pos, "componentType": 5126, "count": len(v_list), "type": "VEC3", "min": min_pos, "max": max_pos})

        acc_norm = len(gltf["accessors"])
        gltf["accessors"].append({"bufferView": bv_norm, "componentType": 5126, "count": len(v_list), "type": "VEC3"})

        acc_uv = len(gltf["accessors"])
        gltf["accessors"].append({"bufferView": bv_uv, "componentType": 5126, "count": len(v_list), "type": "VEC2"})

        acc_elem = len(gltf["accessors"])
        gltf["accessors"].append({"bufferView": bv_elem, "componentType": 5123, "count": len(idx_list), "type": "SCALAR"})

        gltf["meshes"][0]["primitives"].append({
            "attributes": {
                "POSITION": acc_pos,
                "NORMAL": acc_norm,
                "TEXCOORD_0": acc_uv
            },
            "indices": acc_elem,
            "material": mat_idx
        })

    gltf["buffers"][0]["byteLength"] = len(binary_data)

    json_bytes = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    while len(json_bytes) % 4 != 0:
        json_bytes += b' '

    json_chunk_len = len(json_bytes)
    bin_chunk_len = len(binary_data)
    total_glb_size = 12 + 8 + json_chunk_len + 8 + bin_chunk_len

    header = struct.pack('<4sII', b'glTF', 2, total_glb_size)
    json_chunk_hdr = struct.pack('<I4s', json_chunk_len, b'JSON')
    bin_chunk_hdr = struct.pack('<I4s', bin_chunk_len, b'BIN\x00')

    glb_content = header + json_chunk_hdr + json_bytes + bin_chunk_hdr + binary_data
    return glb_content

def main():
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../public/models'))
    os.makedirs(output_dir, exist_ok=True)

    models_to_build = [
        ("vneck-setin", False, "vneck-setin.glb"),
        ("vneck-setin", True, "vneck-setin.mobile.glb"),
        ("raglan-crew", False, "raglan-crew.glb"),
        ("raglan-crew", True, "raglan-crew.mobile.glb"),
    ]

    for model_type, is_mobile, filename in models_to_build:
        glb_data = build_glb_binary(model_type, is_mobile)
        out_path = os.path.join(output_dir, filename)
        with open(out_path, 'wb') as f:
            f.write(glb_data)
        size_kb = len(glb_data) / 1024
        print(f"Success: Generated {filename} ({size_kb:.2f} KB)")

if __name__ == '__main__':
    main()
