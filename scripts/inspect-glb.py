import os
import json
import struct

def inspect_glb(glb_path):
    with open(glb_path, 'rb') as f:
        data = f.read()

    file_size_kb = len(data) / 1024.0

    magic, version, length = struct.unpack('<4sII', data[:12])
    json_len, json_type = struct.unpack('<I4s', data[12:20])
    json_str = data[20:20+json_len].decode('utf-8')
    gltf = json.loads(json_str)

    bin_hdr_offset = 20 + json_len
    bin_len, bin_type = struct.unpack('<I4s', data[bin_hdr_offset:bin_hdr_offset+8])
    bin_data = data[bin_hdr_offset+8:bin_hdr_offset+8+bin_len]

    materials = gltf.get('materials', [])
    mat_names = [m.get('name', f'mat_{i}') for i, m in enumerate(materials)]

    total_vertices = 0
    total_triangles = 0
    primitives_info = []

    edge_counts = {}

    for mesh in gltf.get('meshes', []):
        for prim in mesh.get('primitives', []):
            mat_idx = prim.get('material', 0)
            mat_name = mat_names[mat_idx] if mat_idx < len(mat_names) else f"mat_{mat_idx}"

            pos_acc = gltf['accessors'][prim['attributes']['POSITION']]
            v_count = pos_acc['count']
            total_vertices += v_count

            pos_bv = gltf['bufferViews'][pos_acc['bufferView']]
            p_offset = pos_bv.get('byteOffset', 0)

            verts = []
            for i in range(v_count):
                idx = p_offset + i * 12
                x, y, z = struct.unpack('<fff', bin_data[idx:idx+12])
                verts.append((x, y, z))

            idx_acc = gltf['accessors'][prim['indices']]
            i_count = idx_acc['count']
            tri_count = i_count // 3
            total_triangles += tri_count

            idx_bv = gltf['bufferViews'][idx_acc['bufferView']]
            i_offset = idx_bv.get('byteOffset', 0)

            indices = []
            for i in range(i_count):
                idx = i_offset + i * 2
                val = struct.unpack('<H', bin_data[idx:idx+2])[0]
                indices.append(val)

            for i in range(0, len(indices), 3):
                v_ids = [indices[i], indices[i+1], indices[i+2]]
                for e in range(3):
                    edge = tuple(sorted([verts[v_ids[e]], verts[v_ids[(e+1)%3]]]))
                    edge_counts[edge] = edge_counts.get(edge, 0) + 1

            primitives_info.append({
                "material": mat_name,
                "vertices": v_count,
                "triangles": tri_count,
                "doubleSided": materials[mat_idx].get('doubleSided', False) if mat_idx < len(materials) else False
            })

    boundary_edges = [e for e, count in edge_counts.items() if count == 1]

    print(f"=== GLB Inspection Report: {os.path.basename(glb_path)} ===")
    print(f"File Size: {file_size_kb:.2f} KB")
    print(f"Total Vertices: {total_vertices}")
    print(f"Total Triangles: {total_triangles}")
    print(f"Boundary Edges Count: {len(boundary_edges)}")
    print("Material Primitives:")
    for p in primitives_info:
        print(f"  - [{p['material']}] Vertices: {p['vertices']}, Triangles: {p['triangles']}, DoubleSided: {p['doubleSided']}")

if __name__ == '__main__':
    inspect_glb('public/models/raglan-crew.glb')
    inspect_glb('public/models/raglan-crew.mobile.glb')
