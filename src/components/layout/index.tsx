import { Box } from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouter } from "next/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();

    return <Box>{children}</Box>;
};

export default Layout;
