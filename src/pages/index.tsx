import { useRouter } from "next/router";
import { useEffect } from "react";

// pages/index.tsx
export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/editor'); // 重定向到 /home
    }, []);

    return null; // 不渲染内容
}