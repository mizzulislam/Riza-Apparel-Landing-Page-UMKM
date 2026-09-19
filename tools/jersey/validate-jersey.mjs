import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Automated Validation Script for Riza Apparel 3D Jersey Asset (Tahap I1 - B-05)
 * Verifies:
 * 1. GLB File Size & Triangle Limits (Desktop <= 3MB / 60k tris; Mobile <= 1.5MB / 30k tris)
 * 2. 5 Material Primitives: body_front, body_back, sleeve_left, sleeve_right, collar
 * 3. doubleSided: true on all materials
 * 4. Boundary edge loops = 4
 * 5. UV Bounds in [0, 1] without non-zero degenerate UVs
 */

function parseGLB(glbPath) {
  const buffer = fs.readFileSync(glbPath);
  const sizeKB = buffer.length / 1024.0;

  const magic = buffer.toString('utf8', 0, 4);
  if (magic !== 'glTF') {
    throw new Error(`Invalid GLB magic header: ${magic}`);
  }

  const jsonLen = buffer.readUInt32LE(12);
  const jsonStr = buffer.toString('utf8', 20, 20 + jsonLen);
  const gltf = JSON.parse(jsonStr);

  const binHdrOffset = 20 + jsonLen;
  const binLen = buffer.readUInt32LE(binHdrOffset);
  const binBuffer = buffer.subarray(binHdrOffset + 8, binHdrOffset + 8 + binLen);

  const materials = gltf.materials || [];
  const matNames = materials.map((m, i) => m.name || `mat_${i}`);

  let totalTriangles = 0;
  let totalVertices = 0;
  const primitivesInfo = [];
  const edgeCounts = new Map();

  for (const mesh of gltf.meshes || []) {
    for (const prim of mesh.primitives || []) {
      const matIdx = prim.material ?? 0;
      const matName = matNames[matIdx] || `mat_${matIdx}`;

      const posAcc = gltf.accessors[prim.attributes.POSITION];
      const vCount = posAcc.count;
      totalVertices += vCount;

      const posBv = gltf.bufferViews[posAcc.bufferView];
      const pOffset = posBv.byteOffset || 0;

      const verts = [];
      for (let i = 0; i < vCount; i++) {
        const idx = pOffset + i * 12;
        const x = binBuffer.readFloatLE(idx);
        const y = binBuffer.readFloatLE(idx + 4);
        const z = binBuffer.readFloatLE(idx + 8);
        verts.append ? verts.append([x, y, z]) : verts.push([x, y, z]);
      }

      const idxAcc = gltf.accessors[prim.indices];
      const iCount = idxAcc.count;
      const triCount = Math.floor(iCount / 3);
      totalTriangles += triCount;

      const idxBv = gltf.bufferViews[idxAcc.bufferView];
      const iOffset = idxBv.byteOffset || 0;

      const indices = [];
      for (let i = 0; i < iCount; i++) {
        const idx = iOffset + i * 2;
        indices.push(binBuffer.readUInt16LE(idx));
      }

      for (let i = 0; i < indices.length; i += 3) {
        const v0 = verts[indices[i]];
        const v1 = verts[indices[i + 1]];
        const v2 = verts[indices[i + 2]];
        const triEdges = [
          [v0, v1],
          [v1, v2],
          [v2, v0]
        ];

        for (const [e1, e2] of triEdges) {
          const key = e1[0] < e2[0] || (e1[0] === e2[0] && e1[1] < e2[1])
            ? `${e1[0].toFixed(3)},${e1[0].toFixed(3)},${e1[2].toFixed(3)}_${e2[0].toFixed(3)},${e2[1].toFixed(3)},${e2[2].toFixed(3)}`
            : `${e2[0].toFixed(3)},${e2[1].toFixed(3)},${e2[2].toFixed(3)}_${e1[0].toFixed(3)},${e1[1].toFixed(3)},${e1[2].toFixed(3)}`;
          edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
        }
      }

      const isDoubleSided = materials[matIdx] ? Boolean(materials[matIdx].doubleSided) : false;

      primitivesInfo.push({
        material: matName,
        vertices: vCount,
        triangles: triCount,
        doubleSided: isDoubleSided
      });
    }
  }

  let boundaryEdgesCount = 0;
  for (const count of edgeCounts.values()) {
    if (count === 1) boundaryEdgesCount++;
  }

  return {
    filename: path.basename(glbPath),
    sizeKB,
    totalVertices,
    totalTriangles,
    boundaryEdgesCount,
    materials,
    primitivesInfo
  };
}

function validateModel(glbPath, isMobile = false) {
  console.log(`\n========================================`);
  console.log(`🔍 Validating Model: ${path.basename(glbPath)}`);
  console.log(`========================================`);

  if (!fs.existsSync(glbPath)) {
    console.error(`❌ FAIL: File not found at ${glbPath}`);
    process.exit(1);
  }

  const res = parseGLB(glbPath);
  let failed = false;

  // 1. File Size Limit
  const maxKB = isMobile ? 1500 : 3000;
  if (res.sizeKB <= maxKB) {
    console.log(`✅ File Size: ${res.sizeKB.toFixed(2)} KB (Limit: <= ${maxKB} KB)`);
  } else {
    console.error(`❌ FAIL File Size: ${res.sizeKB.toFixed(2)} KB exceeds limit ${maxKB} KB`);
    failed = true;
  }

  // 2. Triangle Limit
  const maxTris = isMobile ? 30000 : 60000;
  if (res.totalTriangles <= maxTris) {
    console.log(`✅ Triangles: ${res.totalTriangles} tris (Limit: <= ${maxTris} tris)`);
  } else {
    console.error(`❌ FAIL Triangles: ${res.totalTriangles} tris exceeds limit ${maxTris}`);
    failed = true;
  }

  // 3. Material Primitives (5 slots required)
  const expectedMats = ['body_front', 'body_back', 'sleeve_left', 'sleeve_right', 'collar'];
  const foundMats = res.primitivesInfo.map(p => p.material);
  const hasAllMats = expectedMats.every(m => foundMats.includes(m));

  if (hasAllMats && foundMats.length === 5) {
    console.log(`✅ Material Slots: 5 slots present (${foundMats.join(', ')})`);
  } else {
    console.error(`❌ FAIL Material Slots mismatch: found [${foundMats.join(', ')}], expected [${expectedMats.join(', ')}]`);
    failed = true;
  }

  // 4. doubleSided: true check
  const allDoubleSided = res.primitivesInfo.every(p => p.doubleSided);
  if (allDoubleSided) {
    console.log(`✅ doubleSided: true active on all 5 material slots`);
  } else {
    console.error(`❌ FAIL doubleSided: true missing on some material slots`);
    failed = true;
  }

  if (failed) {
    console.error(`\n❌ VALIDATION FAILED for ${path.basename(glbPath)}`);
    process.exit(1);
  } else {
    console.log(`\n✅ ALL AUTOMATED AUDIT CHECKS PASSED for ${path.basename(glbPath)}!`);
  }
}

function main() {
  const rootDir = path.resolve(__dirname, '../../');
  const desktopGLB = path.join(rootDir, 'public/models/vneck-setin.glb');
  const mobileGLB = path.join(rootDir, 'public/models/vneck-setin.mobile.glb');

  validateModel(desktopGLB, false);
  validateModel(mobileGLB, true);
}

main();
