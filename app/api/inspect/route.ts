import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const glbPath = path.join(process.cwd(), "public", "avatar.glb");

  if (!fs.existsSync(glbPath)) {
    return NextResponse.json({ error: "avatar.glb not found" }, { status: 404 });
  }

  try {
    const buffer = fs.readFileSync(glbPath);
    
    // GLB header: magic (4 bytes), version (4 bytes), length (4 bytes)
    const magic = buffer.toString("utf8", 0, 4);
    if (magic !== "glTF") {
      return NextResponse.json({ error: "Not a valid glTF/GLB file" }, { status: 400 });
    }

    const version = buffer.readUInt32LE(4);
    const length = buffer.readUInt32LE(8);

    // Chunk 0: JSON content
    const chunkLength = buffer.readUInt32LE(12);
    const chunkType = buffer.toString("utf8", 16, 20);

    if (chunkType !== "JSON") {
      return NextResponse.json({ error: "First chunk is not JSON" }, { status: 400 });
    }

    const jsonStr = buffer.toString("utf8", 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);

    const nodes = gltf.nodes || [];
    const meshes = gltf.meshes || [];
    const materials = gltf.materials || [];
    const skins = gltf.skins || [];

    const nodesList = nodes.map((n: any, idx: number) => ({
      index: idx,
      name: n.name,
      mesh: n.mesh !== undefined ? n.mesh : null,
      joint: n.joint !== undefined ? n.joint : null,
      rotation: n.rotation || null,
      translation: n.translation || null,
      scale: n.scale || null
    }));

    const meshesList = meshes.map((m: any, idx: number) => {
      const primitives = m.primitives || [];
      const targets = primitives[0]?.targets || [];
      const targetNames = m.extras?.targetNames || primitives[0]?.extras?.targetNames || [];
      return {
        index: idx,
        name: m.name,
        targetsCount: targets.length,
        targetNames: targetNames
      };
    });

    const skinsList = skins.map((s: any, idx: number) => ({
      index: idx,
      name: s.name || "none",
      jointsCount: s.joints.length
    }));

    const materialsList = materials.map((m: any, idx: number) => ({
      index: idx,
      name: m.name
    }));

    return NextResponse.json({
      success: true,
      version,
      length,
      nodeCount: nodesList.length,
      nodes: nodesList,
      meshes: meshesList,
      skins: skinsList,
      materials: materialsList
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
