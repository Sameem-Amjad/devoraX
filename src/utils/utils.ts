import { Code2, Cpu, Layout, Server, Smartphone, Zap } from "lucide-react";
import React from "react";

const getIcon = (name: string) => {
    const icons: Record<string, typeof Code2> = { Smartphone, Cpu, Server, Layout, Code2, Zap };
    const IconComponent = icons[name] || Code2;
    return React.createElement(IconComponent, { className: "w-6 h-6" });
};

export default getIcon;