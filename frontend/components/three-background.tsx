"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Float, MeshDistortMaterial } from "@react-three/drei"
import { useRef } from "react"
import type * as THREE from "three"

function AnimatedSphere({
  position,
  color,
  speed,
  size = 1,
}: { position: [number, number, number]; color: string; speed: number; size?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 4]} />
        <MeshDistortMaterial color={color} transparent opacity={0.12} distort={0.4} speed={2} roughness={0.2} />
      </mesh>
    </Float>
  )
}

function GridPlane() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[60, 60, 40, 40]} />
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.025} />
    </mesh>
  )
}

function GlowOrb({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  )
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 12], fov: 55 }}>
        <color attach="background" args={["#0a0a12"]} />
        <fog attach="fog" args={["#0a0a12", 8, 35]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[10, 10, 10]} intensity={0.4} color="#34d399" />
        <pointLight position={[-10, -10, -10]} intensity={0.2} color="#22d3ee" />

        <Stars radius={80} depth={60} count={2500} factor={4} saturation={0} fade speed={0.8} />

        <AnimatedSphere position={[-5, 2, -8]} color="#34d399" speed={1.2} size={1.5} />
        <AnimatedSphere position={[6, -1, -10]} color="#22d3ee" speed={0.9} size={1.8} />
        <AnimatedSphere position={[0, 4, -12]} color="#a78bfa" speed={0.7} size={1.2} />
        <AnimatedSphere position={[-3, -3, -6]} color="#f472b6" speed={1.4} size={0.8} />

        <GlowOrb position={[3, 2, -4]} color="#34d399" />
        <GlowOrb position={[-4, -1, -5]} color="#22d3ee" />
        <GlowOrb position={[2, -2, -3]} color="#a78bfa" />

        <GridPlane />
      </Canvas>
    </div>
  )
}
