import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '../components/Header'
import { Theme, ThemePanel } from "@radix-ui/themes";

export const Route = createRootRoute({
  component: () => (
    <>
      <Theme accentColor="yellow" grayColor="mauve" radius="large" scaling="95%">
        <Header />
        <Outlet />
        {/* <ThemePanel /> */}
        <TanStackRouterDevtools />
      </Theme>
    </>
  ),
})
