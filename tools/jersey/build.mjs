import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

console.log(`========================================`);
console.log(`🚀 Master Rebuild Pipeline: Riza Apparel 3D Jersey Assets`);
console.log(`========================================\n`);

try {
  console.log(`1. Rendering 2048x2048 sRGB UV Atlas...`);
  execSync(`python tools/jersey/atlas-renderer.py`, { cwd: rootDir, stdio: 'inherit' });

  console.log(`\n2. Building 3D Volumetric GLB Meshes (vneck-setin & raglan-crew)...`);
  execSync(`python assets-pipeline/scripts/build-jersey-glb.py`, { cwd: rootDir, stdio: 'inherit' });

  console.log(`\n3. Running Automated Validation Audit (validate-jersey.mjs)...`);
  execSync(`node tools/jersey/validate-jersey.mjs`, { cwd: rootDir, stdio: 'inherit' });

  console.log(`\n========================================`);
  console.log(`🎉 SUCCESS: Master 3D Jersey Asset Rebuild Complete!`);
  console.log(`========================================`);
} catch (err) {
  console.error(`\n❌ Rebuild Pipeline Error:`, err.message);
  process.exit(1);
}
