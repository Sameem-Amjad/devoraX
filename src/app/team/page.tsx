import { Metadata } from "next";
import TeamClient from "./TeamClient";

export const metadata: Metadata = {
  title: "Our Team | DevoraX",
  description:
    "Meet the people behind DevoraX — a multidisciplinary team of engineers, designers, and DevOps specialists building the world's next digital products.",
};

export default function TeamPage() {
  return <TeamClient />;
}
