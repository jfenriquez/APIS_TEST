import Playground from "@/components/ApiPlayground";

import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-[var(--color-bg)] text-[var(--color-text)]">
      <Playground />
    </div>
  );
}
