const fs = require("fs");
const path = require("path");

function inspect() {
  const glbPath = path.join(__dirname, "public", "avatar.glb");
  if (!fs.existsSync(glbPath)) {
    console.error("glb not found");
    return;
  }

  const buffer = fs.readFileSync(glbPath);
  const chunkLength = buffer.readUInt32LE(12);
  const jsonStr = buffer.toString("utf8", 20, 20 + chunkLength);
  const gltf = JSON.parse(jsonStr);

  const nodes = gltf.nodes || [];
  const meshes = gltf.meshes || [];
  const materials = gltf.materials || [];
  const skins = gltf.skins || [];

  let report = "=== NODES ===\n";
  nodes.forEach((n, idx) => {
    report += `Node ${idx}: Name="${n.name}", MeshIdx=${n.mesh !== undefined ? n.mesh : "none"}, Joint=${n.joint !== undefined ? n.joint : "none"}\n`;
  });

  report += "\n=== MESHES ===\n";
  meshes.forEach((m, idx) => {
    report += `Mesh ${idx}: Name="${m.name}"\n`;
    if (m.primitives) {
      m.primitives.forEach((prim, pIdx) => {
        const targets = prim.targets || [];
        report += `  Prim ${pIdx}: targetsCount=${targets.length}\n`;
        const extras = prim.extras || {};
        if (extras.targetNames) {
          report += `    TargetNames: ${JSON.stringify(extras.targetNames)}\n`;
        }
      });
    }
  });

  report += "\n=== MATERIALS ===\n";
  materials.forEach((mat, idx) => {
    report += `Material ${idx}: Name="${mat.name}"\n`;
  });

  report += "\n=== SKINS ===\n";
  skins.forEach((s, idx) => {
    report += `Skin ${idx}: Name="${s.name || "none"}", jointsCount=${s.joints.length}\n`;
  });

  fs.writeFileSync("glb_report.txt", report);
  console.log("Written report to glb_report.txt successfully!");
}

inspect();
