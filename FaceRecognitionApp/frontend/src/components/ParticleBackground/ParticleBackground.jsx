// ParticleBackground.jsx
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // or: import { loadFull } from "tsparticles";

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // loads the shapes/movers/interactivity into the engine
    await loadSlim(engine); // or await loadFull(engine)
  }, []);

  const particlesOptions = {
    // keep the canvas inside your container instead of fullscreen
    fullScreen: { enable: true },
    // background: { color: { value: "#0d47a1" } },
    fpsLimit: 60,
    particles: {
      number: { value: 120, density: { enable: true, area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5, animation: { enable: false } },           // opacity.anim -> opacity.animation
      size: { value: { min: 1, max: 3 }, animation: { enable: true } }, // size.anim -> size.animation
      links: {                                                         // line_linked -> links
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        straight: false,
        outModes: { default: "out" },                                  // out_mode -> outModes
        attract: { enable: false },
      },
    },
    interactivity: {
      detectsOn: "canvas",                                             // detect_on -> detectsOn
      events: {
        onHover: { enable: true, mode: "repulse" },                    // onhover -> onHover
        onClick: { enable: true, mode: "push" },                       // onclick -> onClick
        resize: true,
      },
      modes: {
        grab: { distance: 400, links: { opacity: 1 } },                // line_linked -> links
        bubble: { distance: 400, size: 40, duration: 2, opacity: 0.8, speed: 3 },
        repulse: { distance: 200, duration: 0.4 },
        push: { quantity: 4 },                                         // particles_nb -> quantity
        remove: { quantity: 2 },
      },
    },
    detectRetina: true,                                                // retina_detect -> detectRetina
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
    </div>
  );
};

export default ParticleBackground;
