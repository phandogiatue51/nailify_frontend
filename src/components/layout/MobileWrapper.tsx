import MobileLayout from "./MobileLayout";

export const withMobileLayout = (element: React.ReactNode, showNav = true) => (
    <MobileLayout showNav={showNav}>{element}</MobileLayout>
);
