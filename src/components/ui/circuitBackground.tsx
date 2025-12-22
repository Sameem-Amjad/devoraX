export const CircuitBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
    
    {/* Glowing Orbs */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/20 blur-[120px] rounded-full mix-blend-screen" />
    <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full mix-blend-screen" />
  </div>
);
