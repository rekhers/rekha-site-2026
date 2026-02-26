"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import { useMemo } from "react";
import { Color } from "three";

const TAG_COLORS = {
  Noun: "#7c3aed",
  Verb: "#06b6d4",
  Adjective: "#ec4899",
  Adverb: "#f59e0b",
  Pronoun: "#10b981",
  Determiner: "#a1a1aa",
  Preposition: "#38bdf8",
  Conjunction: "#94a3b8",
  Value: "#eab308",
  QuestionWord: "#f472b6",
  Other: "#64748b",
};

const tagLayer = (tag) => {
  switch (tag) {
    case "Verb":
      return 0.6;
    case "Noun":
      return 0.3;
    case "Adjective":
      return 0.75;
    case "Adverb":
      return 0.5;
    case "Pronoun":
      return 0.3;
    case "Determiner":
      return 0.2;
    case "Preposition":
      return 0.15;
    case "Conjunction":
      return 0.1;
    case "Value":
      return 0.35;
    case "QuestionWord":
      return 0.65;
    default:
      return 0.2;
  }
};

const pickTag = (tags) => {
  if (!tags) return "Other";
  if (tags.Verb) return "Verb";
  if (tags.Noun) return "Noun";
  if (tags.Adjective) return "Adjective";
  if (tags.Adverb) return "Adverb";
  if (tags.Pronoun) return "Pronoun";
  if (tags.Determiner) return "Determiner";
  if (tags.Preposition) return "Preposition";
  if (tags.Conjunction) return "Conjunction";
  if (tags.Value) return "Value";
  if (tags.QuestionWord) return "QuestionWord";
  return "Other";
};

export default function SyntaxOrchestraScene({ terms }) {
  const { nodes, edges, root } = useMemo(() => {
    const count = terms.length || 1;
    const root = {
      id: "root",
      position: [0, 0.95, 0],
      color: "#f8fafc",
      label: "ROOT",
      tag: "Root",
    };

    const verbIndexes = terms
      .map((term, index) => ({ index, tag: pickTag(term.tags) }))
      .filter((item) => item.tag === "Verb")
      .map((item) => item.index);

    const findNearestVerb = (index) => {
      if (!verbIndexes.length) return null;
      let closest = verbIndexes[0];
      let distance = Math.abs(index - closest);
      verbIndexes.forEach((verbIndex) => {
        const nextDistance = Math.abs(index - verbIndex);
        if (nextDistance < distance) {
          distance = nextDistance;
          closest = verbIndex;
        }
      });
      return closest;
    };

    const nodes = terms.map((term, index) => {
      const tag = pickTag(term.tags);
      const x = count === 1 ? 0 : (index / (count - 1)) * 3.2 - 1.6;
      const z = Math.sin(index * 0.6) * 0.4;
      const y = tagLayer(tag);
      return {
        id: term.text + index,
        position: [x, y, z],
        color: TAG_COLORS[tag] || TAG_COLORS.Other,
        label: term.text,
        tag,
        index,
      };
    });

    const edges = [];
    nodes.forEach((node) => {
      if (node.tag === "Verb") {
        edges.push([root.position, node.position]);
        return;
      }
      const verbIndex = findNearestVerb(node.index);
      if (verbIndex === null) {
        edges.push([root.position, node.position]);
        return;
      }
      const parent = nodes.find((item) => item.index === verbIndex);
      if (parent) {
        edges.push([parent.position, node.position]);
      } else {
        edges.push([root.position, node.position]);
      }
    });

    return { nodes, edges, root };
  }, [terms]);

  return (
    <div className="syntax-stage">
      <Canvas camera={{ position: [0, 1.2, 3.5], fov: 45 }}>
        <color attach="background" args={["#0b0a0f"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 2]} intensity={0.8} />

        <mesh position={root.position}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color={root.color} />
        </mesh>

        {nodes.map((node) => (
          <group key={node.id}>
            <mesh position={node.position}>
              <sphereGeometry args={[0.07, 24, 24]} />
              <meshStandardMaterial color={new Color(node.color)} />
            </mesh>
            <Text
              position={[node.position[0], node.position[1] + 0.14, node.position[2]]}
              fontSize={0.08}
              color="#f8fafc"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.8}
            >
              {node.label}
            </Text>
          </group>
        ))}
        {edges.map((edge, index) => (
          <Line
            key={`edge-${index}`}
            points={edge}
            color="#334155"
            lineWidth={1}
            transparent
            opacity={0.6}
          />
        ))}

        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
