import { motion } from "framer-motion";
import CONSTANTS from "@/utils/constants/constants";
import { Award, Globe } from "lucide-react";
export const AboutSection = () => {
    return (
        <section id="about" className="py-24 bg-[#030303] border-t border-white/5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-900/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-900/10 blur-[100px] rounded-full" />

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-white mb-6"
                    >
                        Behind the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Digital Evolution</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg leading-relaxed mb-8"
                    >
                        I founded {CONSTANTS.AGENCY_NAME} with a singular mission: to bridge the gap between complex engineering and intuitive design.
                        <br /><br />
                        With over 5 years of experience shipping 100+ projects, my team and I specialize in high-stakes environments where uptime, scalability, and performance aren't just goals—they are requirements. We don't just build apps; we build businesses.
                    </motion.p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white">Global Reach</div>
                                <div className="text-xs text-gray-500">Clients in 15+ countries</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white">Top Rated</div>
                                <div className="text-xs text-gray-500">Industry recognized</div>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    {/* Abstract Code/Profile Visual */}
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 p-1">
                        <div className="w-full h-full rounded-xl bg-[#080808] overflow-hidden relative">
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-90 mix-blend-normal"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop')" }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                            {/* Mock Code Overlay */}
                            <div className="absolute bottom-6 left-6 right-6 font-mono text-xs text-teal-400 bg-black/80 backdrop-blur-md p-4 rounded-lg border border-teal-500/20">
                                <div className="text-gray-500">// DevoraX Core Mission</div>
                                <div className="text-emerald-400">class</div> <span className="text-white">FutureBuilder</span> <span className="text-yellow-400">{`{`}</span>
                                <div className="pl-4">
                                    <span className="text-purple-400">constructor</span>() <span className="text-yellow-400">{`{`}</span>
                                </div>
                                <div className="pl-8">
                                    <span className="text-blue-400">this</span>.passion = <span className="text-orange-400">"Innovation"</span>;
                                </div>
                                <div className="pl-8">
                                    <span className="text-blue-400">this</span>.stack = [<span className="text-orange-400">"React"</span>, <span className="text-orange-400">"AI"</span>, <span className="text-orange-400">"Cloud"</span>];
                                </div>
                                <div className="pl-4"><span className="text-yellow-400">{`}`}</span></div>
                                <div><span className="text-yellow-400">{`}`}</span></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}